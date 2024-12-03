const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

function compressAndResizeImages(sourceDir, destDir, maxWidth, maxHeight, quality) {
    // Funktion für rekursive Verarbeitung
    function processDirectory(currentSourceDir, currentDestDir) {
        // Zielordner erstellen, falls nicht vorhanden
        if (!fs.existsSync(currentDestDir)) {
            fs.mkdirSync(currentDestDir, { recursive: true });
        }

        // Alle Dateien und Verzeichnisse im aktuellen Verzeichnis durchgehen
        const entries = fs.readdirSync(currentSourceDir);
        entries.forEach(entry => {
            const sourcePath = path.join(currentSourceDir, entry);
            const destPath = path.join(currentDestDir, entry);

            if (fs.statSync(sourcePath).isDirectory()) {
                // Rekursion für Unterverzeichnisse
                processDirectory(sourcePath, destPath);
            } else {
                // Verarbeiten von Dateien
                const fileExtension = path.extname(entry).toLowerCase();
                if (!supportedExtensions.includes(fileExtension)) {
                    console.log(`Überspringe nicht unterstützte Datei: ${entry}`);
                    return;
                }

                // Überspringen, wenn die Datei bereits existiert
                if (fs.existsSync(destPath)) {
                    console.log(`Datei ${entry} existiert bereits in ${currentDestDir}.`);
                    return;
                }

                // Bild verarbeiten
                sharp(sourcePath)
                    .resize(maxWidth, maxHeight, { fit: 'cover', withoutEnlargement: false })
                    .jpeg({ quality })
                    .toFile(destPath, (err) => {
                        if (err) console.error(`Fehler bei ${entry}:`, err);
                        else console.log(`Datei ${entry} erfolgreich verarbeitet und gespeichert in ${currentDestDir}.`);
                    });
            }
        });
    }

    // Verarbeitung starten
    processDirectory(sourceDir, destDir);
}

// Exportieren der Funktion
module.exports = {
    compressAndResizeImages
};