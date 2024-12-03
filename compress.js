const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function compressAndResizeImages(sourceDir, destDir, maxWidth, maxHeight, quality) {
    // Erstellen Sie das Zielverzeichnis, wenn es noch nicht existiert
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir);
    }
  
    // Schleife durch alle Dateien im Quellverzeichnis
    fs.readdirSync(sourceDir).forEach(file => {
      const sourceFile = path.join(sourceDir, file);
      const destFile = path.join(destDir, file);
  
      // Überspringen Sie, wenn das Zielverzeichnis bereits eine Datei mit demselben Namen enthält
      if (fs.existsSync(destFile)) {
        console.log(`Datei ${file} wurde bereits komprimiert und existiert im Zielordner.`);
        return;
      }
  
      // Komprimieren und Größenreduzierung des Bildes mit Sharp
      sharp(sourceFile)
        .resize(maxWidth, maxHeight, { fit: 'cover', withoutEnlargement: false })
        .jpeg({ quality })
        .toFile(destFile, (err, info) => {
          if (err) throw err;
          console.log(`Datei ${file} wurde erfolgreich komprimiert und im Zielordner gespeichert.`);
        });
    });
  }
    
// Exportieren Sie die Funktion, damit sie in anderen Dateien verwendet werden kann
module.exports = {
  compressAndResizeImages
};
