import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const readSource = async (name) => JSON.parse(await readFile(new URL(`../experiments/catalog-import/${name}.catalog.json`, import.meta.url))).items;
// Preserve punctuation: Buffer, Buffer+, and Buffer++ are different products.
const normalize = (value) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '');
const keyFor = (item) => `${normalize(item.brand)}|${normalize(item.model)}`;
const records = await readSource('rockboard');
const groups = Map.groupBy(records.filter((item) => item.public === true), keyFor);
const items = [...groups.values()].map((rows) => {
  const representative = rows[0];
  return {
    id: representative.id,
    brand: representative.brand.trim(), model: representative.model.trim(),
    aliases: [...new Set(rows.map((row) => row.model))],
    categories: [...new Set(rows.flatMap((row) => row.categories ?? []))].sort(),
    technicalProfileStatus: 'not-verified', controls: null, ports: null, midi: null,
    sourceImagePath: representative.sourceImagePath,
    sourceThumbnailPath: representative.sourceThumbnailPath,
    sourceDimensions: representative.sourceDimensions,
    sourceRefs: rows.map((row) => ({ source: 'rb', sourceId: row.id }))
  };
}).sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model));

// Previous sources are read ONLY to migrate saved rigs, never to populate the picker.
const oldCanonical = (value) => (value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
const previousRecords = (await Promise.all(['pedalplayground', 'pedalboardplanner'].map(readSource))).flat().concat(records);
const previousGroups = Map.groupBy(previousRecords, (item) => `${oldCanonical(item.brand)}|${oldCanonical(item.model)}`);
const bySourceId = new Map(items.flatMap((item) => item.sourceRefs.map((ref) => [ref.sourceId, item.id])));
const byIdentity = new Map(items.map((item) => [keyFor(item), item.id]));
const migrations = {};
const legacyItems = [];
for (const [key, rows] of previousGroups) {
  const oldId = `equipment-${createHash('sha256').update(key).digest('hex').slice(0, 16)}`;
  const candidates = new Set(rows.flatMap((row) => {
    const id = row.source === 'rb' ? bySourceId.get(row.id) : byIdentity.get(keyFor(row));
    return id ? [id] : [];
  }));
  if (candidates.size === 1) migrations[oldId] = [...candidates][0];
  else legacyItems.push({ id: oldId, brand: rows[0].brand, model: rows[0].model });
}
const report = {
  schemaVersion: 1, source: 'rockboard', inputRecords: records.length,
  importedEquipment: items.length, redundantRecordsRemoved: records.length - items.length,
  brands: new Set(items.map((item) => item.brand)).size,
  migratedLegacyIdentities: Object.keys(migrations).length, preservedLegacyIdentities: legacyItems.length,
  strategy: 'RockBoard public records only. Merge case, diacritic, and whitespace differences; preserve punctuation, editions and versions. Other sources are used only for saved-rig compatibility.'
};
await writeFile(new URL('../public/equipment-catalog.json', import.meta.url), `${JSON.stringify({ schemaVersion: 1, source: 'rockboard', sourceEndpoints: { rb: 'https://api.rockboard.de/next-public' }, items, migrations, legacyItems }, null, 2)}\n`);
await writeFile(new URL('../experiments/catalog-import/catalog-import-report.json', import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
