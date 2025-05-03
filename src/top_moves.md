# Top moves

```js
import {opening_board} from "./components/opening_heatmap_2.js";
import {counter_board} from "./components/counter_moves_heatmap.js"
import {plot_chessboard} from "./components/chessboard_logic.js"
import {moves_explorer} from "./components/moves_explorer_heatmap.js"
import {colorLegend} from "./components/colorLegend.js"
import { buttonCTA } from './components/button.js';
```

```js
const game_tree = await FileAttachment("./data/game_tree.json").json();
```

## Moves explorer
```js
const startcolor = colorLegend({
  colorScale: t => d3.interpolateBlues(0.2 + t * 0.8),
  title: "Start position move count"
})
const endcolor = colorLegend({
    colorScale: d3.interpolateOranges,
    title: "End position move count"
})
```


<div class="grid grid-cols-2" style="max-width: 800px">
    <div>
        ${startcolor}
    </div>
    <div>
        ${endcolor}
    </div>
</div>

<div id="explorer-container"></div>

```js
const container = document.getElementById("explorer-container");
let explorerPlot = html`<div>`;
let buttonContainer = html`<div style="display: flex; justify-content: center; max-width: 600px; gap: 1em; margin : 1em; padding-bottom: 50px"></div>`
const undoButton = buttonCTA("Undo last move", "undo", "#4269D0");
const resetButton = buttonCTA("Reset board", "reset", "#4269D0");
container.appendChild(explorerPlot)
container.appendChild(buttonContainer)
buttonContainer.appendChild(undoButton)
buttonContainer.appendChild(resetButton)
explorerPlot.replaceWith(moves_explorer(game_tree))
```


[//]: # (### Board with top moves)
```js
const top_moves = await FileAttachment("./data/top_first_moves.json").json();
```

```js
// opening_board(top_moves)
```

## Most winning first moves
Moves that lead to most wins.

```js
const top_winner_moves = await FileAttachment("./data/top_first_winning_moves.json").json()
```

```js
const startcolor2 = colorLegend({
  colorScale: t => d3.interpolateBlues(0.2 + t * 0.8),
  title: "Start position move count"
})
const endcolor2 = colorLegend({
    colorScale: d3.interpolateOranges,
    title: "End position move count"
})
```

<div class="grid grid-cols-2" style="max-width: 800px">
    <div> 
        ${startcolor2}
    </div>
    <div>
        ${endcolor2}
    </div>
</div>

```js
Plot.plot(opening_board(top_winner_moves))
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
function legendChart(data, {width} = {}) {
    const sorted_winners = [...data].sort((a, b) => {
        const total_a = a.white_wins + a.black_wins;
        const total_b = b.white_wins + b.black_wins;
        
        if(total_a !== total_b) return total_b - total_a;

        if(a.white_wins !== b.white_wins) return b.white_wins - a.white_wins;
        return b.black_wins - a.black_wins;
    })
    const player_order = sorted_winners.map(d => d.player)
    
    const stackedData = sorted_winners.flatMap(d => [
        { player: d.player, wins: d.white_wins, type: "White Wins", winrate: d.win_rate},
        { player: d.player, wins: d.black_wins, type: "Black Wins", winrate: d.win_rate }
    ]);
    
    return Plot.plot({
        title: "Most succesfull players.",
        width,
        height: 600,
        marginLeft: 100,
        x: {
            label: "wins",
            tickFormat: d => Number.isInteger(d) ? d : null
        },
        y: {grid: true, label: null, domain: player_order},
        color: {
            legend: true, 
            type: "ordinal", 
            domain: ["White Wins", "Black Wins"], 
            range: ["#ffffff", "#333333"] // You can tweak these
        },
        marks: [
            Plot.barX(stackedData, {x: "wins", y: "player", fill: "type", tip: true})
        ]
    });
}
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => legendChart(winners, {width}))}
  </div>
</div>
