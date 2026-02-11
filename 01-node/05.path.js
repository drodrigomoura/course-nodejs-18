const path = require('path')

// separator: / en Linux y macOS, \ en Windows
console.log(path.sep)

// join: une rutas de forma segura
const filePath = path.join('content', 'subfolder', 'test.txt')
console.log(filePath)

// basename: devuelve el nombre del archivo
const base = path.basename(filePath)
console.log(base)

// filename: devuelve el nombre del archivo sin la extensión
const filename2 = path.basename(filePath, '.txt')
console.log(filename2)
// o con parse
const filename = path.parse(filePath).name
console.log(filename)

// ext: devuelve la extensión del archivo
const ext = path.extname(filePath)
console.log(ext)
// extension compleja
const ext2 = path.extname('archive.super.image.jpg')
console.log(ext2)
