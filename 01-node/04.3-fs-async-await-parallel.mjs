import { readFile } from 'fs/promises'

Promise.all([
  readFile('./archivo.txt', 'utf-8'),
  readFile('./archivo2.txt', 'utf-8')
]).then(([text, text2]) => {
  console.log('text', text)
  console.log('text2', text2)
})

// GOOD
// faster
// show in order because we define the order of the files in the array.

// BAD
// if one of the files is big, the other will wait until it finishes to start reading
