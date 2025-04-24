# Top moves


## Most popular moves
Most popular first moves.
```js
import {opening_board} from "./components/opening_heatmap.js";
import {counter_board} from "./components/counter_moves_heatmap.js"
```

```js
counter_board([])
```

```js
function svg() {
  const svg = html`<svg id = "svg"></svg>`
  const container = d3.select(svg)
  
  container.append("circle")
    .attr("r", 50)
    .attr("fill", "cornflowerblue")
    .attr("stroke", "black")
    .attr("cx", 300)
    .attr("cy",150)
    .on("click",function(){
      const target = d3.select(this)
      const currentColor = target.attr("fill")
      if(currentColor == "cornflowerblue"){
         target.attr("fill", "tomato")
      }else{
          target.attr("fill","cornflowerblue")
      }
    })
  return svg
}

svg()

```
```js
const para = document.getElementsByClassName("square");

para.onpointerdown = (event) => {
  console.log("Pointer down event");
};
```

```js
const top_moves = await FileAttachment("./data/top_first_moves.json").json();
```

```js
opening_board(top_moves)
```

## Most winning first moves
Moves that lead to most wins.

```js
const top_winner_moves = await FileAttachment("./data/top_first_winning_moves.json").json()
```

```js
opening_board(top_winner_moves)
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
    ${resize((width) => launchTimeline(winners, {width}))}
  </div>
</div>
