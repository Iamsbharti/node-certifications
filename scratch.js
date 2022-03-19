let buffer = Buffer.from("test");
console.log(buffer.toString("hex"));
let b1 = Buffer.allocUnsafe(12);
let u1 = new Uint8Array(12);
console.log(b1.fill(2));
console.log(b1.slice(1, 2) instanceof Buffer);
console.log(u1.slice(1, 3) instanceof Uint8Array);

const { execSync, exec, spawn, spawnSync } = require("child_process");
const { stdout, stderr } = require("process");
const exeSyncResult = execSync(`node -p "2+2"`);
console.log("exeSyncResult::", exeSyncResult.toString());
const execResult = exec(`node -p "5+9"`, (err, stdout, stderr) => {
  console.log("Error:", err);
  console.log("subprocess stdout::", stdout.toString());
  console.log("subprocess stderr::", stderr.toString());
});
console.log("execResult:", typeof execResult);

const spawnSyncResult = spawnSync(process.execPath, ["-p", "3+4"]);
console.log("spawnSyncResult::", spawnSyncResult.stdout.toString());

process.env.TET = "TEST";
const spawnResult = spawn(process.execPath, ["-p", "process.env"], {
  env: { TET: "TEST12" },
});
spawnResult.stdout.pipe(process.stdout);

spawnResult.on("close", (status) => {
  console.log("child spawn closed cmd::", status);
});
