import json
import os

import chess.pgn
from chess import Board, Move

TOP_MOVES_CACHE = "dataset/top_moves_cache.csv"


def top_first_moves():
    with open(TOP_MOVES_CACHE, "r") as f:
        f.readline() # skip the header
        lines = map(lambda l: l.strip().split(","), f.readlines())

        move_list = [{"move": move, "count": count} for move, count in lines]

        return move_list


def main():
    # print(json.dumps({"Foo": 10}))

    first_moves = top_first_moves()

    print(json.dumps(first_moves))


if __name__ == "__main__":
    main()
