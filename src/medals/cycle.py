exec(open('analyze.py').read().split('# report')[0])
import collections,statistics as st
CYC={2012:range(2009,2013),2016:range(2013,2017),2021:range(2017,2021),2024:range(2021,2025)}
NAT={'ROC':'RUS','RPC':'RUS'}
def nat(n): return NAT.get(n,n)
rowsN=[];rowsA=[]
for cls in ['windsurf','laser']:
  for g in 'MW':
    for G,yrs in CYC.items():
        wr=[r for r in R if r['event']=='worlds' and r['cls']==cls and r['gender']==g and r['year'] in yrs]
        have=sorted({r['year'] for r in wr})
        if not have: continue
        oly=[r for r in R if r['event']=='olympics' and r['cls']==cls and r['gender']==g and r['year']==G]
        # nation strength: top10 finishes per Worlds, distinct sailors
        t10=collections.Counter(); t3=collections.Counter(); sail=collections.defaultdict(set)
        for w in wr:
            if w['rank']<=10: t10[nat(w['nation'])]+=1; sail[nat(w['nation'])].add(w['k'])
            if w['rank']<=3: t3[nat(w['nation'])]+=1
        for o in oly:
            n=nat(o['nation'])
            rowsN.append(dict(cls=cls,g=g,G=G,nation=n,t10=t10[n]/len(have),t3=t3[n],years=len(have),place=o['rank'],med=o['rank']<=3,name=o['name']))
            # athlete consistency
            mine=[w for w in wr if same(w['k'],o['k'])]
            yrs_t10=len({w['year'] for w in mine if w['rank']<=10})
            best=min([w['rank'] for w in mine] or [99])
            rowsA.append(dict(cls=cls,g=g,G=G,name=o['name'],nation=n,frac=yrs_t10/len(have),n10=yrs_t10,years=len(have),best=best,place=o['rank'],med=o['rank']<=3,teamt10=t10[n]/len(have)))
def rate(s): return f"{sum(x['med'] for x in s)}/{len(s)} ({sum(x['med'] for x in s)/len(s):.0%})" if s else '-'
for cls in ['windsurf','laser']:
    N=[r for r in rowsN if r['cls']==cls]; A=[r for r in rowsA if r['cls']==cls]
    print(f"\n######## {cls}  (Games 2012-2024, nation-games starters: {len(N)})")
    print(" TEAM: avg number of nation's sailors in Worlds top 10, per Worlds, over the 4-year cycle")
    for lab,f in [('0',lambda v:v==0),('>0 to <1',lambda v:0<v<1),('1 to <2',lambda v:1<=v<2),('2+',lambda v:v>=2)]:
        s=[r for r in N if f(r['t10'])]; print(f"   {lab:10} medal {rate(s)}  median place {st.median([r['place'] for r in s]) if s else '-'}")
    print(" ATHLETE: share of cycle Worlds where the Olympian was top 10")
    for lab,f in [('never',lambda v:v==0),('some (<50%)',lambda v:0<v<.5),('half+',lambda v:.5<=v<1),('every one',lambda v:v==1)]:
        s=[r for r in A if f(r['frac'])]; print(f"   {lab:12} medal {rate(s)}  median place {st.median([r['place'] for r in s]) if s else '-'}")
    print(" PEAK vs CONSISTENCY among Olympians whose best cycle finish was top 3:")
    for lab,f in [('top10 in <half the Worlds',lambda r:r['frac']<.5),('top10 in half+',lambda r:r['frac']>=.5)]:
        s=[r for r in A if r['best']<=3 and f(r)]; print(f"   {lab:26} medal {rate(s)}")
    print(" ATHLETE consistent (half+) x TEAM deep (>=1.5 per Worlds):")
    for la,fa in [('consistent',lambda r:r['frac']>=.5),('not',lambda r:r['frac']<.5)]:
        for lt,ft in [('deep team',lambda r:r['teamt10']>=1.5),('thin team',lambda r:r['teamt10']<1.5)]:
            s=[r for r in A if fa(r) and ft(r)]; print(f"   {la:10} {lt:10} medal {rate(s)}")
    meds=[r for r in A if r['med']]
    print(f" Olympic medalists: {len(meds)}; top10 in half+ of cycle Worlds: {sum(r['frac']>=.5 for r in meds)}; never top10: {sum(r['frac']==0 for r in meds)}")
    print("   never-top10 medalists:",'; '.join(f"{r['G']}{r['g']} {r['name']} {r['nation']} place {r['place']}" for r in meds if r['frac']==0))
import json; json.dump({'N':rowsN,'A':rowsA},open('cycle.json','w'),default=str)
