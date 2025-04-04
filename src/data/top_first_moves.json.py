import json

import chess.pgn
from chess import Board

DATASET_PATH = "dataset/dataset.pgn"


def top_first_moves():
    pgn = open(DATASET_PATH)
    first_moves = {}
    b = Board()
    first_moves = {m.uci(): {"count": 0} for m in b.legal_moves}
    # print("processing games")
    counter = 0
    while (game := chess.pgn.read_game(pgn)) is not None and counter < 20:
        counter += 1
        moves = list(game.mainline_moves())
        if len(moves) > 0:
            move = moves[0].uci()
            first_moves[move]["count"] += 1

    return first_moves


def main():
    # print(json.dumps({"Foo": 10}))

    first_moves = top_first_moves()

    print(json.dumps(first_moves))


if __name__ == "__main__":
    main()
