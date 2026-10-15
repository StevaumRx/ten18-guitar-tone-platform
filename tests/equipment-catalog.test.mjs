import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createCatalogIndex, createEmptyRig, addDevice, loadRig, matchesEquipment } from '../public/rig-domain.js';

const catalog = JSON.parse(await readFile(new URL('../public/equipment-catalog.json', import.meta.url)));

test('starter catalog contains only Ten18-owned generic equipment types', () => {
  assert.equal(catalog.catalogOwner, 'Ten18');
  assert.ok(catalog.items.length > 0);
  assert.equal(new Set(catalog.items.map((item) => item.id)).size, catalog.items.length);
  assert.ok(catalog.items.every((item) => item.brand === 'Generic'));
  assert.ok(catalog.items.every((item) => item.controls === null && item.ports === null && item.midi === null));
});

test('starter catalog has no copied source metadata or image references', () => {
  const prohibited = ['sourceImagePath', 'sourceThumbnailPath', 'sourceDimensions', 'sourceRefs'];
  assert.ok(catalog.items.every((item) => prohibited.every((field) => !(field in item))));
  assert.deepEqual(catalog.migrations, {});
  assert.deepEqual(catalog.legacyItems, []);
});

test('generic equipment remains searchable and usable in a saved rig', () => {
  const delay = catalog.items.find((item) => item.id === 'generic-delay-pedal');
  assert.ok(matchesEquipment(delay, 'echo'));
  const ids = createCatalogIndex(catalog.items);
  const rig = addDevice(createEmptyRig(), delay.id, ids);
  assert.deepEqual(loadRig(JSON.stringify(rig), ids), rig);
});
