import * as Plot from "npm:@observablehq/plot";
import {plot_chessboard, files, pieces} from "./chessboard_logic.js"
import * as d3 from "d3";

function find_square(square, file, rank){
    return square.file === file && square.rank === rank;
}

function possible_moves(board, file, rank){
    const possible_squares = []
    const current_square = board.find(el => find_square(el, file, rank))
    let f = files.indexOf(file);
    let r = rank;
    let free = true;
    function check_square(s_f, s_r){
        const square = board.find(el => find_square(el, s_f, s_r))
        if(square.symbol){
            if(square.player !== current_square.player){
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
    possible_squares.map(el => {el.symbol = current_square.symbol; el.player = current_square.player})
    return possible_squares;
}

let container;

export function counter_board(data){
    let possible_squares = []
    let origin_square;
    let player = 'white';

    function renderPlot(){
        const plot = plot_chessboard(data)
        const board = plot.board
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
                      if(board[i].player === player){
                          const new_possible_squares = possible_moves(board, board[i].file, board[i].rank);
                          if(board[i] ===  origin_square){
                              possible_squares = [];
                              origin_square = null;
                          } else {
                              origin_square = board[i];
                              possible_squares = new_possible_squares;
                          }
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
                      board_square.symbol = origin_square.symbol;
                      board_square.player = origin_square.player;
                      origin_square.symbol = null;
                      origin_square.player = null;
                      possible_squares = [];
                      player = player === "white" ? "black" : "white"
                      renderPlot();
                  })
                return g;
            }
        })

        plot.marks.push(newPlot)
        plot.marks.push(possplot)
        const plotEl =  Plot.plot(plot)

        if(container){
            container.replaceWith(plotEl)
        }
        container = plotEl;
        return container
    }
    return renderPlot()
}
