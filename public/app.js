import { addDevice, buildConnections, createCatalogIndex, createEmptyRig, loadRig, matchesEquipment, migrateRig, moveDevice, removeDevice, validateRig } from './rig-domain.js';

const storageKey = 'ten18.rig-builder.v1';
const catalogList = document.querySelector('#catalog-list');
const chainList = document.querySelector('#chain-list');
const search = document.querySelector('#catalog-search');
const output = document.querySelector('#listening-output');
const status = document.querySelector('#save-status');
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
let catalog = [];
let catalogIds = new Set();
let legacyCatalog = [];
let rig = createEmptyRig();
let draggedId = null;
const labelFor = (id) => { const device = catalog.find((item) => item.id === id) ?? legacyCatalog.find((item) => item.id === id); return device ? `${device.brand} ${device.model}` : id; };

function persist(message = 'Rig saved locally.') {
  if (!validateRig(rig, catalogIds)) throw new Error('Rig data did not pass validation.');
  localStorage.setItem(storageKey, JSON.stringify(rig));
  status.textContent = message;
}
function renderCatalog() {
  const query = search.value.trim().toLowerCase();
  if (!query) {
    catalogList.innerHTML = `<li class="empty">Search ${catalog.length.toLocaleString()} generic equipment types by name or category.</li>`;
    return;
  }
  const matches = catalog.filter((device) => matchesEquipment(device, query));
  const visible = matches.slice(0, 60);
  catalogList.innerHTML = visible.map((device) => `<li class="catalog-card"><div class="catalog-card-mark" aria-hidden="true">${escapeHtml(device.brand.slice(0, 1))}</div><div class="catalog-card-copy"><span class="eyebrow">${escapeHtml(device.categories.join(' · ') || 'Equipment')}</span><h3>${escapeHtml(device.model)}</h3><p>${escapeHtml(device.brand)}</p><small>Ten18 starter type · controls & MIDI unknown</small></div><button type="button" data-add="${escapeHtml(device.id)}">Add to rig</button></li>`).join('') || '<li class="empty">No catalog devices match that search.</li>';
  if (matches.length > visible.length) catalogList.insertAdjacentHTML('beforeend', `<li class="results-note">Showing ${visible.length} of ${matches.length.toLocaleString()} matches. Refine your search.</li>`);
}
function renderChain() {
  output.value = rig.output;
  if (!rig.instances.length) { chainList.innerHTML = '<li class="empty chain-empty">Your physical signal chain will appear here. Add equipment from the catalog.</li>'; return; }
  chainList.innerHTML = rig.instances.map((instance, index) => `<li class="chain-card" draggable="true" data-instance="${escapeHtml(instance.instanceId)}"><span class="handle" aria-hidden="true">⠿</span><div><span class="eyebrow">${index + 1} · physical wiring</span><h3>${escapeHtml(labelFor(instance.catalogId))}</h3><p>${escapeHtml(instance.instanceId)}</p></div><div class="card-actions"><button type="button" data-move="-1" data-instance="${escapeHtml(instance.instanceId)}" aria-label="Move ${escapeHtml(labelFor(instance.catalogId))} left">←</button><button type="button" data-move="1" data-instance="${escapeHtml(instance.instanceId)}" aria-label="Move ${escapeHtml(labelFor(instance.catalogId))} right">→</button><button type="button" class="remove" data-remove="${escapeHtml(instance.instanceId)}">Remove</button></div>${index < rig.instances.length - 1 ? '<span class="signal-link" aria-hidden="true">↓</span>' : ''}</li>`).join('');
}
function render() { renderCatalog(); renderChain(); }

search.addEventListener('input', renderCatalog);
catalogList.addEventListener('click', (event) => { const id = event.target.dataset.add; if (!id) return; rig = addDevice(rig, id, catalogIds); persist(`${labelFor(id)} added and rig saved locally.`); renderChain(); });
output.addEventListener('change', () => { rig = { ...rig, output: output.value }; persist('Listening output saved locally.'); });
chainList.addEventListener('click', (event) => { const id = event.target.dataset.instance; if (event.target.dataset.move) rig = moveDevice(rig, id, Number(event.target.dataset.move)); if (event.target.dataset.remove) rig = removeDevice(rig, id); if (!id) return; persist('Physical signal chain saved locally.'); renderChain(); });
chainList.addEventListener('dragstart', (event) => { draggedId = event.target.closest('[data-instance]')?.dataset.instance ?? null; });
chainList.addEventListener('dragover', (event) => event.preventDefault());
chainList.addEventListener('drop', (event) => { event.preventDefault(); const targetId = event.target.closest('[data-instance]')?.dataset.instance; if (!draggedId || !targetId || draggedId === targetId) return; const from = rig.instances.findIndex((item) => item.instanceId === draggedId); const to = rig.instances.findIndex((item) => item.instanceId === targetId); const instances = [...rig.instances]; const [moved] = instances.splice(from, 1); instances.splice(to, 0, moved); rig = { ...rig, instances, connections: buildConnections(instances) }; persist('Physical signal chain reordered and saved locally.'); renderChain(); });

try {
  const response = await fetch('./equipment-catalog.json');
  if (!response.ok) throw new Error('Catalog is unavailable.');
  const data = await response.json();
  if (data.schemaVersion !== 1 || !Array.isArray(data.items)) throw new Error('Catalog data is invalid.');
  catalog = data.items;
  const serialized = localStorage.getItem(storageKey);
  const migrated = migrateRig(serialized, data.migrations);
  let savedIds = new Set();
  try { savedIds = new Set(JSON.parse(migrated)?.instances?.map((item) => item.catalogId) ?? []); } catch {}
  legacyCatalog = (data.legacyItems ?? []).filter((item) => savedIds.has(item.id));
  catalogIds = createCatalogIndex([...catalog, ...legacyCatalog]);
  rig = loadRig(migrated, catalogIds) ?? createEmptyRig();
  if (serialized && loadRig(migrated, catalogIds)) localStorage.setItem(storageKey, JSON.stringify(rig));
  status.textContent = `${catalog.length.toLocaleString()} Ten18 generic equipment types ready.`;
  render();
} catch {
  status.textContent = 'Unable to load the local catalog.';
  catalogList.innerHTML = '<li class="empty">The equipment catalog could not be loaded.</li>';
}
