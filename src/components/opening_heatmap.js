import * as Plot from "npm:@observablehq/plot";

export function plot_chessboard(events, {width, height} = {}) {
    return Plot.plot({
       width,
       height,
       marginTop: 30,

    });
}