const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const cliProgress = require('cli-progress'); // Fortschrittsanzeige

const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const supportedOutputFormats = ['jpeg', 'png', 'webp'];

function compressAndResizeImages(sourceDir, destDir, maxWidth, maxHeight, quality, outputFormat, allowCrop = false) {
    if (outputFormat === 'jpg') outputFormat = 'jpeg';

    if (!supportedOutputFormats.includes(outputFormat)) {
        console.error(`Das Zielformat "${outputFormat}" wird nicht unterstützt.`);
        return;
    }

    // Liste aller Dateien sammeln (rekursiv)
    function getAllFiles(dir, fileList = []) {
        const entries = fs.readdirSync(dir);
        entries.forEach(entry => {
            const fullPath = path.join(dir, entry);
            if (fs.statSync(fullPath).isDirectory()) {
                getAllFiles(fullPath, fileList);
            } else {
                const fileExtension = path.extname(entry).toLowerCase();
                if (supportedExtensions.includes(fileExtension)) {
                    fileList.push(fullPath);
                }
            }
        });
        return fileList;
    }

    const files = getAllFiles(sourceDir);
    const totalFiles = files.length;

    if (totalFiles === 0) {
        console.log('Keine unterstützten Dateien gefunden.');
        return;
    }

    // Fortschrittsbalken initialisieren
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(totalFiles, 0);

    let processedFiles = 0;

    files.forEach(file => {
        const relativePath = path.relative(sourceDir, file);
        const destFileName = path.basename(file, path.extname(file)) + `.jpg`;
        const destPath = path.join(destDir, path.dirname(relativePath), destFileName);

        // Zielverzeichnis erstellen, falls nicht vorhanden
        if (!fs.existsSync(path.dirname(destPath))) {
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
        }

        // Datei überspringen, wenn sie bereits existiert
        if (fs.existsSync(destPath)) {
            console.log(`Datei ${destFileName} existiert bereits.`);
            processedFiles++;
            progressBar.update(processedFiles);
            return;
        }

        // Bild verarbeiten
        const sharpInstance = sharp(file).resize(maxWidth, maxHeight, {
            fit: allowCrop ? 'cover' : 'inside', // Kein Beschnitt, wenn allowCrop false ist
            withoutEnlargement: true // Vergrößerung vermeiden
        });

        let formatFunction;
        if (outputFormat === 'jpeg') formatFunction = sharpInstance.jpeg({ quality });
        else if (outputFormat === 'png') formatFunction = sharpInstance.png({ quality });
        else if (outputFormat === 'webp') formatFunction = sharpInstance.webp({ quality });

        formatFunction
            .toFile(destPath, (err) => {
                if (err) console.error(`Fehler bei ${file}:`, err);
                else console.log(`Datei ${file} erfolgreich verarbeitet.`);
                processedFiles++;
                progressBar.update(processedFiles);

                if (processedFiles === totalFiles) {
                    progressBar.stop();
                    console.log('Alle Dateien erfolgreich verarbeitet!');
                }
            });
    });
}

module.exports = {
    compressAndResizeImages
};