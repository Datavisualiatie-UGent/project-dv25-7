import json

import chess.pgn

DATASET_PATH = "dataset/dataset.pgn"


def top_winners(limit: int = 10):
    pgn = open(DATASET_PATH)

    winners = {}

    counter = 0
    while (game := chess.pgn.read_game(pgn)) is not None and counter < 20:
        counter += 1

        if game.headers["White"] not in winners:
            winners[game.headers["White"]] = {"total_wins": 0, "black_wins": 0, "white_wins": 0, "games": 0}
        if game.headers["Black"] not in winners:
            winners[game.headers["Black"]] = {"total_wins": 0, "black_wins": 0, "white_wins": 0, "games": 0}

        winners[game.headers["Black"]]["games"] += 1
        winners[game.headers["White"]]["games"] += 1

        if game.headers["Result"] == "0-1":
            winners[game.headers["Black"]]["black_wins"] += 1
            winners[game.headers["Black"]]["total_wins"] += 1
        elif game.headers["Result"] == "1-0":
            winners[game.headers["White"]]["white_wins"] += 1
            winners[game.headers["White"]]["total_wins"] += 1

    # calculate win rate
    winners_list = []
    for key in winners:
        winners_list.append({
            "player": key,
            "total_wins": winners[key]["total_wins"],
            "white_wins": winners[key]["white_wins"],
            "black_wins": winners[key]["black_wins"],
            "games": winners[key]["games"],
            "win_rate": winners[key]["total_wins"] / winners[key]["games"],
        })
        # winners[key]["win_rate"] = winners[key]["total_wins"] / winners[key]["games"]
    return winners_list
    return list(sorted(winners.items(), key=lambda x: x[1]["total_wins"], reverse=True))[:limit]

def main():
    winners = top_winners()
    print(json.dumps(winners))

if __name__ == "__main__":
    main()
