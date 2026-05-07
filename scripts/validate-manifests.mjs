import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['manifests/model-manifests', 'manifests/runtime-manifests', 'manifests/deployment-manifests'];
for (const root of roots) {
  for (const file of readdirSync(root)) {
    const path = join(root, file);
    if (statSync(path).isFile() && file.endsWith('.json')) {
      const manifest = JSON.parse(readFileSync(path, 'utf8'));
      if (!manifest.id || !manifest.version) throw new Error(`${path} missing id or version`);
    }
  }
}
console.log('Manifest validation passed');
