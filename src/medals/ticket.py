exec(open('analyze.py').read().split('# report')[0])
MED={}
for cls in ["windsurf","laser"]:
    tot=best_sent=0; cases=[]
    for G,win in GAMES.items():
      for g in 'MW':
        wr=[r for r in R if r['event']=='worlds' and r['cls']==cls and r['gender']==g and r['year'] in win]
        if not wr: continue
        oly=[r for r in R if r['event']=='olympics' and r['cls']==cls and r['gender']==g and r['year']==G]
        best={}
        for w in wr:
            if w['rank']<=20:
                kk=next((b for b,v in best.items() if v[2]==w['nation'] and same(b,w['k'])),w['k'])
                if kk not in best or w['rank']<best[kk][0]: best[kk]=(w['rank'],w['name'],w['nation'])
        for o in oly:
            mine=[(v[0],v[1]) for k,v in best.items() if v[2]==o['nation'] and v[0]<=10]
            if len(mine)<2 and not (len(mine)==1 and not any(same(k,o['k']) for k,v in best.items() if v[2]==o['nation'])): continue
            ob=min([v[0] for k,v in best.items() if same(k,o['k'])] or [21])
            top=min(m[0] for m in mine)
            tot+=1; ok= ob==top; best_sent+=ok; MED.setdefault(cls,[]).append((ok,o["rank"]<=3))
            if not ok: cases.append(f"{G}{g} {o['nation']} sent {o['name']}(W{ob})->OG{o['rank']}; best was {min(mine)[1]}(W{top})")
    print(cls,f"nations with a top-10 alternative: {tot}; sent their best Worlds finisher: {best_sent} ({best_sent/tot:.0%})")
    for c in cases: print('  ',c)
for c,v in MED.items(): print(c,"best sent medals",sum(m for o,m in v if o),"/",sum(o for o,m in v),"| other sent medals",sum(m for o,m in v if not o),"/",sum(not o for o,m in v))
