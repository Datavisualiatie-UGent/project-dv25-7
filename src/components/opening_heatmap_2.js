import * as Plot from "npm:@observablehq/plot";
import {get_piece, plot_chessboard} from "./chessboard_logic.js"
import * as d3 from "npm:d3-scale-chromatic";

const startColor = t => d3.interpolateBlues(0.2 + t * 0.8);      // for Start position
const endColor = d3.interpolateOranges;      // for End position

export function opening_board(data, origin=null, highlights = {}){
    let originData = data.map(d => {
        return {
            file: d.move.slice(0, 1).toUpperCase(),
            rank: +d.move.slice(1, 2),
            to: [d.move.slice(2, 4).toUpperCase()],
            count: d.count,
            type: "origin"
        }
    }).filter(d => d.count > 0)

    if (origin){
        originData = originData.filter(d => d.file === origin.slice(0, 1).toUpperCase() && d.rank === +origin.slice(1, 2))
    }


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

    let destData = data.map(d => {
        return {
            file: d.move.slice(2, 3).toUpperCase(),
            rank: +d.move.slice(3, 4),
            from: [d.move.slice(0, 2).toUpperCase()],
            move: d.move,
            count: d.count,
            type: "End position"
        }
    }).filter(d => d.count > 0)

    if (origin){
        destData = destData.filter(d => d.from.includes(origin.toUpperCase()))
    }

    destData = Object.values(destData.reduce((acc, curr) => {
        const key = `${curr.file}_${curr.rank}`;
        if (acc[key]) {
            acc[key].count += curr.count;
            acc[key].from.push(...curr.from)
        } else {
            acc[key] = {
                file: curr.file,
                rank: curr.rank,
                from: curr.from,
                count: curr.count,
                type: "End position"
            }
        }
        return acc
    }, {}))

    const maxStart = Math.max(...originData.map(d => d.count));
    const maxEnd = Math.max(...destData.map(d => d.count));
    originData.forEach(d => d.color = startColor(d.count / maxStart));
    destData.forEach(d => d.color = endColor(d.count / maxEnd));

    const plot = plot_chessboard(originData.concat(destData))
    const piecesPlot = plot.marks.pop()

    plot.marks.push(Plot.rect(originData, {
        x: "file",
        y: "rank",
        fill: d => d.color,
        title: d => `${get_piece(d.file + d.rank)} moves to ${d.to} ${d.count} times.`,
    }))
    plot.marks.push(Plot.rect(destData, {
        x: "file",
        y: "rank",
        fill: d => {
            if ((d.file + d.rank).toLowerCase() === highlights.square) {
                return "gold"
            }
            return d.color;
        },
        title: d => `Moved from ${d.from} ${d.count} times.`,
    }))
    plot.marks.push(Plot.text(destData, {
        x: "file",
        y: "rank",
        text: d => d.count > 1000000 ? Math.round(d.count / 1000000) + "M" :
            d.count > 1000 ? Math.round(d.count / 1000) + "K" : d.count > 0 ? d.count : "",
        fill: "black",
        fontSize: 20,
        dy: 4
    }))
    plot.marks.push(piecesPlot)
    return plot
}
