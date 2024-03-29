"use strict";

const { spawn } = require("child_process");

function exercise(command, args) {
  const sp = spawn(command, args, {
    stdio: ["pipe", "inherit", "pipe"],
  });
  sp.stderr.pipe(process.stdout);
  sp.stdin.end();
  return sp;
}

module.exports = exercise;
