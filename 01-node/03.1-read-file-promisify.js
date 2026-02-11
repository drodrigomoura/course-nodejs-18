const fs = require('node:fs')

// solo usar si mi version de node no tiene una version de fs con promesas
const { promisify } = require('node:util')

const readFile = promisify(fs.readFile)

// ==== ASINCRONO ====
console.log('Leyendo primer archivo!')
const text = readFile('./archivo.txt', 'utf-8').then((text) => {
  console.log('text', text)
})

console.log(text)
console.log('Hacer cosas mientras se lee el archivo')

console.log('Leyendo el segundo archivo!')
const text2 = readFile('./archivo2.txt', 'utf-8').then((text2) => {
  console.log('text2', text2)
})
console.log(text2)
