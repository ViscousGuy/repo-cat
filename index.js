const fs = require("fs");
const path = require("path");
const { minimatch } = require("minimatch");
const sharp = require("sharp");
const { parse } = require("svgson");

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

async function processImage(fullPath, entry, outputFileStream) {
  try {
    const metadata = await sharp(fullPath).metadata();
    const { size } = await fs.promises.stat(fullPath);
    const output = `\n\n### ${fullPath}\n\n- File Name: ${entry.name}\n- Format: ${metadata.format}\n- Dimensions: ${metadata.width}x${metadata.height}\n- Size: ${size} bytes\n`;
    return output;
  } catch (err) {
    console.error(`Error reading image metadata for ${fullPath}:`, err);
    const output = `\n\n### ${fullPath}\n\n- File Name: ${entry.name}\n- Size: Unknown bytes\n- Format: Unknown\n- Dimensions: Unknown\n`;
    return output;
  }
}

async function processSvg(fullPath, entry, outputFileStream) {
  try {
    const data = await fs.promises.readFile(fullPath, "utf-8");
    const result = await parse(data);
    const width = result.attributes.width || "unknown";
    const height = result.attributes.height || "unknown";
    const size = Buffer.byteLength(data, "utf8");
    const output = `\n\n### ${fullPath}\n\n- File Name: ${entry.name}\n- Format: svg\n- Dimensions: ${width}x${height}\n- Size: ${size} bytes\n`;
    return output;
  } catch (err) {
    console.error(`Error reading or parsing SVG file ${fullPath}:`, err);
    return "";
  }
}

async function traverseAndCopy(dirPath, ignorePatterns, ignoreExtensions) {
  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (err) {
    console.error(`Error reading directory ${dirPath}:`, err);
    return "";
  }

  let output = "";

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(process.cwd(), fullPath);
    const normalizedRelativePath = relativePath.split(path.sep).join("/");

    if (
      ignorePatterns.some((pattern) =>
        minimatch(normalizedRelativePath, pattern, { dot: true })
      )
    ) {
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (ignoreExtensions.includes(ext)) {
      continue;
    }

    if (entry.isDirectory()) {
      output += await traverseAndCopy(
        fullPath,
        ignorePatterns,
        ignoreExtensions
      );
    } else {
      if (
        [
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".bmp",
          ".tiff",
          ".webp",
          ".svg",
        ].includes(ext)
      ) {
        output +=
          ext === ".svg"
            ? await processSvg(fullPath, entry)
            : await processImage(fullPath, entry);
      } else {
        let fileContent;
        try {
          fileContent = fs.readFileSync(fullPath);
        } catch (err) {
          console.error(`Error reading file ${fullPath}:`, err);
          continue;
        }
        output += `\n\n### ${fullPath}\n\n${fileContent}`;
      }
    }
  }

  return output;
}

module.exports = { readGitignore, traverseAndCopy };
