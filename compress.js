const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const cliProgress = require('cli-progress');
const heicConvert = require('heic-convert');

// Unterstützte Formate
const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.tif', '.tiff']; // TIF/TIFF hinzugefügt
const supportedOutputFormats = ['jpeg', 'png', 'webp'];

async function compressAndResizeImages(sourceDir = './src', destDir = './dst', maxWidth = 1920, maxHeight = 1080, quality = 80, outputFormat = 'jpg', allowCrop = false, concurrency = 5) {
    if (outputFormat === 'jpg') outputFormat = 'jpeg';

    if (!supportedOutputFormats.includes(outputFormat)) {
        console.error(`Das Zielformat "${outputFormat}" wird nicht unterstützt.`);
        return;
    }

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

    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(totalFiles, 0);

    let processedFiles = 0;

    const queue = [];
    for (let i = 0; i < files.length; i += concurrency) {
        queue.push(files.slice(i, i + concurrency));
    }

    for (const batch of queue) {
        await Promise.all(
            batch.map(async file => {
                const relativePath = path.relative(sourceDir, file);
                const destFileName = path.basename(file, path.extname(file)) + `.jpg`;
                const destPath = path.join(destDir, path.dirname(relativePath), destFileName);

                if (!fs.existsSync(path.dirname(destPath))) {
                    fs.mkdirSync(path.dirname(destPath), { recursive: true });
                }

                if (fs.existsSync(destPath)) {
                    console.log(`Datei ${destFileName} existiert bereits.`);
                    processedFiles++;
                    progressBar.update(processedFiles);
                    return;
                }

                const fileExtension = path.extname(file).toLowerCase();

                let tempFilePath = null;

                try {
                    if (fileExtension === '.heic') {
                        tempFilePath = await convertHeicToJpeg(file);
                        await processStandardImage(tempFilePath, destPath, maxWidth, maxHeight, quality, outputFormat, allowCrop);
                    } else if (fileExtension === '.tif' || fileExtension === '.tiff') {
                        await processStandardImage(file, destPath, maxWidth, maxHeight, quality, outputFormat, allowCrop);
                    } else {
                        await processStandardImage(file, destPath, maxWidth, maxHeight, quality, outputFormat, allowCrop);
                    }
                    processedFiles++;
                    progressBar.update(processedFiles);
                } catch (err) {
                    console.error(`Fehler bei Datei ${file}:`, err);
                } finally {
                    if (tempFilePath && fs.existsSync(tempFilePath)) {
                        fs.unlinkSync(tempFilePath);
                        console.log(`Temporäre Datei ${tempFilePath} gelöscht.`);
                    }
                }
            })
        );
    }

    progressBar.stop();
    console.log('Alle Dateien erfolgreich verarbeitet!');
}

async function convertHeicToJpeg(sourcePath) {
    try {
        const inputBuffer = fs.readFileSync(sourcePath);
        const outputBuffer = await heicConvert({
            buffer: inputBuffer,
            format: 'JPEG',
            quality: 1 // Maximale Qualität
        });

        const tempFilePath = path.join(path.dirname(sourcePath), path.basename(sourcePath, '.heic') + '_temp.jpg');
        fs.writeFileSync(tempFilePath, outputBuffer);
        console.log(`HEIC-Datei ${sourcePath} erfolgreich in temporäre JPEG-Datei konvertiert.`);
        return tempFilePath;
    } catch (err) {
        console.error(`Fehler beim Konvertieren der HEIC-Datei ${sourcePath}:`, err);
        throw err;
    }
}

async function processStandardImage(sourcePath, destPath, maxWidth, maxHeight, quality, outputFormat, allowCrop) {
    try {
        const sharpInstance = sharp(sourcePath).resize(maxWidth, maxHeight, {
            fit: allowCrop ? 'cover' : 'inside',
            withoutEnlargement: true
        });

        let formatFunction;
        if (outputFormat === 'jpeg') formatFunction = sharpInstance.jpeg({ quality });
        else if (outputFormat === 'png') formatFunction = sharpInstance.png({ quality });
        else if (outputFormat === 'webp') formatFunction = sharpInstance.webp({ quality });

        await formatFunction.toFile(destPath);
        console.log(`Datei ${sourcePath} erfolgreich verarbeitet und gespeichert.`);
    } catch (err) {
        console.error(`Fehler bei ${sourcePath}:`, err);
        throw err;
    }
}

module.exports = {
    compressAndResizeImages
};