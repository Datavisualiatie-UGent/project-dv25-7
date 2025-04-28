from __future__ import annotations

import dataclasses
import json
import multiprocessing
from typing import List

import chess.pgn

DATASET_PATH = "dataset/dataset.pgn"
TOP_MOVES_CACHE = "dataset/top_moves_cache.csv"


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


def get_move_statistics(games, first_n_moves=5):
    moves: List[MoveStat] = []
    for game in games:
        current_movestat = None

        game_moves = list(game.mainline_moves())

        if len(game_moves) <= 0:
            continue  # skip empty games

        for i, move in enumerate(game_moves):
            if i >= first_n_moves * 2:  # gather both black and white first_n_moves moves
                break

            if i == 0:
                # check for existing first move
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


def get_winning_move_statistics(games: list, first_n_moves=5):
    moves: List[MoveStat] = []
    for game in games:
        current_movestat = None
        game_moves = list(game.mainline_moves())

        if len(game_moves) <= 0:
            continue  # skip empty games
        for i, move in enumerate(game_moves):
            if i >= first_n_moves * 2:
                break

            if i == 0:
                first = [m for m in moves if m.move == move.uci()]
                if game.headers["Result"] == "1-0" or game.headers["Result"] == "0-1":  # always include first move unless draw
                    if len(first) > 0:
                        first = first[0]
                        current_movestat = first
                        current_movestat.count += 1
                    else:
                        current_movestat = MoveStat(move.uci(), 1, [])
                        moves.append(current_movestat)
            else:
                # white's move and white won or black's move and black won
                if (i % 2 == 0 and game.headers["Result"] == "1-0") or (i % 2 == 1 and game.headers["Result"] == "0-1"):
                    next = [m for m in current_movestat.next_moves if m.move == move.uci()]
                    if len(next) > 0:
                        current_movestat = next[0]
                        current_movestat.count += 1
                    else:
                        new = MoveStat(move.uci(), 1, [])
                        current_movestat.next_moves.append(new)
                        current_movestat = new
    return moves


def worker(game):
    # grab first move
    moves = list(game.mainline_moves())
    if len(moves) > 0:
        first_move = moves[0]
    else:
        first_move = None

    # grab winning moves => first move that led to a win
    if first_move is not None and game.headers["Result"] == "1-0":
        first_winning_move = first_move
    else:
        first_winning_move = None

    # grab the winner's nick
    if game.headers["Result"] == "1-0":  # white won
        winner = game.headers["White"]
    elif game.headers["Result"] == "0-1":  # black won
        winner = game.headers["Black"]
    else:  # if drawn, no winner
        winner = None

    return first_move, first_winning_move, winner


def get_games():
    with open(DATASET_PATH) as pgn:
        while (g := chess.pgn.read_game(pgn)) is not None:
            yield g


def preprocess_png():
    print("Processing dataset")
    with multiprocessing.Pool(8) as pool:
        processed = pool.imap(worker, get_games(), chunksize=2)

        for i in range(20):
            g = next(processed)
            print(g)


def main():
    preprocess_png()  # precompute_top_first_moves()


if __name__ == "__main__":
    # main()
    with open(DATASET_PATH) as pgn:
        # skip first game
        def read_games(handle):
            counter = 0
            while (game := chess.pgn.read_game(handle)) is not None:
                counter += 1
                if counter % 1000 == 0: print(f"Processed {counter} games")
                # if counter > 2: break
                if counter > 10_000: break
                yield game

        games = list(read_games(pgn))

        print("Generating move statistics")
        moves = get_move_statistics(games)

        print("processing to JSON")
        moves = list(map(lambda x: x.to_json(), moves))

        print("Writing")
        with open("dataset/moves_tree.json", "w+") as f:
            json.dump(moves, f, indent=2)

        del moves

        print("Generating winning moves statistics")
        moves = get_winning_move_statistics(games)

        print("Processing to JSON")
        moves = list(map(lambda x: x.to_json(), moves))

        print("Writing")
        with open("dataset/winning_moves_tree.json", "w+") as f:
            json.dump(moves, f, indent=2)
