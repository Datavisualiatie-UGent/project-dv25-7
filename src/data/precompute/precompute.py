from __future__ import annotations

import dataclasses
import json
from multiprocessing import Process
from typing import List

import chess.pgn
from stockfish import Stockfish

DATASET_PATH = "dataset/dataset.pgn"
TOP_MOVES_CACHE = "dataset/top_moves_cache.csv"
# Set this path to correct stockfish binary
STOCKFISH_PATH = "/home/messik/stockfish/src/stockfish"


def precompute_top_first_moves():
    """
    Precompute the first moves from the dataset and store them in a file
    :return: None
    """
    with open(DATASET_PATH) as pgn:
        b = chess.Board()
        first_moves = {m.uci(): {"count": 0} for m in b.legal_moves}
        # print("processing games")
        counter = 0
        print("Precomputing top first moves...")
        while (game := chess.pgn.read_game(pgn)) is not None:
            counter += 1
            moves = list(game.mainline_moves())
            if len(moves) > 0:
                move = moves[0].uci()
                first_moves[move]["count"] += 1

            if counter % 1000 == 0:  # every 1000 games, status update
                print(f"Processed {counter} games")

    print("Computation done, writing...")
    with open(TOP_MOVES_CACHE, "w") as f:
        f.write("move,count\n")
        for move, v in first_moves.items():
            f.write(f"{move},{v["count"]}\n")


@dataclasses.dataclass
class MoveStat:
    move: str
    count: int
    next_moves: List[MoveStat]

    def to_json(self):
        return {"move": self.move, "count": self.count, "next_moves": list(map(lambda x: x.to_json(), self.next_moves))}

    @staticmethod
    def from_json(json):
        return MoveStat(json["move"],
                        json["count"],
                        list(map(lambda x: MoveStat.from_json(x), json["next_moves"]))
                        )


def get_move_statistics(first_n_moves=5):
    with open(DATASET_PATH) as handle:
        moves: List[MoveStat] = []
        for game_i, game in enumerate(read_games(handle)):
            current_movestat = None

            game_moves = list(game.mainline_moves())

            if len(game_moves) <= 0:
                continue  # skip empty games

            for i, move in enumerate(game_moves):
                if i >= first_n_moves * 2:  # gather both black and white first_n_moves moves
                    break

                if i == 0:
                    # check if the first move has already existing first move
                    first = [m for m in moves if m.move == move.uci()]
                    if len(first) > 0:
                        first = first[0]
                        current_movestat = first
                        current_movestat.count += 1
                    else:
                        current_movestat = MoveStat(move.uci(), 1, [])
                        moves.append(current_movestat)
                else:
                    # search among the current movestat
                    next = [m for m in current_movestat.next_moves if m.move == move.uci()]
                    if len(next) > 0:
                        current_movestat = next[0]
                        current_movestat.count += 1
                    else:
                        new = MoveStat(move.uci(), 1, [])
                        current_movestat.next_moves.append(new)
                        current_movestat = new
        return moves


# generator to get all games
def read_games(handle):
    counter = 0
    while (game := chess.pgn.read_game(handle)) is not None:
        counter += 1
        if counter % 1000 == 0: print(f"Processed {counter} games")
        # if counter > 2: break
        if counter > 10_000: break
        yield game


def get_winning_move_statistics(first_n_moves=5):
    with (open(DATASET_PATH) as handle):
        moves: List[MoveStat] = []
        for game_id, game in enumerate(read_games(handle)):
            if game.headers["Result"] == "0-1":
                print("black won")
            current_movestat = None
            game_moves = list(game.mainline_moves())

            if len(game_moves) <= 0:
                continue  # skip empty games

            for i, move in enumerate(game_moves):
                if i >= first_n_moves * 2: break

                # first move
                if i == 0 and game.headers["Result"] == "1-0":
                    m = [m for m in moves if m.move == move.uci()]
                    if len(m) > 0:
                        current_movestat = m[0]
                        current_movestat.count += 1
                    else:
                        current_movestat = MoveStat(move.uci(), 1, [])
                        moves.append(current_movestat)
                    continue
                elif i == 0:
                    break

                next_moves = [m.move for m in  current_movestat.next_moves]

                if move.uci() in next_moves:
                    if( i % 2 == 0 and game.headers["Result"] == "1-0" )or (i % 2 == 1 and game.headers["Result"] == "0-1"):
                        m = [m for m in moves if m.move == move.uci()]
                        if len(m) > 0:
                            current_movestat = m[0]
                            current_movestat.count += 1
                        else:
                            new = MoveStat(move.uci(), 1, [])
                            current_movestat.next_moves.append(new)
                            current_movestat = new
                elif game.headers["Result"] == "0-1":
                    print("black won")

        return moves


def get_stockfish_assessment():
    stockfish = Stockfish(path=STOCKFISH_PATH, depth=15,
                          parameters={"Threads": 4})
    best_moves = {}

    # best_moves[stockfish.get_fen_position()] = [m['Move'] for m in stockfish.get_top_moves(5)]

    print("Reading the file")
    with open("dataset/moves_tree.json") as handle:
        tree = json.load(handle)

    print("Parsing to MoveStat")
    next_moves = [MoveStat.from_json(x) for x in tree]
    root = MoveStat("", -1, next_moves=next_moves)

    print("Calculating evals")
    get_stockfish_moves(stockfish, [], root, best_moves)

    print("writing data")
    with open("dataset/stockfish_moves.json", "w+") as handle:
        json.dump(best_moves, handle, indent=2)


def get_stockfish_moves(stockfish: Stockfish, move_history: List[str], current_movestat: MoveStat, best_moves: dict):
    # set the board
    moves = [m for m in move_history]
    moves.append(current_movestat.move)
    stockfish.set_position(moves)
    if stockfish.get_fen_position() not in best_moves:
        best_moves[stockfish.get_fen_position()] = [m["Move"] for m in stockfish.get_top_moves(5)]

    if len(current_movestat.next_moves) <= 0:
        return

    for next_movestat in current_movestat.next_moves:
        get_stockfish_moves(stockfish, moves, next_movestat, best_moves)


def move_statistics_to_file(first_n_moves=5):
    print("Generating move statistics")
    moves = get_move_statistics(first_n_moves)
    print("Processing move statistics to JSON")
    moves = list(map(lambda x: x.to_json(), moves))
    print("Writing move statistics back")
    with open("dataset/moves_tree.json", "w+") as f:
        json.dump(moves, f, indent=2)


def move_win_statistics_to_file(first_n_moves=5):
    print("Generating winning moves statistics")
    moves = get_winning_move_statistics(first_n_moves)

    print("Processing winning moves to JSON")
    moves = list(map(lambda x: x.to_json(), moves))

    print("Writing")
    with open("dataset/winning_moves_tree.json", "w+") as f:
        json.dump(moves, f, indent=2)


if __name__ == "__main__":
    get_stockfish_assessment()
    exit(1)
    # main()
    # p = Process(target=move_statistics_to_file, args=(5,))
    p2 = Process(target=move_win_statistics_to_file, args=(5,))
    # p.start()
    p2.start()
    # p.join()
    p2.join()
