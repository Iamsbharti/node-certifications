/**
 * A node.js process is the program that is currently running our code.
 * we can control and gather info about the process using the global "process" object.
 * OS os the host system on which a process runs, we can find out information about OS of a running
 * process using the code os module.
 */

/************************ STDIO   ***********************/
/**
 * The ability to interact with terminal i/o is known as standard i/o or stdio.
 * The process exposes three streams.
 * - process.stdin // readable stream for process input
 * - process.stdout // writable stream for process output
 * - process.stderr // writable stream for process error output
 */

"use strict";
console.log("Initialized");

/**
 * when piped with following command in terminal only initialized will be printed
 * node -p "crypto.randomBytes(100).toString('hex')" | node processAndOs.js // -> Initialized.
 */
// let's use stdin
// process.stdin.pipe(process.stdout);
// here we connected input to the output.
/**
 * node -p "crypto.randomBytes(100).toString('hex')" | node processAndOs.js ->  prints the following
 * Initialized
    2dea94a68430aa2de24adfaab62d903f16ab5f2502a596420e5bc0eb66e06cf1dd70a3d4
    c750154646378c622295d13c83bfc706cf7587b9944c47d0a87125355fcfb869c400ca90
    7a53e93d5fd53fc21902f8ba7590d8a9597c9f91cde7cb3f61b438f4
 */
// let's pipe transform stream

const { Transform } = require("stream");
const createUpperCaseTransformStream = () => {
  return new Transform({
    transform(chunk, enc, next) {
      const uppercase = chunk.toString().toUpperCase();
      next(null, uppercase);
    },
  });
};
const upperCase = createUpperCaseTransformStream();
process.stdin.pipe(upperCase).pipe(process.stdout);
// this transforms random bytes to upper case for command
// nodejs_certification % node -p "crypto.randomBytes(100).toString('hex')" | node processAndOs.js

/**
 * these process streams are unique , they never finish,error or close
 * if one of these streams were to end it would either cause the process to crash or process will have to exit.
 */

/**
 * The process.stdin.isTTY property can be check to determine whether our process is being piped to cmd // undefined  or false
 * or input is directly connected to terminal // true
 */
console.log("isTTY::", process.stdin.isTTY ? "terminal" : "piped to");
/**
 * node -p "crypto.randomBytes(100).toString('hex')" | node processAndOs.js -> 
 * Initialized
    isTTY:: piped to
    E45E31CD8467ADB6E645F3E545BD4F4060A6E2D50EF1015CB8D852542AD0A06CE291578A4BE7DF507CA575C270DF53416D7FA97C61165EC6FEDA0BC68CAC253DFA20E9D8A587D5632A6B3AA40336FCE45FAEB5B7DDD2BBD555D64321C31CA95863787B89
 */

/**
 * node processAndOs.js ->
 * Initialized
    isTTY:: terminal
    hi
    HI
    hello
    HELLO
 // transform pipe works here and terminal will continute taking i/p until it's closed by ctrl+c
 */
// redirect o/p to a file
// node -p "crypto.randomBytes(100).toString('hex')" | node processAndOs.js > cryOut.text
/**
 * '>' on cmd sends o/p to a file
 */
process.stderr.write(process.stdin.isTTY ? "terminal" : "piped to");

/**
 * piped to%  is printed on terminal because stderr is a different stream and it alose
 * writes on the terminal.
 * '2>' can be used to send error to a different file
 * // valid for both POSIX & win.
 *
 * e.g.
 * node -p "crypto.randomBytes(100).toString('hex')" | node processAndOs.js > cryOut.text 2> err.txt
 * // this time err if written to a file err.txt
 */

// ****************** Exiting *********************//
/**
 * when a process has nothing to do it exits by itself
 * Some Api's have active handles, which keeps the process open
 *  - net.createServer // keeps the process open to new incoming request
 *  - setInterval, setTimeout
 * ctrl+c & process.exit() can be used to exit a process.
 * Exit code is already set and is uniform across platforms.
 * 0 is universal exit code. means task was success
 * echo $? -> print last exit code // 0
 */

