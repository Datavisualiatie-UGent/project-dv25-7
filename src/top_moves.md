# Top moves


## Most popular moves
Most popular first moves.
```js
const top_moves = await FileAttachment("./data/top_first_moves.json").json();
display(top_moves);
```

## Most winning first moves
Moves that lead to most wins.

```js
const top_winner_moves = await FileAttachment("./data/top_first_winning_moves.json").json()
display(top_winner_moves)
```

## Legends of chess
### Most successful players

```js
const winners = await FileAttachment("./data/most_successful_players.json").json()
display(winners)
```