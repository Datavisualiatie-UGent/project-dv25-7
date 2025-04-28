import * as Plot from "npm:@observablehq/plot";
import {get_piece, plot_chessboard} from "./chessboard_logic.js"

export function opening_board(data){
    console.log("opening_board", data);
    let originData = data.map(d => {
        return {
            file: d.move.slice(0, 1).toUpperCase(),
            rank: +d.move.slice(1, 2),
            to: [d.move.slice(2, 4).toUpperCase()],
            count: d.count,
            type: "origin"
        }
    }).filter(d => d.count > 0)

    originData = Object.values(originData.reduce((acc, curr) => {
        const key = `${curr.file}_${curr.rank}`;
        if (acc[key]) {
            acc[key].count += curr.count;
            acc[key].to.push(...curr.to)
        } else {
            acc[key] = {
                file: curr.file,
                rank: curr.rank,
                to: curr.to,
                count: curr.count,
                type: "Start position"
            }
        }
        return acc
    }, {}))

    const destData = data.map(d => {
        return {
            file: d.move.slice(2, 3).toUpperCase(),
            rank: +d.move.slice(3, 4),
            from: d.move.slice(0, 2).toUpperCase(),
            move: d.move,
            count: d.count,
            type: "End position"
        }
    }).filter(d => d.count > 0)

    const plot = plot_chessboard(originData.concat(destData))
    plot.color = {
        legend: true,
        type: "ordinal",
        domain: ["Start position", "End position"],
        range: ["red", "green"],
    }
    const piecesPlot = plot.marks.pop()

    plot.marks.push(Plot.rect(originData, {
        x: "file",
        y: "rank",
        fillOpacity: d => d.count,
        title: d => `${get_piece(d.file + d.rank)} moves to ${d.to} ${d.count} times.`,
        fill: "type",
    }))
    plot.marks.push(Plot.rect(destData, {
        x: "file",
        y: "rank",
        fillOpacity: d => d.count,
        title: d => `${get_piece(d.from)} moved from ${d.from} ${d.count} times.`,
        fill: "type",
    }))
    plot.marks.push(Plot.text(destData, {
        x: "file",
        y: "rank",
        text: d => d.count > 0 ? d.count : "",
        fill: "black",
        fontSize: 20,
        dy: 4
    }))
    plot.marks.push(piecesPlot)
    return plot
}
