import * as Plot from "npm:@observablehq/plot";
import {files, get_piece, pieces, ranks} from "./chessboard_logic.js"
import * as d3 from "d3";
import {opening_board} from "./opening_heatmap_2.js";

function find_square(square, file, rank) {
    return square.file.toLowerCase() === file.toLowerCase() && square.rank === rank;
}

function possible_moves(board, file, rank) {
    const possible_squares = []
    const current_square = board.find(el => find_square(el, file, rank))
    let f = files.indexOf(file);
    let r = rank;
    let free = true;

    function check_square(s_f, s_r) {
        const square = board.find(el => find_square(el, s_f, s_r))
        if (square.symbol) {
            if (square.player !== current_square.player) {
                possible_squares.push({...square})
            }
            free = false;
        } else {
            possible_squares.push({...square})
        }
    }

    switch (current_square.symbol) {
        case "Pawn":
            const player = current_square.player
            let factor;
            if (player === "white") {
                factor = 1;
            } else {
                factor = -1;
            }
            if (f !== 0) {
                const left = board.find(el => find_square(el, files[f - 1], rank + factor))
                if (left.player !== player && left.symbol) {
                    possible_squares.push({...left})
                }
            }
            if (f !== 7) {
                const right = board.find(el => find_square(el, files[f + 1], rank + factor))
                if (right.player !== player && right.symbol) {
                    possible_squares.push({...right})
                }
            }
            const in_front = board.find(el => find_square(el, file, rank + factor))
            if (!in_front.symbol) {
                possible_squares.push({...in_front})
                if ((player === 'white' && rank === 2) || (player === 'black' && rank === 7)) {
                    const in_front_front = board.find(el => find_square(el, file, rank + 2 * factor))
                    if (!in_front_front.symbol) {
                        possible_squares.push({...in_front_front})
                    }
                }
            }
            break;
        case "Knight":
            if (f > 0) {
                const left1down2 = board.find(el => find_square(el, files[f - 1], rank - 2));
                if (left1down2 && (!left1down2.symbol || left1down2.player !== current_square.player)) {
                    possible_squares.push({...left1down2})
                }
                const left1up2 = board.find(el => find_square(el, files[f - 1], rank + 2));
                if (left1up2 && (!left1up2.symbol || left1up2.player !== current_square.player)) {
                    possible_squares.push({...left1up2})
                }
                if (f > 1) {
                    const left2down1 = board.find(el => find_square(el, files[f - 2], rank - 1));
                    if (left2down1 && (!left2down1.symbol || left2down1.player !== current_square.player)) {
                        possible_squares.push({...left2down1})
                    }
                    const left2up1 = board.find(el => find_square(el, files[f - 2], rank + 1));
                    if (left2up1 && (!left2up1.symbol || left2up1.player !== current_square.player)) {
                        possible_squares.push({...left2up1})
                    }
                }
            }
            if (f < 7) {
                const right1down2 = board.find(el => find_square(el, files[f + 1], rank - 2));
                if (right1down2 && (!right1down2.symbol || right1down2.player !== current_square.player)) {
                    possible_squares.push({...right1down2})
                }
                const right1up2 = board.find(el => find_square(el, files[f + 1], rank + 2));
                if (right1up2 && (!right1up2.symbol || right1up2.player !== current_square.player)) {
                    possible_squares.push({...right1up2})
                }
                if (f < 6) {
                    const right2down1 = board.find(el => find_square(el, files[f + 2], rank - 1));
                    if (right2down1 && (!right2down1.symbol || right2down1.player !== current_square.player)) {
                        possible_squares.push({...right2down1})
                    }
                    const right2up1 = board.find(el => find_square(el, files[f + 2], rank + 1));
                    if (right2up1 && (!right2up1.symbol || right2up1.player !== current_square.player)) {
                        possible_squares.push({...right2up1})
                    }
                }
            }
            break;
        case "Bishop":
            while (free && r > 1 && f > 0) {
                r--;
                f--;
                check_square(files[f], r);
            }
            r = rank;
            f = files.indexOf(file)
            free = true;
            while (free && r > 1 && f < 7) {
                r--;
                f++;
                check_square(files[f], r);
            }
            r = rank;
            f = files.indexOf(file)
            free = true;
            while (free && r < 8 && f > 0) {
                r++;
                f--;
                check_square(files[f], r);
            }
            r = rank;
            f = files.indexOf(file)
            free = true;
            while (free && r < 8 && f < 7) {
                r++;
                f++;
                check_square(files[f], r);
            }
            break;
        case "Rook":
            while (free && r > 1) {
                r--;
                check_square(file, r);
            }
            r = rank;
            free = true;
            while (free && r < 8) {
                r++;
                check_square(file, r)
            }
            free = true;
            f = files.indexOf(file)
            while (free && f > 0) {
                f--;
                check_square(files[f], rank);
            }
            free = true;
            f = files.indexOf(file)
            while (free && f < 7) {
                f++;
                check_square(files[f], rank);
            }
            break;
        case "Queen":
            const rook_board = structuredClone(board)
            rook_board.find(el => find_square(el, file, rank)).symbol = "Rook"
            const bishop_board = structuredClone(board)
            bishop_board.find(el => find_square(el, file, rank)).symbol = "Bishop"
            possible_squares.push(...(possible_moves(rook_board, file, rank).concat(possible_moves(bishop_board, file, rank))))
            break;
        case "King":
            const down = board.find(el => find_square(el, file, rank - 1))
            if (down && (!down.symbol || down.player !== current_square.player)) {
                possible_squares.push({...down})
            }
            const up = board.find(el => find_square(el, file, rank + 1))
            if (up && (!up.symbol || up.player !== current_square.player)) {
                possible_squares.push({...up})
            }
            if (f > 0) {
                const left1 = board.find(el => find_square(el, files[f - 1], rank - 1))
                if (left1 && (!left1.symbol || left1.player !== current_square.player)) {
                    possible_squares.push({...left1});
                }
                const left2 = board.find(el => find_square(el, files[f - 1], rank))
                if (left2 && (!left2.symbol || left2.player !== current_square.player)) {
                    possible_squares.push({...left2});
                }
                const left3 = board.find(el => find_square(el, files[f - 1], rank + 1))
                if (left3 && (!left3.symbol || left3.player !== current_square.player)) {
                    possible_squares.push({...left3});
                }
            }
            if (f < 7) {
                const right1 = board.find(el => find_square(el, files[f + 1], rank - 1))
                if (right1 && (!right1.symbol || right1.player !== current_square.player)) {
                    possible_squares.push({...right1});
                }
                const right2 = board.find(el => find_square(el, files[f + 1], rank))
                if (right2 && (!right2.symbol || right2.player !== current_square.player)) {
                    possible_squares.push({...right2});
                }
                const right3 = board.find(el => find_square(el, files[f + 1], rank + 1))
                if (right3 && (!right3.symbol || right3.player !== current_square.player)) {
                    possible_squares.push({...right3});
                }
            }
            break;
        default:
            break;
    }
    possible_squares.map(el => {
        el.symbol = current_square.symbol;
        el.player = current_square.player
    })
    return possible_squares;
}


