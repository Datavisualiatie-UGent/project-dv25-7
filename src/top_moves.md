# Top moves


## Most popular moves
Most popular first moves.
```js
import {plot_chessboard} from "./components/opening_heatmap.js";
```



```js
const top_moves = await FileAttachment("./data/top_first_moves.json").json();
```

```js
plot_chessboard(top_moves)
```

## Most winning first moves
Moves that lead to most wins.

```js
const top_winner_moves = await FileAttachment("./data/top_first_winning_moves.json").json()
```

```js
plot_chessboard(top_winner_moves)
```

## Legends of chess
### Most successful players

```js
const winners = await FileAttachment("./data/most_successful_players.json").json()
display(winners)
```

```js
const color = Plot.scale({
  color: {
    type: "categorical",
    domain: d3.groupSort(winners, (D) => -D.length, (d) => d.state).filter((d) => d !== "Other"),
    unknown: "var(--theme-foreground-muted)"
  }
});
```

```js
function launchTimeline(data, {width} = {}) {
  return Plot.plot({
    title: "Most succesfull players.",
    width,
    height: 300,
    y: {grid: true, label: "players"},
    marks: [
        Plot.barX(data, {x: "games", y: "player", fill: "steelblue", tip: true})

    ]
  });
}
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => launchTimeline(winners, {width}))}
  </div>
</div>
