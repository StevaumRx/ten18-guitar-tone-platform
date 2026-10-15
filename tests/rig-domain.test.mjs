import test from 'node:test';
import assert from 'node:assert/strict';
import { addDevice, createCatalogIndex, createEmptyRig, loadRig, moveDevice, removeDevice, validateRig } from '../public/rig-domain.js';

const catalogIds = createCatalogIndex([
  { id: 'test-electric-guitar' },
  { id: 'test-overdrive' },
  { id: 'test-delay' },
  { id: 'test-amp' },
  { id: 'test-modeler' }
]);

test('catalog selection creates distinct instances for the same model', () => {
  let rig = addDevice(createEmptyRig(), 'test-overdrive', catalogIds);
  rig = addDevice(rig, 'test-overdrive', catalogIds);
  assert.deepEqual(rig.instances.map((item) => item.instanceId), ['test-overdrive-1', 'test-overdrive-2']);
  assert.equal(rig.connections.length, 1);
  assert.equal(validateRig(rig, catalogIds), true);
});

test('moving and removing cards rebuilds the physical audio connections', () => {
  let rig = addDevice(createEmptyRig(), 'test-electric-guitar', catalogIds);
  rig = addDevice(rig, 'test-delay', catalogIds);
  rig = addDevice(rig, 'test-amp', catalogIds);
  rig = moveDevice(rig, 'test-amp-1', -1);
  assert.deepEqual(rig.instances.map((item) => item.catalogId), ['test-electric-guitar', 'test-amp', 'test-delay']);
  rig = removeDevice(rig, 'test-amp-1');
  assert.deepEqual(rig.connections, [{ fromInstanceId: 'test-electric-guitar-1', toInstanceId: 'test-delay-1', kind: 'audio' }]);
});

test('only a valid versioned rig can restore from saved JSON', () => {
  const rig = addDevice(createEmptyRig(), 'test-modeler', catalogIds);
  assert.deepEqual(loadRig(JSON.stringify(rig), catalogIds), rig);
  assert.equal(loadRig('{', catalogIds), null);
  assert.equal(loadRig(JSON.stringify({ ...rig, version: 99 }), catalogIds), null);
  assert.equal(loadRig(JSON.stringify({ ...rig, connections: [{ fromInstanceId: 'test-modeler-1', toInstanceId: 'missing', kind: 'audio' }] }), catalogIds), null);
});
