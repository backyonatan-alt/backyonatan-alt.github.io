"""Make src/winter/data.json from the CSVs in data/. Prints what it used."""
import csv, json, collections, os

D = os.path.join(os.path.dirname(__file__), 'data')
rows = lambda f: list(csv.DictReader(open(os.path.join(D, f), encoding='utf-8')))

# Season week order: epi week 40..52(53), then 1..39
def sidx(week):
    return week - 40 if week >= 40 else week + 12  # week 1 -> 13

# --- CDC ILINet ages 0-4, weekly % ILI, per season (weeks 40..20 only) ---
cdc = collections.defaultdict(dict)
for r in rows('cdc_ilinet_age.csv'):
    w = int(r['yearweek'][-2:])
    if w == 53:
        continue  # keep 52-week alignment across seasons
    i = sidx(w)
    if i <= 32:  # week 40 .. week 20
        cdc[r['season']][i] = float(r['age_0_4_ili_pct'])
cdc_out = {s: [v.get(i) for i in range(33)] for s, v in sorted(cdc.items())}

# Seasonal weight for the simulator: mean 0-4 ILI% by week over non-COVID seasons, all 52 weeks
USE = ['2019-20', '2022-23', '2023-24', '2024-25', '2025-26']
acc = collections.defaultdict(list)
for r in rows('cdc_ilinet_age.csv'):
    w = int(r['yearweek'][-2:])
    if r['season'] in USE and w <= 52:
        acc[w].append(float(r['age_0_4_ili_pct']))
weight = {w: sum(v) / len(v) for w, v in acc.items()}
weight_by_week = [round(weight[w], 3) for w in range(1, 53)]  # index 0 = epi week 1

# --- Israel weekly new inpatients, each season scaled to its own peak ---
isr = collections.defaultdict(lambda: {'rsv': [None] * 33, 'flu': [None] * 33, 'raw_rsv': [None] * 33, 'raw_flu': [None] * 33})
for r in rows('israel_hosp_weekly.csv'):
    i = sidx(int(r['epi_week']))
    if i > 32:
        continue
    for k, col in (('rsv', 'rsv_new_inpatients'), ('flu', 'flu_new_inpatients')):
        if r[col].strip():
            isr[r['season']]['raw_' + k][i] = int(float(r[col]))
for s, d in isr.items():
    for k in ('rsv', 'flu'):
        mx = max(x for x in d['raw_' + k] if x is not None)
        d[k] = [None if x is None else round(x / mx, 3) for x in d['raw_' + k]]
        d['peak_' + k] = mx

# --- Study figures used on the page (values as stated in cohort_figures.csv) ---
co = rows('cohort_figures.csv')
def get(study_part, metric_part, ages_part='', care_part=''):
    hits = [r for r in co if study_part in r['study'] and metric_part in r['metric']
            and ages_part in r['ages'] and care_part in r['care_type']]
    assert len(hits) >= 1, (study_part, metric_part, ages_part, care_part)
    return float(hits[0]['value'])

studies = {
    'eps_year2': get('Langer', 'year 2'),
    'dur_median': get('Langer', 'duration'),
    'share_days': get('Langer', 'share of child-days'),
    'p90_days': get('Toivonen', '90th percentile'),
    'halfyear_days': [[lab, get('Langer', 'symptom days in 6-month band', ages_part=a)] for lab, a in
                      [['0-6 חודשים', '0-6 mo'], ['7-12 חודשים', '7-12 mo'], ['13-18 חודשים', '13-18 mo'], ['19-24 חודשים', '19-24 mo']]],
    'eps_2y_care': get('Langer', 'ARI episodes over 2 years', care_part='childcare started 13'),
    'eps_2y_home': get('Langer', 'ARI episodes over 2 years', care_part='no childcare'),
    'start': {
        'centre_before': get('Schuez', 'before start', care_part='daycare centre'),
        'centre_peak': get('Schuez', '(peak)', care_part='daycare centre'),
        'family_before': get('Schuez', 'before start', care_part='family'),
        'family_peak': get('Schuez', '(peak)', care_part='family'),
    },
    'viruses': [
        ['רינו-וירוס (הצטננות)', get('Vesa', 'rhinovirus')],
        ['RSV', get('Vesa', ': RSV')],
        ['פארא-אינפלואנזה', get('Vesa', 'parainfluenza')],
        ['שפעת A', get('Vesa', 'influenza A')],
        ['אדנו-וירוס', get('Vesa', 'adenovirus')],
    ],
    'payback': {
        'ages': ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6'],
        'daycare': [get('de Hoog', 'URTI+AOM episodes', a + ' y', 'daycare entry') for a in ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6']],
        'home': [get('de Hoog', 'URTI+AOM episodes', a + ' y', 'home') for a in ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6']],
    },
}

out = {'cdc': cdc_out, 'weight_by_week': weight_by_week, 'israel': isr, 'studies': studies}
json.dump(out, open(os.path.join(os.path.dirname(__file__), 'data.json'), 'w', encoding='utf-8'), ensure_ascii=False)
print('cdc seasons', list(cdc_out))
print('israel', {s: (d['peak_rsv'], d['peak_flu']) for s, d in isr.items()})
print('studies', json.dumps(studies, ensure_ascii=False)[:400])
