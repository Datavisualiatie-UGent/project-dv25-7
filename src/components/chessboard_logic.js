import * as Plot from "npm:@observablehq/plot";
import * as d3 from "d3";

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
        let player;
        if(r <= 2){
            player = 'white';
        } else if(r >= 7){
            player = 'black';
        }
        allSquares.push({file: f, rank: r, white: white, symbol: get_piece(f + r), player: player});
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

function ownerFigure(g) {
  const svg = g.ownerSVGElement;
  return svg?.parentElement?.nodeName === "FIGURE" ? svg.parentElement : svg;
}

export function plot_chessboard(data, board=allSquares.slice()) {
    return {
        width: 600,
        height: 600,
        marginTop: 20,
        marginRight: 20,
        marginBottom: 50,
        marginLeft: 50,
        board: board,
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
            Plot.rect(board, {
                x: "file",
                y: "rank",
                text: "symbol",
                class: d => "square",
                fill: d => (data.find(e => d.file === e.file && d.rank === e.rank)) ? "#ffffff" : (d.white ? "#dedede" : "#b4b4b4"),
                title: d => "No first move with this position.",
                dx: d => d.dx,
                dy: d => d.dy,
            }),
            Plot.text(board, {
                x: "file",
                y: "rank",
                text: d => pieces[d.symbol],
                fontSize: 40,
                fill: d => d.player,
                textAnchor: "middle",
                dy: 5,
            }),
        ],
    };
}
