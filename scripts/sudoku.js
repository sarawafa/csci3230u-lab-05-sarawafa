// =====================================================================
// sudoku.js  -  the DOM controller for the game page
// =====================================================================
// The "view": it reads the model (model.js) and reflects it onto the page,
// and turns the player's clicks back into model calls. The game RULES stay
// in model.js - this file is only about the DOM.
//
// Fill in every function marked TODO. The state, the element references,
// and the scoring/celebration helpers are done for you.
// =====================================================================

import {
  EMPTY,
  SAMPLE_BOARD,
  getCell,
  setCell,
  findConflicts,
  isComplete,
} from './model.js'
import confetti from 'canvas-confetti' // you installed this with `npm install`

let board = SAMPLE_BOARD
let activeDigit = null
const history = [] // previous boards, for undo
const startTime = Date.now()

const boardEl = document.getElementById('board')
const paletteEl = document.getElementById('palette')

// ---- rendering ------------------------------------------------------

/**
 * Build the 9x9 board from `board` into <table id="board">.
 * TODO:
 *  - clear boardEl (boardEl.innerHTML = '')
 *  - for each row r, make a <tr>; for each col c, make a <td>:
 *      - give it id `cell-${r}-${c}`
 *      - show the digit (getCell), or '' for EMPTY
 *      - if the cell was EMPTY in SAMPLE_BOARD but isn't now, add class 'user-input'
 *      - on click, call placeAt(r, c)
 *  - append the rows, then call highlightConflicts()
 */
function renderBoard() {
  // TODO
  boardEl.innerHTML = ''

  for (let r = 0; r < 9; r++) {
    const tr = document.createElement('tr')
    for (let c = 0; c < 9; c++) {
      const td = document.createElement('td')
      td.id = `cell-${r}-${c}`

      const val = getCell(board, r, c)
      td.textContent = val === EMPTY ? '' : val

      // If cell was empty in starting puzzle but is filled now, style as user input
      if (getCell(SAMPLE_BOARD, r, c) === EMPTY && val !== EMPTY) {
        td.classList.add('user-input')
      }

      td.addEventListener('click', () => placeAt(r, c))
      tr.appendChild(td)
    }
    boardEl.appendChild(tr)
  }

  highlightConflicts()
}

/**
 * Toggle the 'error' class on every cell that currently conflicts.
 * TODO: for each (r, c), find its <td> by id and toggle 'error' based on
 * whether findConflicts(board, r, c) has any entries.
 */
function highlightConflicts() {
  // TODO
  for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const td = document.getElementById(`cell-${r}-${c}`)
        if (td) {
          const conflicts = findConflicts(board, r, c)
          td.classList.toggle('error', conflicts.length > 0)
        }
      }
    }
}

/**
 * Build the palette into <table id="palette">: a row of 1-9 (each click
 * selects that digit) followed by an undo cell.
 * TODO:
 *  - clear paletteEl; make one <tr>
 *  - for d = 1..9: a <td> showing d, click → selectDigit(d)
 *  - a final <td> holding <img src="/images/undo.png" alt="Undo">, click → undo
 */
function renderPalette() {
  // TODO
  paletteEl.innerHTML = ''
    const tr = document.createElement('tr')

    // Digits 1 through 9
    for (let d = 1; d <= 9; d++) {
      const td = document.createElement('td')
      td.textContent = d
      if (activeDigit === d) {
        td.classList.add('active')
      }
      td.addEventListener('click', () => selectDigit(d))
      tr.appendChild(td)
    }

    // Undo button
    const undoTd = document.createElement('td')
    const undoImg = document.createElement('img')
    undoImg.src = '/images/undo.png'
    undoImg.alt = 'Undo'
    undoTd.appendChild(undoImg)
    undoTd.addEventListener('click', () => undo())
    tr.appendChild(undoTd)

    paletteEl.appendChild(tr)
}

// ---- interaction ----------------------------------------------------

/**
 * Remember the chosen digit and mark its palette cell 'active'.
 * TODO: set activeDigit; toggle 'active' on the matching palette <td>.
 */
function selectDigit(digit) {
  // TODO
  activeDigit = digit

   // Highlight selected palette cell and deactivate others
   const cells = paletteEl.querySelectorAll('td')
   cells.forEach((td, index) => {
      // Digits 1-9 correspond to index 0-8
      if (index < 9) {
        td.classList.toggle('active', index + 1 === digit)
      }
    })
}

/**
 * Place the active digit at (row, col).
 * TODO:
 *  - do nothing if no digit is selected
 *  - do nothing if that cell is a given clue (getCell(SAMPLE_BOARD,…) !== EMPTY)
 *  - push the current board onto `history`, then setCell into `board`
 *  - renderBoard(); if isComplete(board), call celebrate()
 */
function placeAt(row, col) {
  // TODO
  if (activeDigit === null) return

     // Do not overwrite given clues
     if (getCell(SAMPLE_BOARD, row, col) !== EMPTY) return

     // Push previous state onto history stack
     history.push(board)

     // Update board state with new digit
     board = setCell(board, row, col, activeDigit)

     renderBoard()

     if (isComplete(board)) {
       celebrate()
     }
}

/** Step back one move. TODO: if history isn't empty, pop into `board`, re-render. */
function undo() {
  // TODO
  if (history.length > 0) {
      board = history.pop()
      renderBoard()
    }
}

// ---- finishing (done for you) ---------------------------------------

function celebrate() {
  recordScore()
  confetti()
  setTimeout(() => alert('Solved! 🎉'), 50)
}

function recordScore() {
  const durationSeconds = Math.round((Date.now() - startTime) / 1000)
  const scores = JSON.parse(localStorage.getItem('sudoku-scores') || '[]')
  scores.push({ date: new Date().toISOString(), durationSeconds })
  localStorage.setItem('sudoku-scores', JSON.stringify(scores))
}

// ---- start ----------------------------------------------------------
renderPalette()
renderBoard()