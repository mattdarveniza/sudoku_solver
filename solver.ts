import type { Puzzle, Possibilities } from "./types.ts";
import * as puzzles from "./puzzles.ts";
import { printPuzzle } from "./printPuzzle.ts";

export function getRows<T>(puzzle: T[]): T[][] {
  const rows = Array(9);
  for (let i = 0; i < 9; i++) {
    const ri = i * 9;
    rows[i] = puzzle.slice(ri, ri + 9);
  }

  return rows;
}

export function getColumns<T>(puzzle: T[]): T[][] {
  const columns = Array(9);
  for (let c = 0; c < 9; c++) {
    const col = (columns[c] = Array(9));
    for (let r = 0; r < 9; r++) {
      col[r] = puzzle[c + r * 9];
    }
  }

  return columns;
}

export function getSquares<T>(puzzle: T[]): T[][] {
  const squares = Array(9);
  for (let s = 0; s < 9; s++) {
    const sc = (s * 3) % 9;
    const sr = Math.floor(s / 3) * 9 * 3;
    const square = [];
    for (let r = 0; r < 3; r++) {
      const index = sr + sc + r * 9;
      square.push(...puzzle.slice(index, index + 3));
    }
    squares[s] = square;
  }

  return squares;
}

export function getRowIndex(i: number) {
  return Math.floor(i / 9);
}

export function getColumnIndex(i: number) {
  return i % 9;
}

export function getSquareIndex(i: number) {
  const column = Math.floor(i / 3) % 3;
  const row = Math.floor(i / 27) * 3;
  return column + row;
}

export function reverseRowIndex(rowNumber: number, rowIndex: number) {
  return rowNumber * 9 + rowIndex;
}

export function reverseColumnIndex(columnNumber: number, columnIndex: number) {
  return columnIndex * 9 + columnNumber;
}

export function reverseSquareIndex(sqaureNumber: number, squareIndex: number) {
  return (
    (squareIndex % 3) +
    (Math.floor(squareIndex / 3) % 3) * 9 +
    (sqaureNumber % 3) * 3 +
    Math.floor(sqaureNumber / 3) * 27
  );
}

export function basicPossibilities(puzzle: Puzzle): Possibilities {
  const rows = getRows(puzzle);
  const columns = getColumns(puzzle);
  const squares = getSquares(puzzle);

  const possibilities = puzzle.map((v, i) => {
    if (v !== 0) {
      return [];
    }

    const row = rows[getRowIndex(i)];
    const column = columns[getColumnIndex(i)];
    const square = squares[getSquareIndex(i)];

    const p = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
      (n) => !row.includes(n) && !column.includes(n) && !square.includes(n)
    );
    return p;
  });

  return possibilities;
}

export function nakedSingles(puzzle: Puzzle) {
  let incremented = false;
  let possibilities = basicPossibilities(puzzle);

  const result = puzzle.map((v, i) => {
    if (v === 0 && possibilities[i].length === 1) {
      incremented = true;
      return possibilities[i][0];
    }
    return v;
  });

  return incremented ? result : null;
}

export function hiddenSingles(puzzle: Puzzle) {
  const result = [...puzzle];
  let incremented = false;
  let possibilities = basicPossibilities(puzzle);

  const pRows = getRows(possibilities);
  const pColumns = getColumns(possibilities);
  const pSquares = getSquares(possibilities);
  const getIndex = [
    reverseRowIndex,
    reverseColumnIndex,
    reverseSquareIndex,
  ] as const;

  [pRows, pColumns, pSquares].forEach((pGroups, pGroupsIndex) => {
    pGroups.forEach((group, groupIndex) => {
      [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((i) => {
        const iInstances = group.filter((g) => g.includes(i));

        if (iInstances.length === 1) {
          const valueIndex = group.findIndex((g) => g.includes(i));
          result[getIndex[pGroupsIndex](groupIndex, valueIndex)] = i;
          incremented = true;
        }
      });
    });
  });

  return incremented ? result : null;
}

export function nakedPairs(puzzle: Puzzle) {
  const result = [...puzzle];
  let incremented = false;
  let possibilities = basicPossibilities(puzzle);

  const pRows = getRows(possibilities);
  const pColumns = getColumns(possibilities);
  const pSquares = getSquares(possibilities);

  [pRows, pColumns, pSquares].forEach((pGroups, pGroupsIndex) => {
    pGroups.forEach((group, groupIndex) => {
      // Find pairs
      const pairs = group
        .filter((g) => g.length === 2)
        .filter((g1) =>
          group.find((g2) => g2.length === 2 && g2.every((v) => g1.includes(v)))
        );
      if (pairs.length > 0) {
        incremented = true;
      }
    });
  });
}

export function checkResult(puzzle: Puzzle) {
  return [getRows(puzzle), getColumns(puzzle), getSquares(puzzle)]
    .flat()
    .every((group) =>
      [1, 2, 3, 4, 5, 6, 7, 8, 9].every((i) => group.includes(i))
    );
}

export function checkPartialResult(puzzle: Puzzle) {
  return [getRows(puzzle), getColumns(puzzle), getSquares(puzzle)]
    .flat()
    .every((group) =>
      [1, 2, 3, 4, 5, 6, 7, 8, 9].every(
        (i) => group.filter((v) => v === i).length <= 1
      )
    );
}

export function solve(puzzle: Puzzle) {
  let solved = false;
  let iterations = 0;

  if (!checkPartialResult(puzzle)) {
    console.log("Invalid puzzle, no feasible solution");
    printPuzzle(puzzle);
    return;
  }

  while (!solved) {
    let incremented = false;

    // Find naked singles
    const nsResult = nakedSingles(puzzle);
    if (nsResult) {
      puzzle = nsResult;
      incremented = true;
    }

    // Find hidden singles
    const hsResult = hiddenSingles(puzzle);
    if (hsResult) {
      puzzle = hsResult;
      incremented = true;
    }

    // Find naked pairs

    // console.log("\niterations:", ++iterations);
    // printPuzzle(puzzle);
    if (!checkPartialResult(puzzle)) {
      console.log("\nPuzzle invalidated");
      return;
    }

    if (!incremented) {
      console.log("Puzzle not solved :(");
      break;
    }

    solved = puzzle.every((n) => n !== 0);
  }

  if (solved) {
    if (checkResult(puzzle)) {
      console.log("Puzzle solved!");
    } else {
      console.log("Result invalid :(");
    }
  }
  printPuzzle(puzzle);
}

function validatePuzzleArg(arg?: string): arg is string & keyof typeof puzzles {
  return Boolean(arg && arg in puzzles);
}

if (import.meta.main) {
  const [puzzleName] = Deno.args;
  if (!validatePuzzleArg(puzzleName)) {
    console.error(
      `Usage: deno run solver.ts <puzzlename>.\n Valid puzzlenames are:${[
        "",
        ...Object.keys(puzzles),
      ].join("\n  * ")}`
    );
  } else {
    solve(puzzles[puzzleName]);
  }
}
