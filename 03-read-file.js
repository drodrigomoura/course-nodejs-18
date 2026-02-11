const fs = require('node:fs')

// ==== SINCRONO ====
// console.log("Leyendo primer archivo!");
// const text = fs.readFileSync("./archivo.txt", "utf-8");
// console.log(text);
// console.log("Hacer cosas mientras se lee el archivo");

// console.log("Leyendo el segundo archivo!");
// const text2 = fs.readFileSync("./archivo2.txt", "utf-8");
// console.log(text2);

// ==== ASINCRONO ====
console.log('Leyendo primer archivo!')
const text = fs.readFile('./archivo.txt', 'utf-8', (err, text) => {
  if (err) {
    console.error(err)
    return
  }
  console.log('text', text)
})

console.log(text)

console.log('Hacer cosas mientras se lee el archivo')

console.log('Leyendo el segundo archivo!')
const text2 = fs.readFile('./archivo2.txt', 'utf-8', (err, text2) => {
  if (err) {
    console.error(err)
    return
  }
  console.log('text2', text2)
})
console.log(text2)
