import { readFile } from 'fs/promises'

console.log('Leyendo primer archivo!')
const text = await readFile('./archivo.txt', 'utf-8')
console.log('text', text)

console.log('Hacer cosas mientras se lee el archivo')

console.log('Leyendo el segundo archivo!')
const text2 = await readFile('./archivo2.txt', 'utf-8')
console.log('text2', text2)
