const PDFDocument = require('pdfkit')
const fs = require('fs')

module.exports = {
  buildBugsPDF
}

function buildBugsPDF(bugs, filename = 'Bugs.pdf') {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filename)
    doc.pipe(stream);
  
    let lastPos = { x: 40, y: 50 }
    bugs.forEach(({ _id, title, description, severity, createdAt }) => {
      doc.fontSize(16)
         .text(`id: ${_id}`, lastPos.x, lastPos.y)

      doc.moveDown(0.3)
         .fontSize(24)
         .text(title, lastPos.x + 60)
  
      doc.moveDown(0.3)
         .fontSize(18)
         .text(`Description: ${description}`)

      doc.moveDown(0.3)
         .fontSize(18)
         .text(`Severity: ${severity}`)

      const createdAtStr = `Created At: ` + new Date(createdAt).toString().split(' ')[4]
      doc.moveDown(0.3)
         .fontSize(18)
         .text(createdAtStr)

      doc.moveDown(0.5)
         .lineCap('butt')
         .moveTo(0, doc.y)
         .lineTo(doc.page.width, doc.y)
         .stroke()
         .moveDown(0.5)

      lastPos = {
        x: doc.x - 60,
        y: doc.y
      }

      doc.moveDown(2)
    })
  
    doc.end()
    stream.on('finish', resolve)
    stream.on('error', reject)
  })
}
