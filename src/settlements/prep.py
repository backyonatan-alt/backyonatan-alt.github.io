# python3 prep.py -> data.json
# Source: data/cbs_localities_2023.csv (CBS localities file 2023, via data.gov.il, mirror github.com/khodossss/israeli-localities)
import csv, json, os, collections
D = os.path.dirname(os.path.abspath(__file__))
rows = list(csv.DictReader(open(D + '/data/cbs_localities_2023.csv', encoding='utf-8-sig')))
TYPE = {'310': 'm', '320': 'm', '330': 'k', '370': 'c'}          # moshav (incl. shitufi), kibbutz, community
WB = {'ראמאללה', 'ירדן-יריחו', 'טול כרם', 'חברון', 'בית לחם', 'שכם', "ג'נין"}
out, old, skipped = [], [], []
for r in rows:
    if r['is_locality'] != 'true' or r['religion_code'] not in ('1', '4'):
        continue
    code = r['settlement_form_code']
    t = TYPE.get(code, 'u' if code.startswith('1') else 'o')       # u = town/city/moshava, o = other rural
    reg = 'w' if r['subdistrict_he'] in WB else 'g' if r['subdistrict_he'] == 'גולן' else 'i'
    rec = [r['name_he'].replace(' -', '-'), None, round(float(r['lat']), 4), round(float(r['lon']), 4), t, reg]
    f = r['founded']
    if f[:1].isdigit():
        rec[1] = int(float(f)); out.append(rec)
    elif f == 'ותיק':
        old.append(rec)
    else:
        skipped.append(r['name_he'])
out.sort(key=lambda x: (x[1], x[0]))
json.dump({'pts': out, 'old': old}, open(D + '/data.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(out), 'dated,', len(old), 'old cities, skipped (no year):', skipped)
print(sorted(collections.Counter(x[4] for x in out).items()), sorted(collections.Counter(x[5] for x in out).items()))
for a, b in [(1870,1903),(1904,1918),(1919,1935),(1936,1939),(1940,1947),(1948,1951),(1952,1966),(1967,1976),(1977,1989),(1990,2023)]:
    print(a, b, sum(1 for x in out if a <= x[1] <= b))
