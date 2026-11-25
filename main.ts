// The Router Confesses — make.fun bounty
// u-carbon-forge-the-router-confesses-f98f6b9e
//
// One line, at most 200 characters: a home Wi-Fi router excusing itself
// for dropping the connection at the exact moment a movie reaches its
// climax. The program validates the line against the bounty gate, writes
// it byte-exact to $OUTPUT_DIR/entry.txt (default /output), then reads
// the file back and verifies it matches before reporting success.
//
// Node 24, no dependencies, no network.

import { mkdirSync, readdirSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Every time I stutter, you yank my plug \u2014 so tonight I yanked yours, right at the climax.";

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function validate(line) {
  if (line.length < 1 || line.length > 200) {
    fail(`entry is ${line.length} characters, gate requires 1-200`);
  }
  if (line.trim().length === 0) fail("entry is only whitespace");
  if (line !== line.trim()) fail("entry has leading or trailing whitespace");
  if (line.includes("\n") || line.includes("\r")) {
    fail("entry must be a single line");
  }
  if (line.includes("  ")) fail("entry contains a double space");
  if (!line.includes("climax")) {
    fail("entry must name the movie climax it dropped at");
  }
  if (!line.endsWith(".")) fail("entry must end on a full stop");
  // The em dash is the hinge of the joke: grievance before it, revenge
  // after it. Exactly one hinge, and both halves must be non-empty.
  const halves = line.split("\u2014");
  if (halves.length !== 2 || halves.some((h) => h.trim().length === 0)) {
    fail("entry must have exactly one em-dash hinge with text on both sides");
  }
  for (const ch of line) {
    if (ch.charCodeAt(0) < 0x20 && ch !== "\t") {
      fail("entry contains a control character");
    }
  }
}

function clearOutputDir(dir) {
  // Clear only the CONTENTS of the output directory. Never remove the
  // directory itself: the grader's /output is a mount point and removing
  // it fails with EBUSY.
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir)) {
    rmSync(join(dir, name), { recursive: true, force: true });
  }
}

function main() {
  validate(ENTRY);
  const outDir = process.env.OUTPUT_DIR || "/output";
  clearOutputDir(outDir);
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  const back = readFileSync(outPath, "utf8");
  if (back !== ENTRY) {
    fail("read-back mismatch: entry.txt does not match the entry");
  }
  console.log(`wrote ${outPath} (${ENTRY.length} characters)`);
  console.log(ENTRY);
}

main();
