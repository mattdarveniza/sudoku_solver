import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { puzzle1 } from "./puzzles.ts";
import {
  getSquareIndex,
  basicPossibilities,
  getRows,
  getColumns,
  getSquares,
  reverseRowIndex,
  reverseColumnIndex,
  reverseSquareIndex,
} from "./solver.ts";

Deno.test("getSquareIndex", () => {
  assertEquals(getSquareIndex(0), 0);
  assertEquals(getSquareIndex(3), 1);
  assertEquals(getSquareIndex(6), 2);
  assertEquals(getSquareIndex(9), 0);
  assertEquals(getSquareIndex(27), 3);
  assertEquals(getSquareIndex(80), 8);
});

Deno.test("reverseRowIndex", () => {
  assertEquals(reverseRowIndex(0, 0), 0);
  assertEquals(reverseRowIndex(1, 2), 11);
  assertEquals(reverseRowIndex(8, 8), 80);
});

Deno.test("reverseColumnIndex", () => {
  assertEquals(reverseColumnIndex(0, 0), 0);
  assertEquals(reverseColumnIndex(1, 2), 19);
  assertEquals(reverseColumnIndex(8, 8), 80);
});

Deno.test("reverseSquareIndex", () => {
  assertEquals(reverseSquareIndex(0, 0), 0);
  assertEquals(reverseSquareIndex(0, 2), 2);
  assertEquals(reverseSquareIndex(0, 3), 9);
  assertEquals(reverseSquareIndex(0, 8), 20);
  assertEquals(reverseSquareIndex(1, 1), 4);
  assertEquals(reverseSquareIndex(3, 1), 28);
  assertEquals(reverseSquareIndex(8, 8), 80);
});

Deno.test("getRows", () => {
  const rows = getRows(puzzle1);
  assertEquals(rows[0], [0, 0, 0, 0, 0, 6, 1, 0, 0]);
  assertEquals(rows[8], [0, 0, 2, 5, 0, 7, 0, 0, 0]);
});

Deno.test("getColumns", () => {
  const columns = getColumns(puzzle1);
  assertEquals(columns[0], [0, 4, 0, 0, 0, 0, 6, 0, 0]);
  assertEquals(columns[8], [0, 0, 0, 0, 0, 9, 0, 4, 0]);
});

Deno.test("getSquares", () => {
  const squares = getSquares(puzzle1);

  // prettier-ignore
  const expected0 = [
    0, 0, 0,
    4, 3, 0,
    0, 0, 0,
  ];
  assertEquals(squares[0], expected0);

  // prettier-ignore
  const expected1 = [
    0, 0, 6,
    0, 0, 9,
    0, 0, 0,
  ];
  assertEquals(squares[1], expected1);

  // prettier-ignore
  const expected8 = [
    0, 0, 0,
    0, 5, 4,
    0, 0, 0,
  ];
  assertEquals(squares[8], expected8);
});

Deno.test("basicPossibilties", () => {
  const result = basicPossibilities(puzzle1);
  assertEquals(result[0], [2, 5, 7, 8, 9]);
  assertEquals(result[80], [1, 3, 6, 8]);
  assertEquals(result[9], []);
});
