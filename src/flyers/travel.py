import csv,collections,math,json,sys
from datetime import datetime,timedelta
CITY={ # lat, lon, UTC offset (standard time)
'Atlanta':(33.757,-84.396,-5),'Boston':(42.366,-71.062,-5),'Brooklyn':(40.683,-73.975,-5),'Charlotte':(35.225,-80.839,-5),'Chicago':(41.881,-87.674,-6),
'Cleveland':(41.497,-81.688,-5),'Dallas':(32.790,-96.810,-6),'Denver':(39.749,-105.008,-7),'Detroit':(42.341,-83.055,-5),'San Francisco':(37.768,-122.388,-8),
'Houston':(29.751,-95.362,-6),'Indianapolis':(39.764,-86.156,-5),'Inglewood':(33.945,-118.342,-8),'Los Angeles':(34.043,-118.267,-8),'Memphis':(35.138,-90.051,-6),
'Miami':(25.781,-80.187,-5),'Milwaukee':(43.045,-87.917,-6),'Minneapolis':(44.979,-93.276,-6),'New Orleans':(29.949,-90.082,-6),'New York':(40.751,-73.994,-5),
'Oklahoma City':(35.463,-97.515,-6),'Orlando':(28.539,-81.384,-5),'Philadelphia':(39.901,-75.172,-5),'Phoenix':(33.446,-112.071,-7),'Portland':(45.532,-122.667,-8),
'Sacramento':(38.580,-121.500,-8),'San Antonio':(29.427,-98.438,-6),'Toronto':(43.643,-79.379,-5),'Salt Lake City':(40.768,-111.901,-7),'Washington':(38.898,-77.021,-5),
'Las Vegas':(36.091,-115.178,-8),'Austin':(30.288,-97.733,-6),'Paris':(48.839,2.379,1),'Mexico City':(19.405,-99.173,-6)}
HOME={'ATL':'Atlanta','BOS':'Boston','BKN':'Brooklyn','CHA':'Charlotte','CHI':'Chicago','CLE':'Cleveland','DAL':'Dallas','DEN':'Denver','DET':'Detroit','GS':'San Francisco','HOU':'Houston','IND':'Indianapolis','LAC':'Inglewood','LAL':'Los Angeles','MEM':'Memphis','MIA':'Miami','MIL':'Milwaukee','MIN':'Minneapolis','NO':'New Orleans','NY':'New York','OKC':'Oklahoma City','ORL':'Orlando','PHI':'Philadelphia','PHX':'Phoenix','POR':'Portland','SAC':'Sacramento','SA':'San Antonio','TOR':'Toronto','UTAH':'Salt Lake City','WSH':'Washington'}
def hav(a,b):
    la1,lo1,_=CITY[a];la2,lo2,_=CITY[b];R=3958.8
    p1,p2=math.radians(la1),math.radians(la2);dp=p2-p1;dl=math.radians(lo2-lo1)
    h=math.sin(dp/2)**2+math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2*R*math.asin(math.sqrt(h))
fn=sys.argv[1]
r=[x for x in csv.DictReader(open(fn,encoding='utf8')) if x['season_type']=='2' and x['type_abbreviation']=='STD' and x['home_abbreviation'] in HOME and x['away_abbreviation'] in HOME]
r.sort(key=lambda x:x['date'])
print('games',len(r),r[0]['date'][:10],r[-1]['date'][:10])
games=collections.defaultdict(list)
for g in r:
    d=datetime.strptime(g['date'][:16],'%Y-%m-%dT%H:%M')-timedelta(hours=5)  # ET-ish
    for side,opp in (('home','away'),('away','home')):
        t=g[side+'_abbreviation'];w=g[side+'_winner']=='true' if g['status_type_completed']=='true' else None
        games[t].append(dict(d=d,city=g['venue_address_city'],home=side=='home',win=w,opp=g[opp+'_abbreviation']))
stats={};rows=[]
for t,gs in games.items():
    gs.sort(key=lambda x:x['d']);loc=HOME[t];miles=0;tz=0;prev=None;legs=[];maxleg=(0,None)
    for g in gs:
        dist=hav(loc,g['city']);dtz=abs(CITY[loc][2]-CITY[g['city']][2])
        rest=(g['d'].date()-prev['d'].date()).days-1 if prev else 3
        g.update(dist=dist,dtz=dtz,rest=rest,team=t)
        rows.append(g)
        if dist>maxleg[0]:maxleg=(dist,loc+' > '+g['city'])
        miles+=dist;tz+=dtz;loc=g['city'];prev=g
    miles+=hav(loc,HOME[t])  # fly home at the end
    road=sum(1 for g in gs if not g['home']);b2b=sum(1 for g in gs if g['rest']==0)
    stats[t]=dict(miles=round(miles),tz=tz,b2b=b2b,road=road,maxleg=maxleg)
print('\nteam  miles  tz-changes  b2b  longest leg')
for t,s in sorted(stats.items(),key=lambda kv:-kv[1]['miles']):
    print(f"{t:5} {s['miles']:6,} {s['tz']:4} {s['b2b']:4}   {s['maxleg'][0]:5.0f} mi {s['maxleg'][1]}")
tot=sum(s['miles'] for s in stats.values());print('\nleague total',f'{tot:,}','avg',f'{tot//30:,}')
# performance
done=[g for g in rows if g['win'] is not None]
def wp(sel,label):
    s=[g for g in done if sel(g)];print(f"{label:38} n={len(s):5} win%={100*sum(g['win'] for g in s)/max(1,len(s)):.1f}")
print()
wp(lambda g:g['home'],'home games');wp(lambda g:not g['home'],'road games')
wp(lambda g:not g['home'] and g['rest']==0,'road, back-to-back (0 rest)');wp(lambda g:not g['home'] and g['rest']==1,'road, 1 day rest');wp(lambda g:not g['home'] and g['rest']>=2,'road, 2+ days rest')
wp(lambda g:g['home'] and g['rest']==0,'home, back-to-back');
wp(lambda g:not g['home'] and g['dtz']==0,'road, same time zone as last stop');wp(lambda g:not g['home'] and g['dtz']==1,'road, crossed 1 zone');wp(lambda g:not g['home'] and g['dtz']>=2,'road, crossed 2+ zones')
wp(lambda g:not g['home'] and g['dist']<300,'road, flew <300 mi');wp(lambda g:not g['home'] and 300<=g['dist']<1000,'road, flew 300-1000 mi');wp(lambda g:not g['home'] and g['dist']>=1000,'road, flew 1000+ mi')
# east teams going west vs west going east
east={'ATL','BOS','BKN','CHA','CHI','CLE','DET','IND','MIA','MIL','NY','ORL','PHI','TOR','WSH'}
wp(lambda g:not g['home'] and g['team'] in east and CITY[g['city']][2]<=-7,'East teams playing in Mountain/Pacific');wp(lambda g:not g['home'] and g['team'] not in east and CITY[g['city']][2]>=-5,'West teams playing in Eastern zone')
json.dump(dict(stats=stats,rows=[dict(team=g['team'],d=g['d'].isoformat(),city=g['city'],home=g['home'],win=g['win'],opp=g['opp'],dist=round(g['dist']),dtz=g['dtz'],rest=g['rest']) for g in rows]),open(fn.replace('.csv','_travel.json'),'w'))
