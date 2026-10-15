import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createCatalogIndex, createEmptyRig, addDevice, loadRig, migrateRig, matchesEquipment } from '../public/rig-domain.js';

const catalog = JSON.parse(await readFile(new URL('../public/equipment-catalog.json', import.meta.url)));

test('selectable equipment comes exclusively from RockBoard with unique identities', () => {
  assert.equal(catalog.source, 'rockboard');
  assert.ok(catalog.items.length > 13000);
  assert.equal(new Set(catalog.items.map((item) => item.id)).size, catalog.items.length);
  assert.ok(catalog.items.every((item) => item.sourceRefs.every((ref) => ref.source === 'rb')));
  assert.ok(catalog.items.every((item) => item.controls === null && item.ports === null && item.midi === null));
});

test('Mercury X has one standard card and either spelling finds it', () => {
  const matches = catalog.items.filter((item) => item.brand === 'Meris' && item.model.replace(/\s/g, '').toLowerCase() === 'mercuryx');
  assert.equal(matches.length, 1);
  assert.ok(matchesEquipment(matches[0], 'MercuryX'));
  assert.ok(matchesEquipment(matches[0], 'Mercury X'));
  assert.ok(catalog.items.some((item) => item.brand === 'Meris' && item.model.includes('10th Anniversary')));
});

test('punctuation distinguishing real product versions is preserved', () => {
  const empress = catalog.items.filter((item) => item.brand === 'Empress Effects');
  for (const model of ['Buffer', 'Buffer+', 'Buffer++']) assert.ok(empress.some((item) => item.model === model));
});

test('saved rigs retain device instances, order and connections after catalog migration', () => {
  const target = catalog.items.find((item) => item.brand === 'Meris' && item.model === 'Mercury X');
  const aliases = Object.keys(catalog.migrations).filter((key) => catalog.migrations[key] === target.id);
  assert.ok(aliases.length >= 2);
  const legacy = catalog.legacyItems[0];
  const oldIds = new Set([...aliases, legacy.id]);
  let rig = addDevice(createEmptyRig(), aliases[0], oldIds);
  rig = addDevice(rig, aliases[1], oldIds);
  rig = addDevice(rig, legacy.id, oldIds);
  const restored = loadRig(migrateRig(JSON.stringify(rig), catalog.migrations), createCatalogIndex([...catalog.items, ...catalog.legacyItems]));
  assert.ok(restored);
  assert.deepEqual(restored.instances.map((item) => item.catalogId), [target.id, target.id, legacy.id]);
  assert.deepEqual(restored.instances.map((item) => item.instanceId), rig.instances.map((item) => item.instanceId));
  assert.deepEqual(restored.connections, rig.connections);
  assert.equal(migrateRig('{', catalog.migrations), '{');
});
