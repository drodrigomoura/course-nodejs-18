const fs = require('node:fs/promises')
const path = require('node:path')

const picocolors = require('picocolors')

// console.log(process.argv);

const folder = process.argv[2] || '.'

async function ls (directory) {
  let files
  try {
    files = await fs.readdir(folder)
  } catch (error) {
    // console.error("Error leyendo el directorio", error);
    console.error(picocolors.red(`Error leyendo el directorio ${folder}`))
    process.exit(1)
  }

  const filesPromises = files.map(async (file) => {
    const filePath = path.join(folder, file)
    let stats

    try {
      stats = await fs.stat(filePath)
    } catch (error) {
      console.error('Error leyendo las estadísticas del archivo', error)
      process.exit(1)
    }

    const isDirectory = stats.isDirectory()
    const fileType = isDirectory ? '📁' : '📄'
    const fileSize = stats.size
    const fileModified = stats.mtime.toLocaleString()

    return `${picocolors.bgMagenta(fileType)} ${picocolors.blue(file.padEnd(20))} ${picocolors.green(fileSize.toString().padStart(10))} bytes ${fileModified}`
  })

  const filesInfo = await Promise.all(filesPromises)
  filesInfo.forEach((info) => console.log(info))
}

ls(folder)
