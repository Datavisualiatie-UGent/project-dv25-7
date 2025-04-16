import * as Plot from "npm:@observablehq/plot";

function get_piece(source) {
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

export function plot_chessboard(data) {
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

    const files = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8];

    const allSquares = [];

    let white = false;
    for (let r of ranks) {
        for (let f of files) {
            allSquares.push({file: f, rank: r, white: white, symbol: get_piece(f + r)});
            white = !white;
        }
        white = !white;
    }

    const pieces = {
        "Pawn": "♙",
        "Knight": "♘",
        "Bishop": "♗",
        "Rook": "♖",
        "Queen": "♕",
        "King": "♔"
    };


    return Plot.plot({
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
        color: {
            legend: true,
            type: "ordinal",
            domain: ["Start position", "End position"],
            range: ["red", "green"],
        },
        marks: [
            Plot.rect(allSquares, {
                x: "file",
                y: "rank",
                text: "symbol",
                class: d => "square",
                fill: d => (originData.concat(destData).find(e => d.file === e.file && d.rank === e.rank)) ? "#ffffff" : (d.white ? "#dedede" : "#b4b4b4"),
                title: d => "No first move with this position.",
                dx: d => d.dx,
                dy: d => d.dy
            }),
            Plot.rect(originData, {
                x: "file",
                y: "rank",
                fillOpacity: d => d.count,
                title: d => `${get_piece(d.file + d.rank)} moves to ${d.to} ${d.count} times.`,
                fill: "type",
            }),
            Plot.rect(destData, {
                x: "file",
                y: "rank",
                fillOpacity: d => d.count,
                title: d => `${get_piece(d.from)} moved from ${d.from} ${d.count} times.`,
                fill: "type",
            }),
            Plot.text(destData, {
                x: "file",
                y: "rank",
                text: d => d.count > 0 ? d.count : "",
                fill: "black",
                fontSize: 20,
                dy: 4
            }),
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
    });
}
