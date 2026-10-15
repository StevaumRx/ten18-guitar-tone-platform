export const RIG_VERSION = 1;

const outputs = new Set(['amp-input', 'audio-interface', 'powered-speaker', 'headphones']);

export function createCatalogIndex(items) { return new Set(items.map((item) => item.id)); }

export function createEmptyRig() {
  return { version: RIG_VERSION, output: 'amp-input', instances: [], connections: [], extensions: { ports: [], branches: [], modelerBlocks: [], controlConnections: [] } };
}

export function buildConnections(instances) {
  return instances.slice(0, -1).map((instance, index) => ({ fromInstanceId: instance.instanceId, toInstanceId: instances[index + 1].instanceId, kind: 'audio' }));
}

function nextInstanceId(instances, catalogId) {
  const prefix = `${catalogId}-`;
  const numbers = instances.filter((instance) => instance.instanceId.startsWith(prefix)).map((instance) => Number(instance.instanceId.slice(prefix.length))).filter(Number.isInteger);
  return `${prefix}${Math.max(0, ...numbers) + 1}`;
}

export function addDevice(rig, catalogId, catalogIds) {
  if (!catalogIds?.has(catalogId)) throw new Error('Unknown catalog device.');
  const instances = [...rig.instances, { instanceId: nextInstanceId(rig.instances, catalogId), catalogId }];
  return { ...rig, instances, connections: buildConnections(instances) };
}

export function moveDevice(rig, instanceId, direction) {
  const from = rig.instances.findIndex((instance) => instance.instanceId === instanceId);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= rig.instances.length) return rig;
  const instances = [...rig.instances];
  [instances[from], instances[to]] = [instances[to], instances[from]];
  return { ...rig, instances, connections: buildConnections(instances) };
}

export function removeDevice(rig, instanceId) {
  const instances = rig.instances.filter((instance) => instance.instanceId !== instanceId);
  return { ...rig, instances, connections: buildConnections(instances) };
}

export function validateRig(value, catalogIds) {
  if (!value || typeof value !== 'object' || value.version !== RIG_VERSION || !outputs.has(value.output) || !Array.isArray(value.instances) || !Array.isArray(value.connections)) return false;
  const ids = new Set();
  for (const instance of value.instances) {
    if (!instance || typeof instance.instanceId !== 'string' || !catalogIds?.has(instance.catalogId) || ids.has(instance.instanceId)) return false;
    ids.add(instance.instanceId);
  }
  return JSON.stringify(value.connections) === JSON.stringify(buildConnections(value.instances));
}

export function loadRig(serialized, catalogIds) {
  try { const rig = JSON.parse(serialized); return validateRig(rig, catalogIds) ? rig : null; } catch { return null; }
}

// Keep instance IDs and wiring stable while changing catalog references.
export function migrateRig(serialized, migrations = {}) {
  try {
    const rig = JSON.parse(serialized);
    if (!rig || !Array.isArray(rig.instances)) return serialized;
    return JSON.stringify({ ...rig, instances: rig.instances.map((instance) => ({ ...instance, catalogId: migrations[instance.catalogId] ?? instance.catalogId })) });
  } catch { return serialized; }
}

export function matchesEquipment(device, query) {
  const normalize = (value) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '');
  const text = [device.brand, device.model, ...(device.aliases ?? []), ...(device.categories ?? [])].join(' ');
  return normalize(text).includes(normalize(query));
}
