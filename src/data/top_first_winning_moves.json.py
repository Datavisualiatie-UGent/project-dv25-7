import json

import chess.pgn
from chess import Board, Move

DATASET_PATH = "dataset/dataset.pgn"


def top_first_winning_moves():
    pgn = open(DATASET_PATH)
    b = Board()
    first_moves = {m.uci(): {"count": 0} for m in b.legal_moves}
    b.push(Move.from_uci("e2e3"))
    # add all black moves
    for m in b.legal_moves:
        first_moves[m.uci()] = {"count": 0}

    counter = 0
    while (game := chess.pgn.read_game(pgn)) is not None and counter < 20:
        counter += 1
        moves = list(game.mainline_moves())
        if len(moves) > 0:
            # if white won the game, then count the win for white's move, otherwise black's move
            if game.headers["Result"] == "1-0":
                first_moves[moves[0].uci()]["count"] += 1
            else:
                first_moves[moves[1].uci()]["count"] += 1
                first_moves[moves[1].uci()]["previous"] = moves[0].uci()
    movie_list = []
    for move, _ in first_moves.items():
        if "previous" in first_moves[move].keys():
            movie_list.append({"move": move, "count": first_moves[move]["count"], "previous": first_moves[move]["previous"]})
        else:
            movie_list.append({"move": move, "count": first_moves[move]["count"]})
    return movie_list


def main():
    first_moves = top_first_winning_moves()

    print(json.dumps(first_moves))


if __name__ == "__main__":
    main()
