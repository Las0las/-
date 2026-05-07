import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

test('all manifests include id and version', () => {
  for (const root of ['manifests/model-manifests', 'manifests/runtime-manifests', 'manifests/deployment-manifests']) {
    for (const file of readdirSync(root).filter((name) => name.endsWith('.json'))) {
      const manifest = JSON.parse(readFileSync(join(root, file), 'utf8'));
      assert.equal(typeof manifest.id, 'string');
      assert.equal(typeof manifest.version, 'string');
    }
  }
});
