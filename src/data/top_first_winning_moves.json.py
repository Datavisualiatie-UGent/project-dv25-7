import json

GAME_TREE = "dataset/winning_moves_tree.json"


def game_tree():
    with open(GAME_TREE) as json_file:
        print(json.dumps(json.load(json_file)))
        # return json.dumps(json.load(json_file))


if __name__ == "__main__":
    game_tree()
