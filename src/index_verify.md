# Verifying the wisdom

The above visualisations only tell us what moves were most favoured by chess players in the dataset. It is our intuition that these moves are indeed the best moves in the positions, since they're most favoured. 

However, it is always good to check our intuitions with reality. This visualisation shows again the most favourite moves in a particular position of chess players in July 2016, but this time we show these in function of evaluation of the position by Stockfish, the best chess engine in the world.

<div class="grid grid-cols-2" style="max-width: 800px">
    <div>
        ${startcolor2}
    </div>
    <div>
        ${endcolor2}
    </div>
</div>

<div id="stockfish"></div>


```js
import {moves_explorer} from "./components/moves_explorer_heatmap.js"
import {colorLegend} from "./components/colorLegend.js"
import { buttonCTA } from './components/button.js';
import { stockfish_explorer } from "./components/stockfish_board.js"
```

```js
const game_tree = await FileAttachment("./data/game_tree.json").json();
const top_winner_moves = await FileAttachment("data/top_first_winning_moves.json").json()
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


```js
const container_win = document.getElementById("stockfish");
let explorerPlot_win = html`<div>`;
let buttonContainer_win_stockfish = html`<div style="display: flex; justify-content: center; max-width: 600px; gap: 1em; margin : 1em; padding-bottom: 50px"></div>`
const undoButton_win_stockfish = buttonCTA("Undo last move", "undo_win", "#4269D0");
const resetButton_win_stockfish = buttonCTA("Reset board", "reset_win", "#4269D0");
container_win.appendChild(explorerPlot_win);
container_win.appendChild(buttonContainer_win_stockfish);
buttonContainer_win_stockfish.appendChild(undoButton_win_stockfish);
buttonContainer_win_stockfish.appendChild(resetButton_win_stockfish);
explorerPlot_win.replaceWith(await stockfish_explorer(game_tree, "reset_win", "undo_win"));
```
