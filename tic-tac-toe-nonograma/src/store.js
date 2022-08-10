
const colClues = {}
export function getColClue(col) {
  return colClues[col]
}
export function setColClue(col, clue) {
  colClues[col] = clue
}

const rowClues = {}
export function getRowClue(row) {
  return rowClues[row]
}
export function setRowClue(row, clue) {
  rowClues[row] = clue
}

export function esVictoria() {
  for (let prop in colClues) {
    if (!colClues[prop].getSatisfactory()) {
      return false
    } 
  }
  for (let prop in rowClues) {
    if (!rowClues[prop].getSatisfactory()) {
      return false
    }
  }
  return true
}