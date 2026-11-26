# python3 prep.py -> data.json   (needs: pip install openpyxl xlrd pyproj)
# Source: data/bycode2023.xlsx, the CBS localities file for 2023 (קובץ היישובים, bycode2023.xlsx), downloaded by Yonatan.
import json, os, collections
import openpyxl, xlrd
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
    rec = [r['שם יישוב'].strip().replace(' -', '-'), None, round(lat, 4), round(lon, 4), t, reg, int(r['סמל מחוז'])]
    f = r['שנת ייסוד']
    if isinstance(f, (int, float)):
        rec[1] = int(f); out.append(rec)
    elif f == 'ותיק':
        old.append(rec)
    else:
        skipped.append(rec[0])
# Localities evacuated in 2005 (Gaza Strip and northern Samaria). They are gone from the 2023 file,
# so name, founding year and position come from the CBS file for 2004 (data/bycode2004.xls).
# Record: name, year, lat, lon, type, region, CBS district code (1 Jerusalem, 2 North, 3 Haifa, 4 Center, 5 Tel Aviv,
# 6 South, 7 Judea and Samaria, 8 Gaza), and for evacuated ones an 8th value: the year it ended. Coordinates there are 4+4 digits, units of 100 m.
EVAC_2005 = {5432, 5425, 5436, 5433, 5428, 5435, 5408, 5429, 5431, 5424, 5407, 5427, 5410, 5423, 5426, 5405,  # Gaza
             3758, 3729, 3711, 3642}                                                                          # Samaria
# Localities merged into a neighbour after 2004 (Kfar Azar, Neve Efal, Ramat Pinkas, Ramat Efal, Ma'ale Shomron,
# Sha'arei Tikva, Etz Efraim). The places still exist, only their CBS code is gone, so they stay as regular dots.
MERGED = {180, 2032, 883, 1049, 3637, 3720, 3778}
sh = xlrd.open_workbook(D + '/data/bycode2004.xls').sheet_by_index(0)
H4 = sh.row_values(0)
OLDTYPE = {31: 'm', 32: 'm', 33: 'k', 37: 'c'}
for i in range(1, sh.nrows):
    r = dict(zip(H4, sh.row_values(i)))
    code = int(r['סמל יישוב']) if r['סמל יישוב'] != '' else 0
    if code not in EVAC_2005 and code not in MERGED:
        continue
    s = str(int(r['קואורדינטות'])); lon, lat = itm.transform(int(s[:4]) * 100, int(s[4:]) * 100)
    form = int(r['צורת יישוב שוטפת'])
    reg = 'z' if int(r['נפה']) >= 80 else 'w' if int(r['נפה']) >= 70 else 'i'   # z = Gaza Strip
    out.append([r['שם יישוב מלא'].strip(), int(r['שנת ייסוד']), round(lat, 4), round(lon, 4),
                OLDTYPE.get(form, 'u' if form < 30 else 'o'), reg, int(r['נפה']) // 10] + ([2005] if code in EVAC_2005 else []))
    EVAC_2005.discard(code); MERGED.discard(code)
assert not EVAC_2005 and not MERGED, (EVAC_2005, MERGED)
out.sort(key=lambda x: (x[1], x[0]))
json.dump({'pts': out, 'old': old}, open(D + '/data.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(out), 'dated (', sum(1 for x in out if len(x) > 7), 'of them ended ),', len(old), 'old cities, skipped (no year):', skipped)
print(sorted(collections.Counter(x[4] for x in out).items()), sorted(collections.Counter(x[5] for x in out).items()))
