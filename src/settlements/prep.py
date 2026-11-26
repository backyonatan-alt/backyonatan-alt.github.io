# python3 prep.py -> data.json   (needs: pip install openpyxl pyproj)
# Source: data/bycode2023.xlsx, the CBS localities file for 2023 (קובץ היישובים, bycode2023.xlsx), downloaded by Yonatan.
import json, os, collections
import openpyxl
from pyproj import Transformer
D = os.path.dirname(os.path.abspath(__file__))
ws = openpyxl.load_workbook(D + '/data/bycode2023.xlsx', read_only=True, data_only=True).active
it = ws.iter_rows(values_only=True); H = next(it)
rows = [dict(zip(H, r)) for r in it if r[1] is not None]
itm = Transformer.from_crs(2039, 4326, always_xy=True)             # Israel TM grid -> WGS84
TYPE = {310: 'm', 320: 'm', 330: 'k', 370: 'c'}                    # moshav (incl. shitufi), kibbutz, community
WB = {'ראמאללה', 'ירדן-יריחו', 'טול כרם', 'חברון', 'בית לחם', 'שכם', "ג'נין"}
out, old, skipped = [], [], []
for r in rows:
    form, coord = r['צורת יישוב שוטפת - ארעי'], r['קואורדינטות']
    if r['דת יישוב'] not in (1, 4) or not form or not coord:       # Jewish and mixed localities only
        continue
    s = str(int(coord)); lon, lat = itm.transform(int(s[:6]), int(s[6:]))   # 6 digits east + 6 digits north, metres
    t = TYPE.get(form, 'u' if 100 <= form < 200 else 'o')          # u = town/city/moshava, o = other rural
    reg = 'w' if r['שם נפה'] in WB else 'g' if r['שם נפה'] == 'גולן' else 'i'
    rec = [r['שם יישוב'].strip().replace(' -', '-'), None, round(lat, 4), round(lon, 4), t, reg]
    f = r['שנת ייסוד']
    if isinstance(f, (int, float)):
        rec[1] = int(f); out.append(rec)
    elif f == 'ותיק':
        old.append(rec)
    else:
        skipped.append(rec[0])
out.sort(key=lambda x: (x[1], x[0]))
json.dump({'pts': out, 'old': old}, open(D + '/data.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(out), 'dated,', len(old), 'old cities, skipped (no year):', skipped)
print(sorted(collections.Counter(x[4] for x in out).items()), sorted(collections.Counter(x[5] for x in out).items()))