export function moves_explorer(move_tree, reset_id = "reset", undo_id = "undo") {
    let possible_squares = [];
    let container;

    let history = [];
    let origin_square;
    let player = 'white';
    let current_move = move_tree;
    let plot = opening_board(current_move);
    let board = plot.board;
    let candidate_move = null;

    document.getElementById(reset_id).onclick = () => {
        if (history.length === 0) {
            return;
        }
        possible_squares = [];
        origin_square = null;
        player = 'white';
        current_move = move_tree;
        history = [];
        for (let r of ranks) {
            for (let f of files) {
                let player;
                if (r <= 2) {
                    player = 'white';
                } else if (r >= 7) {
                    player = 'black';
                }
                const el = board.find(sq => find_square(sq, f, r));
                el.player = player;
                el.symbol = get_piece(f + r);
            }
        }
        renderPlot()
    }

    document.getElementById(undo_id).onclick = () => {
        if (history.length === 0) {
            return;
        }
        origin_square = null;
        possible_squares = [];
        player = player === 'black' ? "white" : "black";
        const last_move = history.pop();
        current_move = last_move.current_move;
        const from = last_move.move.slice(2, 4);
        const to = last_move.move.slice(0, 2);
        const from_sq = board.find(sq => find_square(sq, from[0], +from[1]));
        const to_sq = board.find(sq => find_square(sq, to[0], +to[1]));
        to_sq.symbol = from_sq.symbol;
        to_sq.player = from_sq.player;
        from_sq.symbol = last_move.taken.symbol;
        from_sq.player = last_move.taken.player;
        renderPlot();
    }

    function renderPlot() {
        plot = opening_board(current_move)
        board = plot.board
        const lastPlot = plot.marks.pop()
        const newPlot = Plot.text(plot.board, {
            x: "file",
            y: "rank",
            text: d => pieces[d.symbol],
            fontSize: 40,
            fill: d => d.player,
            textAnchor: "middle",
            dy: 5,
            render: (index, scales, values, dimensions, context, next) => {
                const g = next(index, scales, values, dimensions, context, next);
                const children = d3.select(g).selectChildren();

                children
                    .on("click", function (event, i) {
                        if (board[i].player === player) {
                            const new_possible_squares = possible_moves(board, board[i].file, board[i].rank);
                            let source;
                            if (board[i] === origin_square) {
                                possible_squares = [];
                                origin_square = null;
                                source = null
                            } else {
                                origin_square = board[i];
                                possible_squares = new_possible_squares;
                                source = board[i].file + board[i].rank
                            }

                            candidate_move = origin_square;
                            plot = opening_board(current_move, source)

                            renderPlot();
                        }
                    })
                return g;
            }
        })

        const possplot = Plot.text(possible_squares, {
            x: "file",
            y: "rank",
            text: d => pieces[d.symbol],
            fontSize: 40,
            fill: d => "green",
            textAnchor: "middle",
            dy: 5,
            render: (index, scales, values, dimensions, context, next) => {
                const g = next(index, scales, values, dimensions, context, next);
                const children = d3.select(g).selectChildren();

                children
                    .on("click", function (event, i) {
                        const board_square = board.find(el => find_square(el, possible_squares[i].file, possible_squares[i].rank))
                        const move_notation = origin_square.file.toLowerCase() + origin_square.rank + board_square.file.toLowerCase() + board_square.rank;
                        if (current_move.map(el => el.move).includes(move_notation)){
                            history.push({move: move_notation, current_move: current_move, taken: {symbol: board_square.symbol, player: board_square.player}})
                            current_move = current_move.find(m => m.move === move_notation).next_moves;

                            board_square.symbol = origin_square.symbol;
                            board_square.player = origin_square.player;

                            origin_square.symbol = null;
                            origin_square.player = null;
                            possible_squares = [];
                            player = player === "white" ? "black" : "white"
                            plot = opening_board(current_move)
                            renderPlot();
                        }
                    })
                return g;
            }
        });
        plot.marks.push(newPlot);
        plot.marks.push(possplot);
        const plotEl = Plot.plot(plot);

        if (container) {
            container.replaceWith(plotEl)
        }
        container = plotEl;
        return container;
    }

    return renderPlot();
}
