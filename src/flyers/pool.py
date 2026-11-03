import json,collections,math
import numpy as np
S={2022:'2021-22',2023:'2022-23',2024:'2023-24',2025:'2024-25'}
rows=[]
for y in S:
    T=json.load(open(f'nba_schedule_{y}_travel.json'))
    seen=set()
    for r in T['rows']:
        k=(r['d'][:10],r['team'],r['opp'])
        if k in seen: continue
        seen.add(k);r['season']=y;rows.append(r)
    print(y,'team-games',sum(1 for r in rows if r['season']==y),'miles avg',round(sum(s['miles'] for s in T['stats'].values())/30))
done=[r for r in rows if r['win'] is not None]
print('pooled team-games',len(done))
def wp(sel,label):
    s=[g for g in done if sel(g)];w=100*sum(g['win'] for g in s)/len(s);print(f"{label:34} n={len(s):5} win%={w:.1f}");return w
print('\nRAW, road games, four seasons pooled')
for lab,f in [('rest 0',lambda g:g['rest']==0),('rest 1',lambda g:g['rest']==1),('rest 2+',lambda g:g['rest']>=2),('dist <300',lambda g:g['dist']<300),('dist 300-1000',lambda g:300<=g['dist']<1000),('dist 1000+',lambda g:g['dist']>=1000),('tz 0',lambda g:g['dtz']==0),('tz 1',lambda g:g['dtz']==1),('tz 2+',lambda g:g['dtz']>=2)]:
    wp(lambda g,f=f:not g['home'] and f(g),lab)
# per season rest effect
print('\nrest gap per season (road, 2+ rest minus 0 rest)')
for y in S:
    a=[g for g in done if g['season']==y and not g['home'] and g['rest']==0];b=[g for g in done if g['season']==y and not g['home'] and g['rest']>=2]
    print(S[y],f"b2b {100*sum(g['win'] for g in a)/len(a):.1f} (n={len(a)})  2+ rest {100*sum(g['win'] for g in b)/len(b):.1f} (n={len(b)})")
# team-season strength = win% in all OTHER games
ts=collections.defaultdict(list)
for g in done: ts[(g['season'],g['team'])].append(g['win'])
def strength(season,team,excl):
    w=ts[(season,team)];return (sum(w)-excl)/(len(w)-1)
# logistic regression: win ~ home + str_team + str_opp + rest0 + rest2 + dist(1000mi) + tz
X=[];Y=[]
for g in done:
    st=strength(g['season'],g['team'],g['win']);so=strength(g['season'],g['opp'],None) if False else None
    # opponent strength: need opp game win in this game = 1-win
    so=(sum(ts[(g['season'],g['opp'])])-(1-g['win']))/(len(ts[(g['season'],g['opp'])])-1)
    X.append([1,1 if g['home'] else 0,st-.5,so-.5,1 if g['rest']==0 else 0,1 if g['rest']>=2 else 0,g['dist']/1000,g['dtz']]);Y.append(g['win'])
X=np.array(X,float);Y=np.array(Y,float)
b=np.zeros(X.shape[1])
for it in range(25):
    p=1/(1+np.exp(-X@b));W=p*(1-p);H=X.T@(X*W[:,None])+1e-6*np.eye(len(b));b=b+np.linalg.solve(H,X.T@(Y-p))
p=1/(1+np.exp(-X@b));W=p*(1-p);H=X.T@(X*W[:,None]);se=np.sqrt(np.diag(np.linalg.inv(H)))
names=['intercept','home','own strength','opp strength','back-to-back (0 rest)','2+ days rest','distance per 1000 mi','time zones crossed']
print('\nLOGISTIC MODEL, all games, n=',len(Y))
for n,c,s in zip(names,b,se):print(f"{n:24} coef {c:+.3f}  se {s:.3f}  z {c/s:+.1f}")
# effect in win% terms at a 50/50 baseline
print('\nwin% effect at 50/50 baseline:')
for n,c in zip(names[4:],b[4:]):print(f"  {n:24} {100*(1/(1+math.exp(-c))-.5):+.1f} pts (per unit)")
