
import { specs } from "../swagger.config.js";
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// __dirname is backend/scripts
// root is backend/.. -> PTUDW
const rootDir = path.resolve(__dirname, '../../'); 
const apiDocsDir = path.join(rootDir, 'api-docs');
const outputFile = path.join(apiDocsDir, 'openapi.yaml');

console.log(`Starting generation...`);
console.log(`Target directory: ${apiDocsDir}`);

try {
  if (!fs.existsSync(apiDocsDir)){
      fs.mkdirSync(apiDocsDir, { recursive: true });
      console.log('Created api-docs directory');
  }

  const yamlStr = yaml.dump(specs);
  fs.writeFileSync(outputFile, yamlStr, 'utf8');
  console.log(`Successfully generated openapi.yaml at ${outputFile}`);
} catch (error) {
  console.error("Error generating openapi.yaml:", error);
  process.exit(1);
}
