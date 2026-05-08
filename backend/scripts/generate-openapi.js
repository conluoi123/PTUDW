
import { specs } from "../swagger.config.js";
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const yamlStr = yaml.dump(specs);
  // Output to backend root
  const outputPath = path.resolve(__dirname, '..', 'openapi.yaml');
  fs.writeFileSync(outputPath, yamlStr, 'utf8');
  console.log(`Successfully generated openapi.yaml at ${outputPath}`);
} catch (error) {
  console.error("Error generating openapi.yaml:", error);
  process.exit(1);
}
