exec(open('analyze.py').read().split('# report')[0])
import statistics as st
def spearman(x,y):
    def rk(v):
        s=sorted(range(len(v)),key=lambda i:v[i]); r=[0]*len(v); i=0
        while i<len(s):
            j=i
            while j+1<len(s) and v[s[j+1]]==v[s[i]]: j+=1
            for k in range(i,j+1): r[s[k]]=(i+j)/2
            i=j+1
        return r
    a,b=rk(x),rk(y); ma,mb=st.mean(a),st.mean(b)
    return sum((p-ma)*(q-mb) for p,q in zip(a,b))/(sum((p-ma)**2 for p in a)*sum((q-mb)**2 for q in b))**.5
B=[(1,1,'1st'),(2,3,'2-3'),(4,5,'4-5'),(6,10,'6-10'),(11,20,'11-20'),(21,99,'not top 20')]
for cls in ['windsurf','laser']:
    P=[]  # per Olympic participant: best worlds rank (21 if none), olympic rank, field size
    D=[]  # nation depth
    for G,win in GAMES.items():
      for g in ['M','W']:
        wr=[r for r in R if r['event']=='worlds' and r['cls']==cls and r['gender']==g and r['year'] in win]
        if not wr: continue
        oly=[r for r in R if r['event']=='olympics' and r['cls']==cls and r['gender']==g and r['year']==G]
        n=len(oly)
        best={}
        for w in wr:
            if w['rank']<=20:
                kk=next((b for b,v in best.items() if v[2]==w['nation'] and same(b,w['k'])),w['k'])
                if kk not in best or w['rank']<best[kk][0]: best[kk]=(w['rank'],w['name'],w['nation'])
        for o in oly:
            br=min([v[0] for k,v in best.items() if same(k,o['k'])] or [21])
            P.append((br,o['rank'],n,G,g,o['name'],o['nation']))
            depth=len({k for k,v in best.items() if v[2]==o['nation'] and v[0]<=10})
            D.append((depth,br,o['rank'],G,g,o['name'],o['nation']))
    print(f"\n##### {cls}: {len(P)} Olympic starters with Worlds data")
    print(" best Worlds rank | starters | Olympic medal | top 5 | median Olympic place")
    for lo,hi,lab in B:
        s=[p for p in P if lo<=p[0]<=hi]
        if s: print(f" {lab:>10} | {len(s):3} | {sum(p[1]<=3 for p in s):2} ({sum(p[1]<=3 for p in s)/len(s):4.0%}) | {sum(p[1]<=5 for p in s)/len(s):4.0%} | {st.median(p[1] for p in s)}")
    meds=[p for p in P if p[1]<=3]
    print(f" Olympic medals: {len(meds)}; won by Worlds top3: {sum(p[0]<=3 for p in meds)}, top10: {sum(p[0]<=10 for p in meds)}, outside top10/none: {sum(p[0]>10 for p in meds)}")
    print(f" Spearman Worlds best rank vs Olympic rank (all starters, non-top20=21): {spearman([p[0] for p in P],[p[1] for p in P]):.2f}")
    t=[p for p in P if p[0]<=20]
    print(f" Spearman among those with Worlds top 20: {spearman([p[0] for p in t],[p[1] for p in t]):.2f} (n={len(t)})")
    print(" Depth: nation's sailors in Worlds top 10 (sent sailor was top 10 him/herself)")
    for lab,f in [('1 (only one)',lambda d:d==1),('2+',lambda d:d>=2)]:
        s=[d for d in D if f(d[0]) and d[1]<=10]
        if s: print(f"   {lab}: {len(s)} starters, medal {sum(d[2]<=3 for d in s)} ({sum(d[2]<=3 for d in s)/len(s):.0%}), median place {st.median(d[2] for d in s)}")
    s=[d for d in D if d[0]>=2]
    print("   2+ cases:",'; '.join(f"{d[3]}{d[4]} {d[6]} {d[5]} W{d[1]}->OG{d[2]}" for d in s))
