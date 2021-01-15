import { Puzzle } from "./types.ts";

// prettier-ignore
const line =      "+———————————+———————————+———————————+";
const emptyLine = "|           |           |           |";

export function printPuzzle(puzzle: Puzzle) {
  console.log();
  for (let i = 0; i < 9; i++) {
    if (i % 3 === 0) {
      console.log(line);
    } else {
      console.log(emptyLine);
    }

    const row = Array(3)
      .fill(null)
      .map((v, j) => {
        const index = i * 9 + j * 3;
        return puzzle.slice(index, index + 3).join("   ");
      })
      .join(" | ");

    console.log(`| ${row} |`);
  }
  console.log(line);
}
