# repo-cat

repo-cat is a command-line tool that generates a file containing the contents of a repository, excluding specified files, folders, and file extensions. It can be useful for creating a backup or snapshot of your project's source code.

## Description

repo-cat recursively traverses the current working directory and copies the contents of all files (except for specified exclusions) into a single output file. It supports ignoring files, folders, and file extensions based on command-line options and the project's `.gitignore` file. Additionally, it provides metadata for image and SVG files, including dimensions and file size.

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies

## Usage

npm run repo-cat [options]

### Options

- `--ignore-files <files...>`: Comma-separated list of files to ignore.
- `--ignore-folders <folders...>`: Comma-separated list of folders to ignore.
- `--ignore-exts <extensions...>`: Comma-separated list of file extensions to ignore (without the dot).
- `-o, --output <file>`: Output file name (default: `repo-contents.txt`).

### Example

To create a file named `project-snapshot.txt` containing the contents of the current repository, excluding the `node_modules` folder, `.env` files, and `.png` and `.jpg` image files, run:

```
npm run repo-cat --ignore-folders node_modules --ignore-files .env --ignore-exts png,jpg -o project-snapshot.txt
```

## Default Ignored Patterns

By default, repo-cat ignores the following patterns:

- `.git/**` (Git repository files)
- `**/.*` (Hidden files)
- `**/*.mp4`, `**/*.mkv`, `**/*.avi`, `**/*.mov`, `**/*.wmv` (Video files)
- `**/*.zip`, `**/*.rar`, `**/*.tgz` (Compressed files)
