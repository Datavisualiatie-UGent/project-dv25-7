# Winning at chess as group effort
_Wouter de Bolle & Jozef Jankaj_

"Wisdom of the crowd" is a phenomenon observed in statistics and forms the basis of our democratic system. 
When making decisions that impact millions of people, we do not rely on a single individual or a group of experts making the correct decision:
indeed, we take a vote. 

The idea is simple: no one person has all knowledge and perfect perspective on any issue. By averaging out individual preferences, biases and opinions (aka. the noise), we reach a consensus that is, more often than not, the best option.

# Moves explorer

In this document, we explore an application of this phenomenon in terms of chess games. We have taken a dataset of chess games from Lichess July 2016 (~2.5M games) and analyzed it for the most favourite first 10 moves: 5 white moves and 5 black moves. By clicking on different pieces, you can explore how chess players in July 2016 approached this age-old game of wits.


```js
import {moves_explorer} from "./components/moves_explorer_heatmap.js"
import {colorLegend} from "./components/colorLegend.js"
import { buttonCTA } from './components/button.js';
```

```js
const game_tree = await FileAttachment("./data/game_tree.json").json();
const top_winner_moves = await FileAttachment("data/top_first_winning_moves.json").json()
```

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