/**
 * Any non zero value can be passed to process.exit(1).
 * 1 mostly means general failure.
 * exit code can be set independently by process.exitCode = 1
 *
 * The 'exit' event can be used to detect when a process is closing and perform
 * any actions.
 * but no ansync work can be done in the event handler function because process
 * is closing.
 */

setInterval(() => {
  console.log("the interval is keeping the process open");
  process.exitCode = 1;
}, 500);
setTimeout(() => {
  console.log("Exit after this timeout::");
  process.exit();
}, 1750);
process.on("exit", (code) => {
  console.log("Process EXIT with code::", code);
  setTimeout(() => {
    console.log("this code will not be executed");
  }, 1);
});

// ********************* Process Info ************************ //
/**
 * The process object also contains info about the process
 *  - The cwd of the process
 *  - the platform on which process is running
 *  - the process Id
 *  - the envoirnment variables
 *
 */
console.log("CWD::", process.cwd()); ///Users/saurabhbharti/Documents/nodejs_certification
console.log("Process Platform::", process.platform); // darwin
console.log("Process Id::", process.pid); // 5945

/**
 * process.chdir can be used to change CWD. and process.cwd(0) would o/p new directory.
 * process.PWD also contains CWD but , after directory change it will still have the value on which it was excecuted.
 */
console.log("Env variables::", process.env);
/**
 * env variables are dynamically queried and an object is built out the keys value pairs.
 * process.env works more like a function, it's a getter.
 *
 * we can set env variables using // process.env.TEST ="672347"
 * but this is set for the process only and value is not leaked to host os.
 */

/********************************** Process stats **********************************************************/
/**
 * process object has methods which allows to query resource usage.
 *  - process.uptime() // amount in sec that the process has been executing for. not host's uptime
 *  - process.cpuUsage // return 2 properties(microseconds) [
 *                                          user(time that process spent using the cpu),
 *                                          system(time that kernel spent using the CPU due to
 *                                                 activity triggered by the process)
 *                                      ]
 *  - process.memoryUsage
 */
console.log("process uptime::", process.uptime());
setTimeout(() => {
  console.log("process uptime +1 sec::", process.uptime());
}, 1000);
const uptime = process.uptime();
const { user, system } = process.cpuUsage();
console.log(
  "uptime::",
  uptime,
  "user::",
  user,
  "system:msec:",
  system,
  "Usage Overall in sec::",
  (user + system) / 1000000
);
/**
 * process.memoryUsage()
 *  - has 4 prop rss,heapTotal,heapUsed,external (all values in bytes)
 *
 * external -> refers to memory usage by C layer, so onece js engine has fully init there in more memory requirement.
 *
 * heapTotal -> refers to the total memory allocated for a process.
 * i.e. process reserves that amount of memory and may grow & shrink that reserved space over time based on
 * how the process behaves.
 *
 * process memory can be split across RAM and swap spaces.
 * rss -> Resident Set Size is the amount of used RAM for the process,
 * heapUsed -> is the total amount of memory used across both RAM and Swap space.
 *
 * As we put pressure on process memory by allocating lot of objects, heapUsed number grows faster
 * that the rss number.
 * this means seap space is being relied on more over time.
 *
 */
const stats = [process.memoryUsage()];

let iterations = 5;

while (iterations--) {
  const arr = [];
  let i = 10000;
  // make the CPU do some work:
  while (i--) {
    arr.push({ [Math.random()]: Math.random() });
  }
  stats.push(process.memoryUsage());
}

console.table(stats);

// ************************************ System Info ********************************* //
/**
 * os module can be used to get info about operating System.
 */
const os = require("os");
console.log("hostName::", os.hostname());
console.log("home dir::", os.homedir());
console.log("temp dir::", os.tmpdir());

/**
 * os.type uses
 *  - uname command on non-win
 *  - ver on win to get os identifier
 */
console.log("platform::", os.platform());
console.log("type::", os.type());

// ********************************** System stas ***************************** //
/** os stats can be gathered
 *  - uptime
 *  - free memory
 *  - total memory
 */

setInterval(() => {
  console.log("system uptime::", os.uptime());
  console.log("free memory::", os.freemem());
  console.log("total memory::", os.totalmem());
  console.log();
}, 1000);
