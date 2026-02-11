// arguments

console.log(process.argv)

// run next script
// node 07-process.js hola mundo curso node

// control the process
// exit
// process.exit(1); // 0: success, 1: error

// control process events
// process.on("exit", (code) => {
//   console.log("El proceso ha terminado con el código", code);
// });

// current working directory - where we are in the terminal
// from where we run the script
console.log(process.cwd())

// platform
console.log(process.platform)

// env
console.log(process.env)
console.log('PEPITO: ' + process.env.PEPITO)
// run this script to test
// PEPITO=holamundo node 07-process.js
