import * as Plot from "npm:@observablehq/plot";

export function get_piece(source) {
    const file = source.slice(0, 1).toLowerCase();
    const rank = source.slice(1, 2).toLowerCase();
    if (rank === "2" || rank === "7") {
        return "Pawn";
    }
    if (rank === "1" || rank === "8") {
        if (file === "a" || file === "h") {
            return "Rook";
        }
        if (file === "b" || file === "g") {
            return "Knight";
        }
        if (file === "c" || file === "f") {
            return "Bishop";
        }
        if (file === "d") {
            return "Queen"
        }
        return "King"
    }
    return null;
}

export const files = ["A", "B", "C", "D", "E", "F", "G", "H"];
export const ranks = [1, 2, 3, 4, 5, 6, 7, 8];

export const allSquares = [];

let white = false;
for (let r of ranks) {
    for (let f of files) {
        allSquares.push({file: f, rank: r, white: white, symbol: get_piece(f + r)});
        white = !white;
    }
    white = !white;
}

export const pieces = {
    "Pawn": "♙",
    "Knight": "♘",
    "Bishop": "♗",
    "Rook": "♖",
    "Queen": "♕",
    "King": "♔"
};


export function plot_chessboard(data) {
    console.log(data)
    return {
        width: 600,
        height: 600,
        marginTop: 20,
        marginRight: 20,
        marginBottom: 50,
        marginLeft: 50,
        x: {
            domain: files,
            label: null
        },
        y: {
            domain: ranks,
            reverse: true,
            label: null
        },
        marks: [
            Plot.rect(allSquares, {
                x: "file",
                y: "rank",
                text: "symbol",
                class: d => "square",
                fill: d => (data.find(e => d.file === e.file && d.rank === e.rank)) ? "#ffffff" : (d.white ? "#dedede" : "#b4b4b4"),
                title: d => "No first move with this position.",
                dx: d => d.dx,
                dy: d => d.dy
            }),
            // Plot.rect(originData, {
            //     x: "file",
            //     y: "rank",
            //     fillOpacity: d => d.count,
            //     title: d => `${get_piece(d.file + d.rank)} moves to ${d.to} ${d.count} times.`,
            //     fill: "type",
            // }),
            // Plot.rect(destData, {
            //     x: "file",
            //     y: "rank",
            //     fillOpacity: d => d.count,
            //     title: d => `${get_piece(d.from)} moved from ${d.from} ${d.count} times.`,
            //     fill: "type",
            // }),
            // Plot.text(destData, {
            //     x: "file",
            //     y: "rank",
            //     text: d => d.count > 0 ? d.count : "",
            //     fill: "black",
            //     fontSize: 20,
            //     dy: 4
            // }),
            Plot.text(allSquares, {
                x: "file",
                y: "rank",
                text: d => pieces[d.symbol],
                fontSize: 40,
                fill: d => d.rank < 3 ? "white" : "black",
                textAnchor: "middle",
                dy: 5
            }),

        ],
    };
}
