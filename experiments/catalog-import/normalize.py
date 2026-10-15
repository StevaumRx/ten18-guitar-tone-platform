"""Normalize the downloaded catalog snapshots; no network or application writes."""
import hashlib
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def read(name):
    return json.loads((ROOT / name).read_text())

def write(name, value):
    (ROOT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')

def base(source, key, brand, model):
    return {'id': source + '-' + str(key), 'brand': brand, 'model': model,
            'source': source, 'technicalProfileStatus': 'not-verified',
            'controls': None, 'ports': None, 'midi': None}

raw = read('pedalplayground.raw.json')
pp = {}
for row, r in enumerate(raw):
    key = hashlib.sha256((r['Brand'] + '|' + r['Name'] + '|' + r['Image']).encode()).hexdigest()[:16]
    if key in pp:
        pp[key]['sourceRows'].append(row)
        continue
    item = base('pp', key, r['Brand'], r['Name'])
    item.update({'sourceRows': [row], 'imageUrl': 'https://pedalplayground.com/public/images/pedals/' + r['Image'],
                 'imageFilename': r['Image'], 'footprintMm': {'width': round(float(r['Width']) * 25.4, 2),
                 'depth': round(float(r['Height']) * 25.4, 2)}, 'categories': None})
    pp[key] = item
write('pedalplayground.catalog.json', {'schemaVersion': 1, 'items': list(pp.values())})

vendors = {r['vendor_code'].strip(): r['name'] for r in read('pedalboardplanner.brands.json')}
planner = []
for r in read('pedalboardplanner.raw.json'):
    vendor = (r.get('vendor_code') or '').strip()
    item = base('pt', r['pedal_id'], html.unescape(vendors.get(vendor, vendor)), html.unescape((r.get('name') or '').strip()))
    item.update({'vendorCode': vendor, 'sourceImagePath': r.get('file'), 'categories': r.get('type'),
                 'sourceFootprintInches': {'width': r.get('width'), 'depth': r.get('height')},
                 'manufacturerUrl': r.get('link'), 'active': r.get('active')})
    planner.append(item)
write('pedalboardplanner.catalog.json', {'schemaVersion': 1, 'items': planner})

rock = []
for r in read('rockboard.raw.json')['pedals']:
    item = base('rb', r['ID'], r['manufacturer']['name'] if r.get('manufacturer') else None, r['name'])
    item.update({'categories': r.get('categories'), 'sourceImagePath': r.get('imageURL'),
                 'sourceThumbnailPath': r.get('thumbnailURL'), 'public': r.get('public'),
                 'sourceDimensions': {'width': r.get('width'), 'depth': r.get('depth'), 'unit': 'not-verified'}})
    rock.append(item)
write('rockboard.catalog.json', {'schemaVersion': 1, 'items': rock})

sources = [('pedalplayground', list(pp.values()), len(raw)), ('pedalboardplanner', planner, len(planner)), ('rockboard', rock, len(rock))]
summary = {'retrievedDate': '2026-10-15', 'crossSourceDeduplication': 'not-performed', 'sources': []}
for name, items, raw_count in sources:
    assert len({r['id'] for r in items}) == len(items), f'Duplicate IDs: {name}'
    assert all(r['model'] for r in items), f'Empty models: {name}'
    summary['sources'].append({'name': name, 'rawRecords': raw_count, 'normalizedRecords': len(items),
                               'brands': len({r['brand'] for r in items})})
summary['rawRecordTotal'] = sum(s['rawRecords'] for s in summary['sources'])
summary['normalizedRecordTotal'] = sum(s['normalizedRecords'] for s in summary['sources'])
write('summary.json', summary)
print(json.dumps(summary, indent=2))
