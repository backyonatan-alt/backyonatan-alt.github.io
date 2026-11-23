# Do champions still take average shots once defender distance is counted?
# data/defender_distance.csv: NBA.com team shot dashboards, 2013-14 to 2025-26, regular season totals.
#   table: off = team's shots, def = opponents' shots, off10 / def10 = the same for shots from 10+ feet only.
#   defender_ft: closest defender 0-2, 2-4, 4-6, 6+ feet.
# Each shot falls in one of 12 types: defender distance (4) x (2-pointer under 10 ft, 2-pointer 10+ ft, 3-pointer).
# Expected points of a type = league average that season, leaving the team out.
# Models: A = shot type only, B = defender distance x 2pt/3pt, C = all 12 types.
import pathlib, pandas as pd, numpy as np
H=pathlib.Path(__file__).parent; d=pd.read_csv(H/'data/defender_distance.csv'); ch=pd.read_csv(H/'data/champions.csv')
ch['season']=ch.yr.astype(str)+'-'+((ch.yr+1)%100).astype(str).str.zfill(2); champ=ch.set_index('season').champion
K=['season','team','defender_ft']
def cells(al,far):
    m=d[d.table==al].merge(d[d.table==far],on=K,suffixes=('','_f')); out=[]
    for kind,pts,att in [('near2',2*(m.fg2m-m.fg2m_f),m.fg2a-m.fg2a_f),('far2',2*m.fg2m_f,m.fg2a_f),('three',3*m.fg3m,m.fg3a)]:
        x=m[K].copy(); x['kind']=kind; x['pts']=pts; x['att']=att; out.append(x)
    x=pd.concat(out); assert (x.att>=0).all() and (x.pts>=0).all(); return x
def score(x,model):
    x=x.copy(); x['cell']={'A':x.kind,'B':x.defender_ft+'|'+np.where(x.kind=='three','3','2'),'C':x.defender_ft+'|'+x.kind}[model]
    g=x.groupby(['season','team','cell'],as_index=False)[['pts','att']].sum(); t=g.groupby(['season','cell'])[['pts','att']].transform('sum')
    g['xp']=g.att*(t.pts-g.pts)/(t.att-g.att); s=g.groupby(['season','team'])[['pts','att','xp']].sum()
    return pd.DataFrame({'qual':s.xp/s.att,'make':(s.pts-s.xp)/s.att})
off=cells('off','off10'); deff=cells('def','def10'); print('team-seasons:',off.groupby(['season','team']).ngroups)
for model,name in [('A','A: shot type only'),('B','B: defender distance only'),('C','C: shot type and defender distance')]:
    o=score(off,model); f=score(deff,model)
    r=pd.DataFrame({'off_qual':o.qual.groupby('season').rank(ascending=False),'off_make':o.make.groupby('season').rank(ascending=False),
                    'def_qual':f.qual.groupby('season').rank(),'def_make':f.make.groupby('season').rank()}).astype(int)
    c=r.loc[[(s,champ[s]) for s in sorted(r.index.levels[0])]]
    print('\n== %s: 13 champions, rank among 30 =='%name); print('metric    median top5 top10 bottom_half')
    for k in c: print('%-9s %6.1f %4d %5d %11d'%(k,c[k].median(),(c[k]<=5).sum(),(c[k]<=10).sum(),(c[k]>15).sum()))
    if model=='C': print(c.reset_index().to_string(index=False))
lg=off[off.season=='2025-26'].groupby(['defender_ft','kind'])[['pts','att']].sum(); lg['pps']=(lg.pts/lg.att).round(2); lg['share%']=(100*lg.att/lg.att.sum()).round(1)
print('\n== league 2025-26: points per shot and share of shots by type =='); print(lg[['pps','share%']].to_string())
