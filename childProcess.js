// Child process creation
/**
 * child_process module has the following methods , which spawns a process some way or other.
*   - exec & execSync
    - spawn & spawnSync
    - execFile & execFileSync
    - fork

 * The "execFile" and "execFileSync" methods are variations of the "exec" and "execSync" methods.
 * Rather than defaulting to executing a provided command in a shell, it attempts to 
 * execute the provided path to a binary executable directly. 
 * This is slightly more efficient but at the cost of some features. 
 * 
 * The "fork" method is a specialization of the spawn method. 
 * By default, it will spawn a new Node process of the currently executing JavaScript file 
 * (although a different JavaScript file to execute can be supplied). 
 * It also sets up Interprocess Communication (IPC) with the subprocess by default.
 */
//*****************  exec & execSync Methods **************************/
/**
 * The child_process.execSync method is the simplest way to execute a command:
 */
"use strict";
const { execSync } = require("child_process");
const output = execSync(`node -e "console.log('Subprocess stdout')"`);

// The "execSync" method returns a buffer containing the output of the command.

console.log("OUTPUT_EXECSYNC::", output.toString());

// any command available on host machine can be executed
const cmd = process.platform === "win32" ? "dir" : "ls";
const outputHostCmd = execSync(cmd);
console.log("Host CMD o/p::", outputHostCmd.toString());

/**
 * If we want to execute the node binary as a child process.
 * It's better to refer to the full path of the node binary of the currently executing process.
 * full path of binary -> node.execPath
 */
const outPutnodeBinary = execSync(
  `"${process.execPath}" -e "console.log('Subprocess stdo/p node binary')"`
);
console.log("Out put node binary::", outPutnodeBinary.toString());

// process.exit
/** 
     try {
         execSync(`"${process.execPath}" -e "process.exit(1)"`);
     } catch (error) {
        console.log("CAUGHT ERROR::", error);
     }
*/

/**
     * Command failed: "/usr/local/bin/node" -e "process.exit(1)"
        at checkExecSyncError (child_process.js:616:11)
        at execSync (child_process.js:652:15)
        at Object.<anonymous> (/Users/saurabhbharti/Documents/nodejs_certification/childProcess.js:48:3)
        -
        -
        -
        at internal/main/run_main_module.js:17:47 {
    status: 1, // status is 1 since we used process.exit(1)
    signal: null,
    output: [ null, <Buffer >, <Buffer > ],
    pid: 1753,
    stdout: <Buffer >,
    stderr: <Buffer >
    }

    -> stderr will have the same value as err.output[2]
    -> so these 2 stderr & err.output[2] can be used to discover any error message written to STDERR by subprocess.
 */
// exec
const { exec } = require("child_process");
const { stderr } = require("process");
exec(
  `"${process.execPath}" -e "console.log('A');console.error('B')"`,
  (err, stdout, stderr) => {
    console.log("Error:", err);
    console.log("subprocess stdout::", stdout.toString());
    console.log("subprocess stderr::", stderr.toString());
  }
);
/**
 * Even tough STDERR was to written to , the first arg of callback err is null; since process ended with exit(0).
 * It will not be null if we replace console.error('B') with throw Error('B');
 * In the async exec case , err.code contains an exit code instead of err.status, (API incosistency).
 */

// ********************** spawn & spawnSync ******************************* //
/**
 * while exec & execSync takes full shell command , these 2 take the executable path as first arg
 * and then an aray of flags as 2nd argument.
 */
const { spawnSync } = require("child_process");
const result = spawnSync(process.execPath, [
  "-e",
  "console.log('subprocess spawn o/p')",
]);
console.log("SpawnSync OP::", result);
/**
 * {
        status: 0,
        signal: null,
        output: [
            null,
            <Buffer 73 75 62 70 72 6f 63 65 73 73 20 73 70 61 77 6e 20 6f 2f 70 0a>,
            <Buffer >
        ],
        pid: 2379,
        stdout: <Buffer 73 75 62 70 72 6f 63 65 73 73 20 73 70 61 77 6e 20 6f 2f 70 0a>,
        stderr: <Buffer >
    }
 */
/**
 * execSync returns a buffer containing the child process o/p.
 * spawnSync returns an object containing info about the process that was spawned.
 *
 * the result.stdout and result.output[1] has the buffer of our process STDOUT o/p.
 * console.log(result.stdout.toString()) --> subprocess spawn o/p
 */

