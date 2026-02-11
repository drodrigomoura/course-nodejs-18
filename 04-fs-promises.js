const fs = require('node:fs/promises')

console.log('Leyendo primer archivo!')
const text = fs
  .readFile('./archivo.txt', 'utf-8')
  .then((text) => {
    console.log('text', text)
  })
  .catch((err) => {
    console.error(err)
  })
console.log(text)

console.log('Hacer cosas mientras se lee el archivo')

console.log('Leyendo el segundo archivo!')
const text2 = fs.readFile('./archivo2.txt', 'utf-8').then((text2) => {
  console.log('text2', text2)
})
console.log(text2)
