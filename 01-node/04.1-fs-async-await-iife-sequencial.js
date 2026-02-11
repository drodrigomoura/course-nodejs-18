const fs = require('node:fs/promises')

// IIFE: Immediately Invoked Function Expression
// (async () => {
//   console.log("Leyendo primer archivo!");
//   const text = await fs.readFile("./archivo.txt", "utf-8");
//   console.log("text", text);

//   console.log("Hacer cosas mientras se lee el archivo");

//   console.log("Leyendo el segundo archivo!");
//   const text2 = await fs.readFile("./archivo2.txt", "utf-8");
//   console.log("text2", text2);
// })();

async function init () {
  console.log('Leyendo primer archivo!')
  const text = await fs.readFile('./archivo.txt', 'utf-8')
  console.log('text', text)

  console.log('Hacer cosas mientras se lee el archivo')

  console.log('Leyendo el segundo archivo!')
  const text2 = await fs.readFile('./archivo2.txt', 'utf-8')
  console.log('text2', text2)
}

init()
