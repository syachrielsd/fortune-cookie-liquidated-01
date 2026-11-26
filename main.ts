// Fortune Cookie for the Liquidated Trader
// Writes one fortune-cookie line for a crypto trader who was just liquidated
// to (MAKEFUN_OUTPUT_DIR || '/output')/entry.txt.
// Node 22 TypeScript, stdlib only. No network, no secrets, no files read.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Screening winner (#2, 24/25), revised in-session: "since Monday" tightened
// to "since Monday night" — one more specific, human detail (the night he
// stayed up watching the chart), 113 chars / 20 words, final clause still
// the funniest part and the reframe. Three beats (lucky numbers,
// balance/leverage, sleep), specifics quota met (0 x3, Monday night).
const FORTUNE =
  "Your lucky numbers are 0, 0, and 0, which matches your balance, your leverage, and your sleep since Monday night.";

function fail(message: string): never {
  console.error(`FATAL: ${message}`);
  process.exit(1);
}

function main(): void {
  const line = FORTUNE;

  // Gate, enforced loudly before writing anything:
  // UTF-8 text, 1-160 characters, not only whitespace, one line, <= 20 words.
  if (line.length < 1 || line.length > 160) {
    fail(`line is ${line.length} chars, must be 1-160`);
  }
  if (line.trim().length === 0) {
    fail("line is only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    fail("line must be a single line");
  }
  const words = line.trim().split(/\s+/);
  if (words.length > 20) {
    fail(`line is ${words.length} words, must be at most 20`);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");

  // Exactly the line, no trailing newline.
  writeFileSync(outPath, line, "utf8");

  // Read back and verify byte-equality.
  const back = readFileSync(outPath, "utf8");
  if (back !== line) {
    fail("read-back mismatch: entry.txt does not equal the fortune");
  }

  console.log(`wrote ${outPath}`);
  console.log(`chars=${line.length} words=${words.length}`);
}

main();
