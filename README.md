# Image Compression and Resizing Utility

This project provides a function for compressing and resizing images within a source directory. The function uses the `sharp` module to process image files and the `fs` and `path` modules to perform file system operations.

## Key Features

- **Source and Destination Directories**: The function processes all image files from a specified source directory and saves the compressed and resized images in a specified destination directory.
- **Directory Management**: If the destination directory does not exist, it is automatically created.
- **Image Processing**: Each image is resized to the specified maximum width and height, maintaining the aspect ratio without enlarging the image, and then saved in JPEG format with the specified quality.
- **Avoiding File Overwrite**: If a file already exists in the destination directory, processing for that file is skipped to avoid unnecessary repetition.

## Usage

This function is particularly useful for developers who need to prepare images for web applications by reducing file size and adjusting image dimensions to minimize loading times and storage requirements.

## Export

The function is exported using `module.exports` and can be imported and used in other files within the project.

```javascript
const { compressAndResizeImages } = require('./path/to/your/module');

// Example function call
compressAndResizeImages('path/to/sourceDir', 'path/to/destDir', 800, 600, 80);
```

## Dependencies

- `sharp`: A high-performance image processing module.
- `fs`: A Node.js module for file system operations.
- `path`: A Node.js module for working with file paths.

Ensure you install all necessary modules before using the function:

```sh
npm install
```

## Author

This utility was created by ecreation.

## License

This project is licensed under the MIT License.
