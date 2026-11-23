# Sanity check for data/champions.csv: prints the two teams in the last playoff game of each season.
import glob, pathlib, pandas as pd
H=pathlib.Path(__file__).parent
for f in sorted(glob.glob(str(H/'raw/shotdetail_po_*.csv'))):
    d=pd.read_csv(f,usecols=['GAME_DATE','TEAM_NAME']); last=d[d.GAME_DATE==d.GAME_DATE.max()]
    print(f[-8:-4],d.GAME_DATE.max(),sorted(last.TEAM_NAME.unique()))
