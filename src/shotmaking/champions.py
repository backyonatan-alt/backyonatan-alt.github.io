# What do champions look like in shooting data, and can it spot them early?
# off_make / off_qual: own shot making and shot quality. def_*: the same for opponents, sign flipped (higher = better defence).
# net_pps: own field-goal points per shot minus opponents'. fg_margin: field-goal points margin per game.
# winpct, ptdiff: plain record and real point differential (from data/scores.csv).
# Ranks are within the season, 1 = best. Ties get the worst rank of the tie.
import pathlib, pandas as pd, numpy as np
H=pathlib.Path(__file__).parent; g=pd.read_csv(H/'data/team_games.csv'); s=pd.read_csv(H/'data/scores.csv'); ch=pd.read_csv(H/'data/champions.csv').set_index('yr').champion
m=g.merge(s,on=['GAME_ID','TEAM_ID'],how='left'); print('team-games %d, with final score %.2f%% (missing: %s)'%(len(m),100*m.pf.notna().mean(),m[m.pf.isna()].groupby('yr').size().to_dict()))
o=m.merge(g[['GAME_ID','TEAM_ID','pts','xp','fga']],on='GAME_ID',suffixes=('','_d')); o=o[o.TEAM_ID!=o.TEAM_ID_d]; assert len(o)==len(g)
o['win']=np.where(o.pf.isna(),np.nan,(o.pf>o.pa).astype(float)); o['diff']=o.pf-o.pa
M=['off_make','off_qual','def_make','def_qual','net_make','net_qual','net_pps','fg_margin','winpct','ptdiff']
def table(o):
    t=o.groupby(['yr','TEAM_NAME']).agg(pts=('pts','sum'),xp=('xp','sum'),fga=('fga','sum'),ptsd=('pts_d','sum'),xpd=('xp_d','sum'),fgad=('fga_d','sum'),gp=('GAME_ID','size'),winpct=('win','mean'),ptdiff=('diff','mean')).reset_index()
    t['off_make']=(t.pts-t.xp)/t.fga; t['off_qual']=t.xp/t.fga; t['def_make']=-(t.ptsd-t.xpd)/t.fgad; t['def_qual']=-t.xpd/t.fgad
    t['net_make']=t.off_make+t.def_make; t['net_qual']=t.off_qual+t.def_qual; t['net_pps']=t.pts/t.fga-t.ptsd/t.fgad; t['fg_margin']=(t.pts-t.ptsd)/t.gp
    t['champ']=t.TEAM_NAME==t.yr.map(ch); assert t.champ.sum()==30
    for k in M: t['r_'+k]=t.groupby('yr')[k].rank(ascending=False,method='max')
    return t
for N,name in [(10,'AFTER 10 GAMES'),(20,'AFTER 20 GAMES'),(41,'AFTER 41 GAMES'),(999,'FULL SEASON')]:
    t=table(o[o.n<=N]); c=t[t.champ]; print('\n== %s: where the 30 champions ranked =='%name); print('metric     median  #1 top3 top5 top10')
    for k in M:
        r=c['r_'+k]; print('%-10s %6.1f %3d %4d %4d %5d'%(k,r.median(),(r==1).sum(),(r<=3).sum(),(r<=5).sum(),(r<=10).sum()))
    if N==999:
        print('champions in the bottom half (rank 16+): off_qual %d, off_make %d, def_qual %d, def_make %d'%tuple((c['r_'+k]>15).sum() for k in ['off_qual','off_make','def_qual','def_make']))
        print('champions top 5 in both off_qual and off_make: %d; top 10 in both: %d'%(((c.r_off_qual<=5)&(c.r_off_make<=5)).sum(),((c.r_off_qual<=10)&(c.r_off_make<=10)).sum()))
        print(c[['yr','TEAM_NAME']+['r_'+k for k in ['off_make','off_qual','def_make','def_qual','net_pps','winpct']]].astype({('r_'+k):int for k in ['off_make','off_qual','def_make','def_qual','net_pps','winpct']}).to_string(index=False))
    if N==20: print(c[['yr','TEAM_NAME','r_winpct','r_ptdiff','r_net_pps']].astype({'r_winpct':int,'r_ptdiff':int,'r_net_pps':int}).to_string(index=False))
