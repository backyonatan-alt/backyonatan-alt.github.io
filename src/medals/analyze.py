import csv,unicodedata,re,collections,sys
def norm(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
    s=re.sub(r'[^a-z ]',' ',s.replace('-',' '))
    k=' '.join(sorted(t for t in s.split() if len(t)>1))
    return SAMEP.get(k,k)
SAMEP={'cho won woo':'cho won','gintare volungeviciute':'gintare scheidt'}
R=[]
for fn in ['olympics','worlds_windsurf_M','worlds_windsurf_W','worlds_laser']:
    for r in csv.DictReader(open('data/'+fn+'.csv')):
        if not r['rank'].strip().isdigit(): continue
        r['rank']=int(r['rank']); r['year']=int(r['year']); r['k']=norm(r['name']); R.append(r)
GAMES={2008:(2007,2008),2012:(2011,2012),2016:(2015,2016),2021:(2019,2020),2024:(2023,2024)}
from difflib import SequenceMatcher as SM
ALIAS={'byron':'vyron','olga':'olha','jp':'jon','mashiach':'mashiah','rijsselberge':'rijsselberghe','piccon':'picon','elfutina':'yelfutina'}
def toks(k): return [ALIAS.get(t,t) for t in k.split()]
def same(a,b):
    if a==b: return True
    A,B=toks(a),toks(b)
    for x in A:
        for y in B:
            if len(x)>=4 and len(y)>=4 and (SM(None,x,y).ratio()>=0.85 or x.startswith(y) or y.startswith(x)):
                ra=[t for t in A if t!=x]; rb=[t for t in B if t!=y]
                if not ra or not rb or any(p[0]==q[0] for p in ra for q in rb): return True
    return False
def key_match_n(k,nat,oly):
    for kk,r in oly.items():
        if same(k,kk) and (r['nation']==nat or {r['nation'],nat}<={'RUS','ROC','RPC'}): return kk
    for kk,r in oly.items():
        if same(k,kk): return kk
    return None
def key_match(k,keys):
    if k in keys: return k
    a=set(k.split())
    for kk in keys:
        b=set(kk.split())
        if len(a&b)>=2 or (len(a&b)==1 and min(len(a),len(b))==1): return kk
        # surname + first name prefix
    return None
out=[]
for cls in ['windsurf','laser']:
  for g in ['M','W']:
    for G,win in GAMES.items():
        oly={r['k']:r for r in R if r['event']=='olympics' and r['cls']==cls and r['gender']==g and r['year']==G}
        if not oly: continue
        wr=[r for r in R if r['event']=='worlds' and r['cls']==cls and r['gender']==g and r['year'] in win]
        have=sorted({r['year'] for r in wr})
        best={}
        for r in wr:
            if r['rank']<=20:
                kk=next((b for b,v in best.items() if v[2]==r['nation'] and same(b,r['k'])),r['k'])
                if kk not in best or r['rank']<best[kk][0]: best[kk]=(r['rank'],r['name'],r['nation'])
        olynat=collections.defaultdict(list)
        for r in oly.values(): olynat[r['nation']].append(r['name'])
        rows=[]
        for k,(br,name,nat) in sorted(best.items(),key=lambda x:x[1][0]):
            m=key_match_n(k,nat,oly)
            o=oly[m]['rank'] if m else None
            blocked = (not m) and nat in olynat
            rows.append((br,name,nat,o,blocked,olynat.get(nat,[])))
        out.append((cls,g,G,have,rows,{r['k']:r for r in oly.values()}))
# report
for cls,g,G,have,rows,oly in out:
    top3=[r for r in rows if r[0]<=3]; top10=[r for r in rows if r[0]<=10]
    med=[r for r in top3 if r[3] and r[3]<=3]
    went=[r for r in top10 if r[3]]
    miss=[r for r in top10 if not r[3]]
    blk=[r for r in miss if r[4]]
    # olympic medalists: where were they at worlds
    print(f"\n{cls} {g} {G}  worlds used {have}")
    print(f"  worlds medalists(best<=3): {len(top3)}; at Games: {sum(1 for r in top3 if r[3])}; medalled: {len(med)}")
    print(f"  worlds top10: {len(top10)}; at Games: {len(went)}; missing: {len(miss)} (nation had another sailor there: {len(blk)})")
    for r in miss: print('     missing:',r[0],r[1],r[2],'| nation sent:',', '.join(r[5]) or '-')
    for r in top3: print('     fav:',r[0],r[1],r[2],'-> OG',r[3])

print("\n=== Olympic medalists: best Worlds rank in window (None = outside top 20 or no data)")
for cls,g,G,have,rows,oly in out:
    if not have: continue
    wr=[r for r in R if r['event']=='worlds' and r['cls']==cls and r['gender']==g and r['year'] in GAMES[G]]
    meds=sorted([r for r in oly.values() if r['rank']<=3],key=lambda r:r['rank'])
    s=[]
    for m in meds:
        br=min([w['rank'] for w in wr if same(w['k'],m['k']) and (w['nation']==m['nation'] or True)] or [None],key=lambda x:999 if x is None else x)
        s.append(f"{m['rank']}:{m['name']}({br})")
    print(cls,g,G,'; '.join(s))
