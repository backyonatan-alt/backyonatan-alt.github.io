# How much of a team's early shooting gap survives the rest of the season?
# make = field-goal points per shot above expected (from shot location).
# qual = expected points per shot (where the team shoots from).
# Both are centred on the league average of the same season and the same part of the season.
import pathlib, pandas as pd, numpy as np
H=pathlib.Path(__file__).parent; g=pd.read_csv(H/'data/team_games.csv'); rng=np.random.default_rng(7)
g['ts']=g.yr.astype(str)+'_'+g.TEAM_ID.astype(str); names=g.drop_duplicates('ts').set_index('ts').TEAM_NAME
def split(mask):
    a=g[mask].groupby('ts')[['pts','xp','fga']].sum(); b=g[~mask].groupby('ts')[['pts','xp','fga']].sum()
    w=pd.DataFrame({'e_make':(a.pts-a.xp)/a.fga,'r_make':(b.pts-b.xp)/b.fga,'e_qual':a.xp/a.fga,'r_qual':b.xp/b.fga}).dropna()
    w['yr']=[int(i.split('_')[0]) for i in w.index]
    for c in w.columns[:4]: w[c]-=w.groupby('yr')[c].transform('mean')
    return w
def stats(w,q=.1):
    t=w[w.e_make>=w.e_make.quantile(1-q)]; b=w[w.e_make<=w.e_make.quantile(q)]
    return dict(r=w.e_make.corr(w.r_make),slope=np.polyfit(w.e_make,w.r_make,1)[0],r_qual=w.e_qual.corr(w.r_qual),
                hot_keep=t.r_make.mean()/t.e_make.mean(),cold_keep=b.r_make.mean()/b.e_make.mean())
def show(name,w):
    s=stats(w); bs=np.array([[x['hot_keep'],x['cold_keep']] for x in (stats(w.sample(len(w),replace=True,random_state=int(rng.integers(1e9)))) for _ in range(2000))])
    d=bs[:,0]-bs[:,1]; ci=lambda v:'%.2f to %.2f'%(np.percentile(v,2.5),np.percentile(v,97.5))
    print('%-16s n=%d  r=%.2f slope=%.2f  quality r=%.2f | hottest 10%% keep %.2f (%s)  coldest 10%% keep %.2f (%s)  diff %s'%(name,len(w),s['r'],s['slope'],s['r_qual'],s['hot_keep'],ci(bs[:,0]),s['cold_keep'],ci(bs[:,1]),ci(d)))
print('== FIRST 20 GAMES vs REST OF SEASON =='); w=split(g.n<=20)
show('all seasons',w); show('1996-2003',w[w.yr<2004]); show('2004-2015',w[(w.yr>=2004)&(w.yr<2016)]); show('2016-2025',w[w.yr>=2016])
w['q']=pd.qcut(w.e_make,5,labels=['coldest','cold','middle','hot','hottest']); print('\nby fifths (early gap -> rest gap)'); print(w.groupby('q',observed=True)[['e_make','r_make']].mean().round(3).to_string())
big=w[w.e_make.abs()>=0.05]; print('\ngap of 0.05+ pts/shot after 20 games: %d of %d team-seasons; same side for the rest: %.0f%%'%(len(big),len(w),100*(np.sign(big.e_make)==np.sign(big.r_make)).mean()))
print('field-goal attempts per team game: %.1f'%g.fga.mean())
o=w.sort_values('e_make'); x=pd.concat([o.head(5),o.tail(5)])[['e_make','r_make']].round(3); x.insert(0,'team',names.loc[x.index]); print('\ncoldest and hottest starts'); print(x.to_string())
print('\n== PLACEBO: 20 random games vs the rest (300 draws) =='); res=[]
for i in range(300):
    m=g.groupby('ts').n.transform(lambda s: rng.permutation(len(s))<20).astype(bool); res.append(stats(split(m)))
p=pd.DataFrame(res); s=stats(w); print('mean:',p.mean().round(3).to_dict()); print('sd:  ',p.std().round(3).to_dict())
print('actual hot-cold diff %.3f; share of placebo draws with a diff that large: %.3f'%(s['hot_keep']-s['cold_keep'],((p.hot_keep-p.cold_keep)>=s['hot_keep']-s['cold_keep']).mean()))
print('\n== HOW FAST IT SETTLES: first N games vs the rest =='); print(' N  make_slope make_r  qual_slope qual_r')
for N in [3,5,10,15,20,30,41]:
    v=split(g.n<=N); print('%2d %10.2f %6.2f %11.2f %6.2f'%(N,np.polyfit(v.e_make,v.r_make,1)[0],v.e_make.corr(v.r_make),np.polyfit(v.e_qual,v.r_qual,1)[0],v.e_qual.corr(v.r_qual)))
