const fs = require("fs");
const path = require("path");
const { minimatch } = require("minimatch");

function readGitignore() {
  const repoRoot = process.cwd();
  const gitignorePath = path.join(repoRoot, ".gitignore");

  if (!fs.existsSync(gitignorePath)) {
    console.warn("Warning: .gitignore file not found.");
    return [];
  }

  try {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
    return gitignoreContent
      .split("\n")
      .filter((line) => line.trim() !== "" && !line.startsWith("#"))
      .map((line) => line.trim());
  } catch (err) {
    console.error("Error reading .gitignore:", err);
    return [];
  }
}

function traverseAndCopy(
  dirPath,
  ignorePatterns,
  ignoreFiles,
  ignoreFolders,
  outputFileStream
) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(process.cwd(), fullPath);

    // Normalize relativePath to ensure consistency
    const normalizedRelativePath = relativePath.split(path.sep).join("/");

    // Check if entry should be ignored based on .gitignore and command line options
    if (
      ignorePatterns.some((pattern) =>
        minimatch(normalizedRelativePath, pattern, { dot: true })
      )
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      traverseAndCopy(
        fullPath,
        ignorePatterns,
        ignoreFiles,
        ignoreFolders,
        outputFileStream
      );
    } else {
      const fileContent = fs.readFileSync(fullPath, "utf-8");
      outputFileStream.write(`\n\n### ${fullPath}\n\n`);
      outputFileStream.write(fileContent);
    }
  }
}

module.exports = { readGitignore, traverseAndCopy };
