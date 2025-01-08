const { program } = require('commander');
const { compressAndResizeImages } = require('./compress.js');

program
  .option('-s, --source <sourceDir>', 'Source directory', 'src')
  .option('-d, --dest <destDir>', 'Destination directory', 'dst')
  .option('-w, --width <maxWidth>', 'Max width', 1920)
  .option('-h, --height <maxHeight>', 'Max height', 1920)
  .option('-q, --quality <quality>', 'Quality (1-100)', 60)
  .option('-f, --format <format>', 'Output format (e.g., jpg, png, webp)', 'jpg');

program.parse(process.argv);

const options = program.opts();
compressAndResizeImages(
  options.source,
  options.dest,
  parseInt(options.width),
  parseInt(options.height),
  parseInt(options.quality),
  options.format,
  false // auf true setzen um zu cropen
);