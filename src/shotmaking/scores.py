# raw/nbastatsv3_<year>.csv (play-by-play)  ->  data/scores.csv
# Final score per team per regular-season game: pf = points for, pa = points against.
import glob, pathlib, pandas as pd
H=pathlib.Path(__file__).parent; out=[]
for f in sorted(glob.glob(str(H/'raw/nbastatsv3_[12]*.csv'))):
    d=pd.read_csv(f,usecols=['gameId','teamId','location','scoreHome','scoreAway'],low_memory=False)
    sc=d.groupby('gameId')[['scoreHome','scoreAway']].max()
    tm=d[d.teamId>0].groupby(['gameId','location']).teamId.agg(lambda s:s.mode().iloc[0]).unstack()
    j=sc.join(tm).dropna()
    out.append(pd.DataFrame({'GAME_ID':j.index,'TEAM_ID':j['h'].astype(int),'pf':j.scoreHome.astype(int),'pa':j.scoreAway.astype(int)}))
    out.append(pd.DataFrame({'GAME_ID':j.index,'TEAM_ID':j['v'].astype(int),'pf':j.scoreAway.astype(int),'pa':j.scoreHome.astype(int)}))
    print(f[-8:-4],len(j),'games')
pd.concat(out).drop_duplicates(['GAME_ID','TEAM_ID']).to_csv(H/'data/scores.csv',index=False)
