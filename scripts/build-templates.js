import fs from "node:fs";
import path from "node:path";
import mjml2html from "mjml";

const root = new URL("..", import.meta.url).pathname;
const mjmlDir = path.join(root, "templates", "mjml");
const outDir = path.join(root, "templates", "compiled");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const files = fs
  .readdirSync(mjmlDir)
  .filter((f) => f.endsWith(".mjml"));

for (const file of files) {
  const inputPath = path.join(mjmlDir, file);
  const mjml = fs.readFileSync(inputPath, "utf8");
  const { html, errors } = mjml2html(mjml, {
    validationLevel: "soft",
    filePath: mjmlDir,
  });

  if (errors && errors.length > 0) {
    const message = errors.map((e) => e.formattedMessage).join("\n");
    throw new Error(`MJML error en ${file}:\n${message}`);
  }

  const outName = file.replace(/\.mjml$/, ".html");
  const outPath = path.join(outDir, outName);
  fs.writeFileSync(outPath, html, "utf8");
  console.log(`OK ${outName}`);
}
