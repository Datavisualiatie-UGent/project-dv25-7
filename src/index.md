# Winning at chess as a group effort
_Wouter de Bolle & Jozef Jankaj_

"Wisdom of the crowd" is a phenomenon observed in statistics and forms the basis of our democratic system. 
When making decisions that impact millions of people, we do not rely on a single individual or a group of experts making the correct decision:
indeed, we take a vote. 

The idea is simple: no one person has all knowledge and perfect perspective on any issue. By averaging out individual preferences, biases and opinions (aka. the noise), we reach a consensus that is, more often than not, the best option.



```js
import {opening_board} from "./components/opening_heatmap_2.js";
import {counter_board} from "./components/counter_moves_heatmap.js"
import {plot_chessboard} from "./components/chessboard_logic.js"
import {moves_explorer} from "./components/moves_explorer_heatmap.js"
import {colorLegend} from "./components/colorLegend.js"
import { buttonCTA } from './components/button.js';
import { stockfish_explorer } from "./components/stockfish_board.js"
```

```js
const game_tree = await FileAttachment("./data/game_tree.json").json();
const top_winner_moves = await FileAttachment("data/top_first_winning_moves.json").json()
```

## Moves explorer

In this document, we explore an application of this phenomenon in terms of chess games. We have taken a dataset of chess games from Lichess July 2016 (~1M games) and analyzed it for the most favourite first 10 moves: 5 white moves and 5 black moves. By clicking on different pieces, you can explore how chess players in July 2016 approached this age-old game of wits.


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
container.appendChild(explorerPlot)
container.appendChild(buttonContainer)
const undoButton = buttonCTA("Undo last move", "undo", "#4269D0");
const resetButton = buttonCTA("Reset board", "reset", "#4269D0");
buttonContainer.appendChild(undoButton)
buttonContainer.appendChild(resetButton)
explorerPlot.replaceWith(moves_explorer(game_tree))
```


## Most winning first moves
Below, we show same visualisation, but we have filtered the moves to only those that lead to a win, by either black or white.
The filter is quite simple: if the move eventually lead to white's win, it is included, and same with black.


While games are not necessarily won or lost in the first 10 moves, they form a basis of the game and are in general the most important moves of the game.

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

<div id="winner-moves"></div>

```js
const container_win = document.getElementById("winner-moves");
let explorerPlot_win = html`<div>hello</div>`;
let buttonContainer_win = html`<div style="display: flex; justify-content: center; max-width: 600px; gap: 1em; margin : 1em; padding-bottom: 50px"></div>`
const undoButton_win = buttonCTA("Undo last move", "undo_win", "#4269D0");
const resetButton_win = buttonCTA("Reset board", "reset_win", "#4269D0");
container_win.appendChild(explorerPlot_win);
container_win.appendChild(buttonContainer_win);
buttonContainer_win.appendChild(undoButton_win);
buttonContainer_win.appendChild(resetButton_win);
explorerPlot_win.replaceWith(moves_explorer(top_winner_moves, "reset_win", "undo_win"));
```


## Verifying the wisdom

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
