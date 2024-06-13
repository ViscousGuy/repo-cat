# repo-cat

## Description

repo-cat recursively traverses the current working directory and copies the contents of all files (except for specified exclusions) into a single output file. It supports ignoring files, folders, and file extensions based on command-line options and the project's `.gitignore` file. Additionally, it provides metadata for image and SVG files, including dimensions and file size.

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install the package globally

```
npm install -g .
```

## Usage

repo-cat [options]

### Options

- `--ignore-files <files...>`: Space-separated list of files to ignore.
- `--ignore-folders <folders...>`: Space-separated list of folders to ignore.
- `--ignore-exts <extensions...>`: Space-separated list of file extensions to ignore (without the dot).
- `-o, --output <file>`: Output file name (default: `repo-contents.txt`).

### Example

To create a file named `project-snapshot.txt` containing the contents of the current repository, excluding the `node_modules` folder, `.env` files, and `.png` and `.jpg` image files, run:

```
repo-cat --ignore-folders node_modules --ignore-files .env --ignore-exts .png .jpg -o project-snapshot.txt
```

## Default Ignored Patterns

By default, repo-cat ignores the following patterns:

- `.git/**` (Git repository files)
- `**/.*` (Hidden files)
- `**/*.mp4`, `**/*.mkv`, `**/*.avi`, `**/*.mov`, `**/*.wmv` (Video files)
- `**/*.zip`, `**/*.rar`, `**/*.tgz` (Compressed files)