/**
 * unlike execSync , spawnSync does not throw if process exists with a non-zero exit code.
 * so try/catch required.
 */
const noErrorThrow = spawnSync(process.execPath, ["-e", `process.exit(1)`]);
console.log("No throw o/p::", noErrorThrow);

/**
 * Difference between exec and spawn
 *  - exec accepts callback, spawn doesn't.
 *  - both return a ChildProcess instance, which has stdin,stdout and stderr streams, and inherits from EventEmitter
 *    allowing for exit code to be obtained after a "close" event.
 *  -
 *
 */
const { spawn } = require("child_process");
const sp = spawn(process.execPath, [
  "-e",
  "console.log('subprocess with spawn o/p')",
]);

console.log("Spawn o/p::process-id::", sp.pid);

sp.stdout.pipe(process.stdout);

sp.on("close", (status) => {
  console.log("Spawn exit status::", status);
});

/**
 * The spawn method is the only method that doesn't buffer child process output.
 *
 * Even tough exec has stdout & stderr streams, they stop streaming once the subprocess o/p has reached
 * 1 mebibyte(1024 * 1024 bytes), can be configured with "maxBuffer" option.
 *
 * since spawn does not buffer at all, it will continue to stream o/p for entire life timeof the subprocess, no matter
 * how much o/p is generated. hence for long running child process it's recommended to use spawn method.
 */
// ********************** process configuration ******************************** //
/**
 * An option object can be set as 3rd argument for spawn and spawnSync or 2nd arg for exec & execSync.
 * -- cwd, env (options ...)
 * - by default child process inherits the envoirnment variables of the parent process.
 */

process.env.A_VAR_TEST = "SET SET SET";
const sp1 = spawn(process.execPath, ["-p", "process.env"]);
sp1.stdout.pipe(process.stdout);
// the stdout stream of childprocess is piped to stdout of the parent process, hence prints the env of childprocess
// along with parent's.

// overwite the parent's process variables with env property in the options objects (3rd arg)
const sp3 = spawn(process.execPath, ["-p", "process.env"], {
  env: { TEST_OVERWRITE: "WRITE OVER PROP ENV" },
});
sp3.stdout.pipe(process.stdout);

// cwd example
const { IS_CHILD } = process.env;

if (IS_CHILD) {
  console.log("Subprocess cwd:", process.cwd());
  console.log("env", process.env);
} else {
  const { parse } = require("path");
  const { root } = parse(process.cwd());
  const { spawn } = require("child_process");
  const sp4 = spawn(process.execPath, [__filename], {
    cwd: root,
    env: { IS_CHILD: "1" },
  });

  sp4.stdout.pipe(process.stdout);
}

// ***************************** Child STDIO *********************************/
/**
 * default behaviour of exec, spawn returning a ChildProcess with stdin, stdout & stderr streams can be
 * changed.
 */
// default behaviour
const sp5 = spawn(
  process.execPath,
  ["-e", `console.error('err output'); process.stdin.pipe(process.stdout)`],
  { stdio: ["pipe", "pipe", "pipe"] }
);

sp5.stdout.pipe(process.stdout);
sp5.stderr.pipe(process.stdout);
sp5.stdin.write("this input will become output\n");
sp5.stdin.end();
/**
 * prints
    err output
    this input will become output
 */
/**
 * set the second element of the stdio aray to 'inherit', this will cause the childprocess to inherit the
 * STDOUT of the parent
 *
 */
const sp6 = spawn(
  process.execPath,
  ["-e", `console.error('err output'); process.stdin.pipe(process.stdout)`],
  { stdio: ["pipe", "inherit", "pipe"] }
);

sp6.stderr.pipe(process.stdout);
sp6.stdin.write("this input will become output\n");
sp6.stdin.end();

/**
 * we can also pass process.stdout
 * { stdio: ['pipe', 'inherit', process.stdout] }
 *  sp.stdin.write('this input will become output\n')
    sp.stdin.end()
    
 */
/**
 * we can pass any writable stream insted of process.stdout
 *
 * If we want to filter out the STDERR o/p of child process, we can set stdio[2] to ignore, it will
 * ignore any stderr o/p of child process.
 */
const sp7 = spawn(
  process.execPath,
  ["-e", `console.error('err output'); process.stdin.pipe(process.stdout)`],
  { stdio: ["pipe", "inherit", "ignore"] }
);

sp7.stdin.write("this input will become output\n");
sp7.stdin.end();

// the stdio option applies in the same way fto child_process.exec function.
