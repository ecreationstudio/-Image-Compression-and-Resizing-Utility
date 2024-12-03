
# Image Compression and Resizing Utility

This project is a flexible and powerful tool for image compression, resizing, and format conversion. It is designed to help developers and designers optimize images efficiently, improving loading times for web applications or other projects.

The tool processes all directories recursively from the source folder and creates a matching directory structure in the destination folder, where the optimized files are stored.

---

## Features

- **Compression and Resizing:**
  Reduces images to a maximum width and height while preserving the original aspect ratio. Optionally, cropping can be enabled to fit exact dimensions.

- **Format Conversion:**
  Converts images into various output formats such as `jpg`, `png`, or `webp`.

- **Recursive Processing:**
  Processes images in all subdirectories of the source folder and preserves the directory structure in the destination folder.

- **Progress Tracking:**
  Displays a real-time progress bar in the CLI.

- **Flexible Configuration:**
  CLI options allow you to specify parameters such as target size, quality, output format, and cropping behavior.

---

## Requirements

Ensure the following tools and versions are installed on your system:

- **Node.js**: Version 14 or higher
- **NPM**: For managing dependencies

---

## Installation

1. Clone or download the repository:
   ```bash
   git clone https://github.com/ecreationstudio/Image-Compression-and-Resizing-Utility.git
   cd Image-Compression-and-Resizing-Utility
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

---

## Usage

The tool is executed via the command line. A standard execution looks like this:

```bash
node index.js -s <source-folder> -d <destination-folder> -w <width> -h <height> -q <quality> -f <output-format> [--crop]
```

---

### CLI Options

| Option         | Description                                                                   | Default Value |
|----------------|-------------------------------------------------------------------------------|---------------|
| `-s, --source` | Path to the source directory containing images to process                    | `/src`        |
| `-d, --dest`   | Path to the destination directory for the processed images                   | `/dst`        |
| `-w, --width`  | Maximum width of images in pixels                                            | 1920          |
| `-h, --height` | Maximum height of images in pixels                                           | 1080          |
| `-q, --quality`| Image quality (1-100, only for lossy formats)                                | 80            |
| `-f, --format` | Output format (`jpg`, `png`, `webp`)                                         | `jpg`         |
| `--crop`       | Enables cropping to fit exact dimensions                                     | Disabled      |

---

### Examples

#### Standard processing (no cropping, proportional resizing):
```bash
node index.js -s /src -d /dst -w 1920 -h 1080 -q 80 -f jpg
```

#### With cropping:
```bash
node index.js -s /src -d /dst -w 1920 -h 1080 -q 80 -f jpg --crop
```

#### Conversion to WebP:
```bash
node index.js -s /src -d /dst -w 800 -h 600 -q 90 -f webp
```

#### Keep original size, only compress:
```bash
node index.js -s /src -d /dst -q 70 -f jpg
```

---

## Progress Tracking

While processing, the progress is displayed in the console, including the total number of files to process and the number of files already processed.

**Example Output:**
```
[==========================>-------] 75% | 30/40 files processed
```

A summary is displayed at the end when all files have been successfully processed.

---

## Supported File Formats

### Input:
- `.jpg`
- `.jpeg`
- `.png`
- `.webp`
- `.gif`

### Output:
- `.jpg`
- `.png`
- `.webp`

---

## Source and Destination Folder Defaults

- **Source Folder**: `/src`
- **Destination Folder**: `/dst`

These defaults ensure a simple and consistent starting point. Override them with the `-s` and `-d` options if needed.

---

## Directory Structure

The directory structure in the destination folder mirrors the source folder structure. All optimized files are stored in their corresponding subdirectories.

---

## Dependencies

This tool uses the following libraries:

- [sharp](https://sharp.pixelplumbing.com/): High-performance image processing.
- [cli-progress](https://github.com/AndiDittrich/Node.CLI-Progress): CLI progress bar.

---

## Author

This tool was developed by **ecreation**, providing developers with an easy-to-use solution for image optimization.

---

## License

This project is released under the **MIT License**.
