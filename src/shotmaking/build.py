# raw/shotdetail_<year>.csv  ->  data/team_games.csv
# One row per team per regular-season game: field-goal points scored (pts),
# expected points from shot location (xp) and attempts (fga).
# Expected points for a shot = that season's league average for the same NBA.com zone
# (basic zone x area x range), leaving the shooting team out of the average.
# Backcourt heaves are dropped. Free throws are not in this data.
import glob, pathlib, pandas as pd, numpy as np
H=pathlib.Path(__file__).parent; out=[]
for f in sorted(glob.glob(str(H/'raw/shotdetail_[12]*.csv'))):
    d=pd.read_csv(f); yr=int(f[-8:-4])
    d=d[d.SHOT_ZONE_BASIC!='Backcourt'].copy()
    d['pts']=d.SHOT_MADE_FLAG*np.where(d.SHOT_TYPE.str.startswith('3'),3,2)
    d['cell']=d.SHOT_ZONE_BASIC+'|'+d.SHOT_ZONE_AREA+'|'+d.SHOT_ZONE_RANGE
    c=d.groupby('cell').pts.agg(['sum','size']); tc=d.groupby(['cell','TEAM_ID']).pts.agg(['sum','size'])
    d=d.join(c,on='cell').join(tc,on=['cell','TEAM_ID'],rsuffix='_t')
    d['xp']=(d['sum']-d['sum_t'])/(d['size']-d['size_t'])
    g=d.groupby(['TEAM_ID','TEAM_NAME','GAME_ID']).agg(date=('GAME_DATE','first'),pts=('pts','sum'),xp=('xp','sum'),fga=('pts','size')).reset_index()
    g=g.sort_values(['date','GAME_ID']); g['n']=g.groupby('TEAM_ID').cumcount()+1; g['yr']=yr   # n = team's game number, yr = season start year
    out.append(g); print(yr,len(d),'shots',g.GAME_ID.nunique(),'games')
t=pd.concat(out); t['xp']=t.xp.round(3); t.to_csv(H/'data/team_games.csv',index=False)
