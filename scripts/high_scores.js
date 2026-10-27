// =====================================================================
// high_scores.js  -  render the high-scores table (REFERENCE SOLUTION)
// =====================================================================
// Reads saved scores from localStorage (falling back to a sample set),
// then formats and sorts them with the PURE functions from model.js.
// =====================================================================

import { formatDate, formatDuration, sortScores } from './model.js'

// Shown the first time, before anyone has finished a game.
const SAMPLE_SCORES = [
  { date: new Date(2021, 0, 17), durationSeconds: 221 }, // 3:41
  { date: new Date(2021, 0, 21), durationSeconds: 241 }, // 4:01
  { date: new Date(2021, 1, 1), durationSeconds: 172 },  // 2:52
  { date: new Date(2021, 1, 17), durationSeconds: 188 }, // 3:08
  { date: new Date(2021, 2, 2), durationSeconds: 171 },  // 2:51
]

// localStorage stores dates as ISO strings - revive them into Date objects.
const stored = JSON.parse(localStorage.getItem('sudoku-scores') || '[]').map((s) => ({
  date: new Date(s.date),
  durationSeconds: s.durationSeconds,
}))

const scores = stored.length > 0 ? stored : SAMPLE_SCORES

const tbody = document.getElementById('scores-body')
for (const score of sortScores(scores)) {
  const tr = document.createElement('tr')
  const dateTd = document.createElement('td')
  const durationTd = document.createElement('td')
  dateTd.textContent = formatDate(score.date)
  durationTd.textContent = formatDuration(score.durationSeconds)
  tr.append(dateTd, durationTd)
  tbody.appendChild(tr)
}
