// Importieren Sie die Funktion "compressAndResizeImages" aus einer separaten Datei
const { compressAndResizeImages } = require('./compress.js');

// Rufen Sie die Funktion mit den erforderlichen Argumenten auf
compressAndResizeImages('src', 'dst', 1920, 1080, 60);
