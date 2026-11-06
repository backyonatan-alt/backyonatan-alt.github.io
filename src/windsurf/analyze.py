import csv,collections,glob,statistics as st
rows=[]
for f in ['olympics','worlds','europeans','youth']:
    try:
        for r in csv.DictReader(open(f'data/{f}.csv',encoding='utf8')):
            r['src']=f;rows.append(r)
    except FileNotFoundError: pass
def num(x):
    try:return int(str(x).strip())
    except:return None
for r in rows:
    r['y']=num(r['year']);r['pos']=num(r['position']);r['n']=num(r['field_size'])
    r['era']='Mistral' if r['class'] in ('Mistral','Lechner A-390') else ('RS:X' if r['class']=='RS:X' else ('iQFOiL' if r['class']=='iQFOiL' else r['class']))
senior=[r for r in rows if r['age_category']=='senior' and r['competition'] in ('Olympics','World Championship','European Championship') and r['pos']]
print('senior rows with position',len(senior))
def cycle(y):return f"{(y-1)//4*4+1}-{(y-1)//4*4+4}"
# per cycle x gender x competition
comp_short={'Olympics':'OG','World Championship':'WC','European Championship':'EC'}
print('\n=== per 4-year cycle, senior, Worlds+Europeans+Olympics ===')
print('cycle      gender  results  athletes  medals  top5  top10  top20  distinct-athletes-top10')
for g in 'MW':
    for cy in sorted(set(cycle(r['y']) for r in senior)):
        s=[r for r in senior if r['gender']==g and cycle(r['y'])==cy]
        if not s:continue
        ath=set(r['athlete'] for r in s)
        print(f"{cy:10} {g}      {len(s):5}    {len(ath):5}     {sum(r['pos']<=3 for r in s):3}   {sum(r['pos']<=5 for r in s):3}   {sum(r['pos']<=10 for r in s):3}    {sum(r['pos']<=20 for r in s):3}     {len(set(r['athlete'] for r in s if r['pos']<=10)):3}")
print('\n=== Worlds only: per year, Israelis in fleet / best / top10 count / field ===')
for g in 'MW':
    print('--',g)
    for y in range(1992,2027):
        s=[r for r in senior if r['gender']==g and r['competition']=='World Championship' and r['y']==y]
        if not s:continue
        n=s[0]['n'] or ''
        print(y,s[0]['era'][:3],f"israelis={len(s):2} best={min(r['pos'] for r in s):3} top10={sum(r['pos']<=10 for r in s)} top20={sum(r['pos']<=20 for r in s)} field={n}", ' '.join(f"{r['athlete'].split()[-1]}:{r['pos']}" for r in sorted(s,key=lambda r:r['pos'])[:5]))
print('\n=== medals by era (OG+WC+EC senior) ===')
for g in 'MW':
    for era in ('Mistral','RS:X','iQFOiL'):
        s=[r for r in senior if r['gender']==g and r['era']==era]
        yrs=len(set(r['y'] for r in s))
        print(g,era,f"years-with-data={yrs} results={len(s)} medals={sum(r['pos']<=3 for r in s)} gold={sum(r['pos']==1 for r in s)} top10={sum(r['pos']<=10 for r in s)} athletes-with-top10={len(set(r['athlete'] for r in s if r['pos']<=10))} athletes={len(set(r['athlete'] for r in s))}")
print('\n=== coverage ===')
for f in glob.glob('data/coverage_*.csv'):
    c=collections.Counter(r['status'] for r in csv.DictReader(open(f,encoding='utf8')));print(f,dict(c))
