# Winning chess as a group effort
Wouter de Bolle & Jozef Jankaj

"Wisdom of the crowd" is a phenomenon observed in statistics and forms a basis of our democratic system. 
When making decisions that impact millions of people, we do not rely on a single individual or a group of experts making the correct decision:
indeed, we take a vote. 

The idea is simple: no one person has all knowledge and perfect perspective on any issue. By averaging out individual preferences, biases and opinions, we reach a consensus that is, more often than not, the best option.



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

In this document, we explore an application of this context in terms of chess games. We have taken a dataset of chess games from Lichess July 2016 (~1M games) and analyzed it for the most favourite first 10 moves: 5 white moves and 5 black moves. By clicking on different pieces, you can explore how chess players in July 2016 approached this age-old game of wits.


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
[//]: # (```js)

[//]: # (const top_moves = await FileAttachment&#40;"./data/top_first_moves.json"&#41;.json&#40;&#41;;)

[//]: # (```)

```js
// opening_board(top_moves)
```

## Most winning first moves
Below, we show same visualisation, but we have filtered the moves to only those that lead to a win, by either black or white.
The filter is quite simple: if the move eventually lead to white's win, it is included, and same with black.


While games are not necessarily won or lost in the first 10 moves, they form a basis of the game and are in general the most important moves of the game.

TODO: fix this for deployment, code doesn't use the json file

[//]: # (```js)

[//]: # (const top_winner_moves = await FileAttachment&#40;"./data/top_first_winning_moves.json"&#41;.json&#40;&#41;)

[//]: # (```)

[//]: # ()
[//]: # (```js)

[//]: # (const startcolor2 = colorLegend&#40;{)

[//]: # (  colorScale: t => d3.interpolateBlues&#40;0.2 + t * 0.8&#41;,)

[//]: # (  title: "Start position move count")

[//]: # (}&#41;)

[//]: # (const endcolor2 = colorLegend&#40;{)

[//]: # (    colorScale: d3.interpolateOranges,)

[//]: # (    title: "End position move count")

[//]: # (}&#41;)

[//]: # (```)

[//]: # ()
[//]: # (<div class="grid grid-cols-2" style="max-width: 800px">)

[//]: # (    <div> )

[//]: # (        ${startcolor2})

[//]: # (    </div>)

[//]: # (    <div>)

[//]: # (        ${endcolor2})

[//]: # (    </div>)

[//]: # (</div>)

[//]: # ()
[//]: # (```js)

[//]: # (Plot.plot&#40;opening_board&#40;top_winner_moves&#41;&#41;)

[//]: # (```)

## Verifying the wisdom

The above visualisations only tell us what moves were most favoured by chess players in the dataset. It is our intuition that these moves are indeed the best moves in the positions, since they're most favoured. 

However, it is always good to check our intuitions with reality. This visualisation shows again the most favourite moves in a particular position of chess players in July 2016, but this time we show these in function of evaluation of the position by Stockfish, the best chess engine in the world.

\<visualisation\>



[//]: # (## Legends of chess)

[//]: # (### Most successful players)

[//]: # ()
[//]: # (```js)

[//]: # (const winners = await FileAttachment&#40;"./data/most_successful_players.json"&#41;.json&#40;&#41;)

[//]: # (display&#40;winners&#41;)

[//]: # (```)

[//]: # ()
[//]: # (```js)

[//]: # (const color = Plot.scale&#40;{)

[//]: # (  color: {)

[//]: # (    type: "categorical",)

[//]: # (    domain: d3.groupSort&#40;winners, &#40;D&#41; => -D.length, &#40;d&#41; => d.state&#41;.filter&#40;&#40;d&#41; => d !== "Other"&#41;,)

[//]: # (    unknown: "var&#40;--theme-foreground-muted&#41;")

[//]: # (  })

[//]: # (}&#41;;)

[//]: # (```)

[//]: # (```js)

[//]: # (function legendChart&#40;data, {width} = {}&#41; {)

[//]: # (    const sorted_winners = [...data].sort&#40;&#40;a, b&#41; => {)

[//]: # (        const total_a = a.white_wins + a.black_wins;)

[//]: # (        const total_b = b.white_wins + b.black_wins;)

[//]: # (        )
[//]: # (        if&#40;total_a !== total_b&#41; return total_b - total_a;)

[//]: # ()
[//]: # (        if&#40;a.white_wins !== b.white_wins&#41; return b.white_wins - a.white_wins;)

[//]: # (        return b.black_wins - a.black_wins;)

[//]: # (    }&#41;)

[//]: # (    const player_order = sorted_winners.map&#40;d => d.player&#41;)

[//]: # (    )
[//]: # (    const stackedData = sorted_winners.flatMap&#40;d => [)

[//]: # (        { player: d.player, wins: d.white_wins, type: "White Wins", winrate: d.win_rate},)

[//]: # (        { player: d.player, wins: d.black_wins, type: "Black Wins", winrate: d.win_rate })

[//]: # (    ]&#41;;)

[//]: # (    )
[//]: # (    return Plot.plot&#40;{)

[//]: # (        title: "Most succesfull players.",)

[//]: # (        width,)

[//]: # (        height: 600,)

[//]: # (        marginLeft: 100,)

[//]: # (        x: {)

[//]: # (            label: "wins",)

[//]: # (            tickFormat: d => Number.isInteger&#40;d&#41; ? d : null)

[//]: # (        },)

[//]: # (        y: {grid: true, label: null, domain: player_order},)

[//]: # (        color: {)

[//]: # (            legend: true, )

[//]: # (            type: "ordinal", )

[//]: # (            domain: ["White Wins", "Black Wins"], )

[//]: # (            range: ["#ffffff", "#333333"] // You can tweak these)

[//]: # (        },)

[//]: # (        marks: [)

[//]: # (            Plot.barX&#40;stackedData, {x: "wins", y: "player", fill: "type", tip: true}&#41;)

[//]: # (        ])

[//]: # (    }&#41;;)

[//]: # (})

[//]: # (```)

[//]: # (<div class="grid grid-cols-1">)

[//]: # (  <div class="card">)

[//]: # (    ${resize&#40;&#40;width&#41; => legendChart&#40;winners, {width}&#41;&#41;})

[//]: # (  </div>)

[//]: # (</div>)
