import csv
H="https://dx.doi.org/10.1007/bf01644951"
HZ="https://data.zhenzhi.com/details/1/985000637"
W="https://pmc.ncbi.nlm.nih.gov/articles/PMC4098954"
C="https://www.intramed.net/content/infecciones-en-ninos-que-asisten-a-guarderia"
CN="https://childcarecanada.org/print/5186"
W91="https://scilit.com/publications/91d3acedb61eddd8ad2c1d4443104151"
W91b="https://data.zhenzhi.com/details/1/1004035137"
S="https://academic.oup.com/ije/article/52/2/466/6839854"
SH="https://bmjopen.bmj.com/content/7/9/e014635"
T16="https://www.pubmed.gov/27581858/"
TR="https://read.qxmd.com/read/27455443/burden-of-recurrent-respiratory-tract-infections-in-children-a-prospective-cohort-study"
L="https://www.mdpi.com/2076-2607/10/1/111"
P="https://stacks.cdc.gov/view/cdc/147679/cdc_147679_DS1.pdf"
TH="https://www.bmj.com/content/347/bmj.f7027"
M="https://core-cms.cambridgecore.org/core/services/aop-cambridge-core/content/view/4CEB6308792B6B967E673E8168CEE2BF/S0950268800050779a.pdf/acute-respiratory-illness-in-the-community-frequency-of-illness-and-the-agents-involved.pdf"
V="https://read.qxmd.com/read/11419498/epidemiology-of-documented-viral-respiratory-infections-and-acute-otitis-media-in-a-cohort-of-children-followed-from-two-to-twenty-four-months-of-age"
CH="https://cris.bgu.ac.il/en/publications/symptomatic-and-asymptomatic-respiratory-viral-infections-in-the-/"
VI="https://research.regionh.dk/en/publications/epidemiology-and-risk-factors-of-infection-in-early-childhood/"
HU="https://researchinformation.umcutrecht.nl/en/publications/first-year-daycare-and-incidence-of-acute-gastroenteritis/"
SA="https://espace.curtin.edu.au/handle/20.500.11937/72599"
RI="https://research.cbs.dk/da/publications/morbidity-of-children-attending-day-care-centers-in-copenhagen-il/"
FL="https://pesquisa.bvsalud.org/ses/resource/pt/mdl-3797171"

hel=("Ponka et al. 1991 Infection 19:230-6 (Helsinki I)","Finland (Helsinki)","1985-1986")
who=("de Hoog et al. 2014 BMC Med 12:107 (WHISTLER)","Netherlands (Utrecht)","born 2001-2012")
cote=("Cote et al. 2010 Arch Pediatr Adolesc Med 164:1132-7","Canada (Quebec)","born 1998; followed to 2006")
wald=("Wald et al. 1991 Pediatrics 87:129-33","USA (Pittsburgh)","not stated in abstract")
soe=("Soegaard et al. 2023 Int J Epidemiol 52:466-75","Denmark (national registers)","born 1997-2014; follow-up to 2016")
sch=("Schuez-Havupalo et al. 2017 BMJ Open 7:e014635 (STEPS)","Finland (Southwest)","born 2008-2010; follow-up to 2012")
toi=("Toivonen et al. 2016 Pediatrics (STEPS rhinovirus)","Finland (Southwest)","born 2008-2010")
toir=("Toivonen et al. 2016 Pediatr Infect Dis J (STEPS recurrent RTI)","Finland (Southwest)","born 2008-2010")
lan=("Langer et al. 2022 Microorganisms 10:111 (LoewenKIDS)","Germany","recruited 2014-2018; data to Feb 2020")
pre=("Teoh et al. 2023 Clin Infect Dis 77:901-9 (PREVAIL)","USA (Cincinnati)","enrolled 2017-2020")
tho=("Thompson et al. 2013 BMJ 347:f7027 (systematic review)","high-income countries (pooled)","studies to July 2012")
mon=("Monto & Sullivan 1993 Epidemiol Infect 110:145-60 (Tecumseh)","USA (Tecumseh, Michigan)","1976-1981")
ves=("Vesa et al. 2001 Pediatr Infect Dis J (FinOM cohort)","Finland","not stated in abstract")
cho=("Chonmaitree et al. 2015 Clin Infect Dis 60:1-9","USA (Galveston, Texas)","not stated in abstract")
vis=("Vissing et al. 2018 Pediatrics 141:e20170933 (COPSAC2000)","Denmark (Copenhagen)","COPSAC2000 birth cohort")
hul=("Hullegie et al. 2016 Pediatrics 137:e20153356 (WHISTLER)","Netherlands (Utrecht)","WHISTLER birth cohort")
sar=("Sarna et al. 2016 Pediatr Pulmonol 51:1336-46 (ORChID)","Australia (Brisbane)","2010-2014")
rin=("Rindel et al. 1992 Ugeskr Laeger 154:2140-6","Denmark (Copenhagen)","1 year, around 1990")
fle=("Fleming et al. 1987 Pediatrics 79:55-60","USA (Atlanta)","mid-1980s")

rows=[]
def r(s,ages,care,metric,value,unit,n,url,note=""):
    rows.append([s[0],s[1],s[2],ages,care,metric,value,unit,n,url,note])

# Helsinki
for ages,care,v,unit,met in [
 ("all ages in municipal daycare","daycare centre",4.9,"periods per follow-up year","illness periods per year"),
 ("<3 y","daycare centre",7.9,"periods per follow-up year","illness periods per year"),
 (">=3 y","daycare centre",3.8,"periods per follow-up year","illness periods per year"),
 ("all ages in municipal daycare","daycare centre",23,"days per follow-up year","illness days per year"),
 ("<3 y","daycare centre",39,"days per follow-up year","illness days per year"),
 (">=3 y","daycare centre",17,"days per follow-up year","illness days per year")]:
    r(hel,ages,care,met,v,unit,"1905 follow-up years, 29 centres",HZ,"Absence-based illness periods (any cause). No home-care group. Journal is Infection, not Eur J Pediatr.")
for d,v in [("upper respiratory tract infection",46.0),("diarrhea",17.2),("otitis media",12.9),("eye infection",4.0),("acute tonsillitis",3.2),("bronchitis",3.0)]:
    r(hel,"all ages in municipal daycare","daycare centre",f"share of illness periods: {d}",v,"% of illness periods","1905 follow-up years",HZ,"Diagnosis mix not split by age")
r(hel,"all ages","daycare centre","six commonest diagnoses (all infections), share of periods",86,"% of illness periods","1905 follow-up years",HZ,"")
r(hel,"all ages","daycare centre","six commonest diagnoses, share of illness days",79,"% of illness days","1905 follow-up years",HZ,"")
r(hel,"all ages","daycare centre","ten commonest infectious diseases, share of absence periods",90.9,"% of absence periods","1905 follow-up years",HZ,"")

# WHISTLER Table 1
t1=[("0-1 y",59.1,"51.1-67.9",100.4,"96.0-107.0"),("1-2 y",71.2,"63.0-81.4",77.6,"72.9-82.6"),
    ("2-3 y",52.5,"44.7-61.2",44.2,"40.4-48.3"),("3-4 y",38.5,"31.5-46.7",31.5,"28.0-35.3"),
    ("4-5 y",41.7,"33.9-50.8",25.0,"21.6-28.8"),("5-6 y",41.6,"33.2-51.6",20.4,"17.0-24.3")]
for a,h,hci,d,dci in t1:
    r(who,a,"home (no daycare in first year)","GP-diagnosed URTI+AOM episodes",h,"per 100 child-years","350 children",W,f"95% CI {hci}. GP-diagnosed only; new episode needs 28 disease-free days")
    r(who,a,"daycare entry in first year (>=half day/week)","GP-diagnosed URTI+AOM episodes",d,"per 100 child-years","1378 children",W,f"95% CI {dci}. Daycare status recorded in first year only")
r(who,"0-6 y total","home (no daycare in first year)","GP-diagnosed URTI+AOM episodes, 6-year total",56.2,"per 100 child-years","1362 episodes / 2424.3 child-years",W,"Table 2")
r(who,"0-6 y total","daycare entry in first year","GP-diagnosed URTI+AOM episodes, 6-year total",59.2,"per 100 child-years","4334 episodes / 7325.2 child-years",W,"Table 2; aIRR 1.08 (0.95-1.22)")
r(who,"0-1 y","daycare vs home","adjusted IRR, URTI+AOM",1.40,"rate ratio","1728 children",W,"95% CI 1.25-1.57")
r(who,"4-5 y","daycare vs home","adjusted IRR, URTI+AOM",0.87,"rate ratio","1728 children",W,"95% CI 0.80-0.95")
r(who,"5-6 y","daycare vs home","adjusted IRR, URTI+AOM",0.85,"rate ratio","1728 children",W,"95% CI 0.77-0.94")

# Cote
cn="1238 children analysed (2023 recruited)"
r(cote,"preschool (early preschool 1.5-2.5 y)","large group centre before 2.5 y vs home","IRR febrile respiratory infection",1.61,"rate ratio",cn,C,"95% CI 1.27-2.03. Mother-reported, 3-month recall. Abstract via Spanish summary; ratio also in CBC report")
r(cote,"preschool (early preschool 1.5-2.5 y)","large group centre before 2.5 y vs home","IRR otitis media",1.62,"rate ratio",cn,C,"95% CI 1.19-2.20")
r(cote,"5-8 y (primary school)","large group centre before 2.5 y vs home","IRR febrile respiratory infection",0.79,"rate ratio",cn,C,"95% CI as reported 0.66-0.88")
r(cote,"5-8 y (primary school)","large group centre before 2.5 y vs home","IRR otitis media",0.57,"rate ratio",cn,C,"95% CI 0.37-0.88")
r(cote,"3.5-4.5 y","small group (3-8 children) before 2.5 y vs home","IRR otitis media",1.47,"rate ratio",cn,C,"95% CI 1.03-2.11. News reports say small groups showed no difference; check full paper")
r(cote,"1.5-8 y","large group centre before 2.5 y vs home","gastrointestinal infections",'',"no difference reported",cn,C,"Qualitative only: no association at any age")
r(cote,"all","large group centre","group structure",'"up to 10 groups of 8-12 children"',"description",cn,CN,"Large group definition")

# Wald 1991
r(wald,"<1 y","day care (7+ children)","mean URI duration",8.9,"days","2741 respiratory infections over 3 y",W91,"Highest group mean in abstract; parent phone survey every 2 weeks")
r(wald,"1-2 y","home care","mean URI duration",6.6,"days","2741 respiratory infections over 3 y",W91,"Lowest group mean in abstract")
r(wald,"1-3 y","home care","share of URIs lasting >15 days",6.5,"% of URIs","2741 respiratory infections",W91,"Lowest group")
r(wald,"2-3 y","day care","share of URIs lasting >15 days",13.1,"% of URIs","2741 respiratory infections",W91,"Highest group")
r(wald,"0-3 y","all care types","share of respiratory infections complicated by otitis media",29.2,"% of infections","801 of 2741",W91,"")
r(("Wald et al. 1991 J Pediatr (3-year follow-up)","USA (Pittsburgh)","not stated in abstract"),"0-3 y","home vs group (2-6) vs day care (7+)","year with most infections","year 2","year of life","not stated",W91b,"Abstract has no rates; daycare-home gap narrowed in year 3")

# Soegaard
sn="1,007,448 children; 8,618,411 person-years"
r(soe,"shortly after enrolment at 6 mo","creche / age-integrated institution","infection rate (antimicrobial prescriptions), boys",1.9,"episodes per year",sn,S,"Outcome = antimicrobial prescription, not all illness")
r(soe,"shortly after enrolment at 6 mo","creche / age-integrated institution","infection rate (antimicrobial prescriptions), girls",1.5,"episodes per year",sn,S,"")
r(soe,"shortly after enrolment at 6 mo","daycare home","infection rate (antimicrobial prescriptions), boys",1.8,"episodes per year",sn,S,"")
r(soe,"shortly after enrolment at 6 mo","daycare home","infection rate (antimicrobial prescriptions), girls",1.4,"episodes per year",sn,S,"")
r(soe,"at 12 mo","enrolled from 6 mo vs homecare","excess infection rate","0.6-0.8","episodes per year",sn,S,"Stated as a 66-68% increase")
r(soe,"at 3 y","enrolees vs homecare","excess infection rate",0.3,"episodes per year",sn,S,"Stated as roughly 48% increase")
r(soe,"by age 6","enrolled at 6 or 12 mo vs at 3 y","extra cumulative infections","0.5-0.7","episodes",sn,S,"")
r(soe,"by age 20","enrolled at 6 or 12 mo vs at 3 y","extra cumulative infections","0.5-1.1","episodes",sn,S,"")
r(soe,"6-13 y","all groups","infection rates by enrolment age","similar","qualitative",sn,S,"Excess does not reverse in this register")

# Schuez-Havupalo
shn="DCC 299, FDC 245, home 350"
r(sch,"~15 mo (mean start age)","daycare centre","RTI sick days per month before start",3.79,"days per month",shn,SH,"95% CI 3.04-4.53; parent diary")
r(sch,"2 months after start","daycare centre","RTI sick days per month (peak)",10.57,"days per month",shn,SH,"95% CI 9.35-11.79")
r(sch,"~15 mo","family daycare (<=5 children)","RTI sick days per month before start",3.53,"days per month",shn,SH,"95% CI 2.83-4.24")
r(sch,"peak after start","family daycare (<=5 children)","RTI sick days per month (peak)",8.34,"days per month",shn,SH,"95% CI 7.25-9.43")
r(sch,"5 months after start","daycare centre and family daycare","sick days vs home care","comparable","qualitative",shn,SH,"Spike back to home-care level by month 5")
r(sch,"0-2 y whole period","daycare centre","mean RTI sick days per month",5.54,"days per month",shn,SH,"SD 4.07")
r(sch,"0-2 y whole period","family daycare","mean RTI sick days per month",4.85,"days per month",shn,SH,"SD 3.49")
r(sch,"0-2 y whole period","home care","mean RTI sick days per month",4.80,"days per month",shn,SH,"SD 3.39")
r(sch,"starts","daycare","share starting in fall-winter",38.2,"% of starters",shn,SH,"")

# Toivonen
r(toi,"0-2 y","mixed (cohort)","acute respiratory infection episodes",5.9,"per child per year","923 children; 8847 episodes",T16,"95% CI 5.7-6.1; daily diary + clinic + registries")
r(toi,"0-2 y","mixed","rhinovirus share of tested infections",59,"% of tested ARIs","923 children",T16,"")
r(toi,"0-2 y","mixed","rhinovirus share of AOM episodes",50,"% of AOM","923 children",T16,"")
r(toi,"0-2 y","mixed","rhinovirus infections",3.5,"per child per year","923 children",T16,"95% CI 3.3-3.6")
r(toir,"0-2 y","mixed","90th percentile of respiratory illness days",98,"days per year","1089 children",TR,"Cut-off for 'recurrent' group")
r(toir,"0-2 y","mixed, top 10%","median ARIs in recurrent group",9.6,"per year","109 children",TR,"")

# Langer
ln="288 children; 3911 episodes"
r(lan,"0-2 y","mixed","ARI episodes over 2 years (mean)",13.7,"episodes per child",ln,L,"SD 5.2, median 14.0, IQR 10-17; daily diary, episode ends after 3 symptom-free days")
r(lan,"0-1 y","mixed","ARI episodes in year 1 (mean)",6.0,"episodes per child",ln,L,"")
r(lan,"1-2 y","mixed","ARI episodes in year 2 (mean)",7.7,"episodes per child",ln,L,"")
r(lan,"0-2 y","mixed","ARI episode duration (median)",9.7,"days",ln,L,"mean 11, SD 5.8, IQR 7-14")
r(lan,"0-2 y","no childcare","ARI episodes over 2 years (mean)",11.4,"episodes per child",ln,L,"")
r(lan,"0-2 y","childcare started 0-12 mo","ARI episodes over 2 years (mean)",13.8,"episodes per child",ln,L,"+2.4 vs none (95% CI 0.44-4.42)")
r(lan,"0-2 y","childcare started 13-26 mo","ARI episodes over 2 years (mean)",14.1,"episodes per child",ln,L,"+2.7 vs none (95% CI 0.81-4.66); aRR 1.26 (1.15-1.39)")
for a,v in [("0-6 mo",19.4),("7-12 mo",41.8),("13-18 mo",49.5),("19-24 mo",43.4)]:
    r(lan,a,"mixed","symptom days in 6-month band (mean)",v,"days per child",ln,L,"")
r(lan,"0-2 y","mixed","share of child-days with ARI symptoms",21.6,"% of days","206001 child-days",L,"")
r(lan,"0-2 y","mixed","seasonality","winter > summer","qualitative",ln,L,"Values only in figure 2D")

# PREVAIL
pn="245 mother-infant pairs"
r(pre,"0-2 y","mixed","viral ARI episodes",3.30,"per child-year",pn,P,"95% CI 3.01-3.50; ARI = cough or fever; enrolment overlaps COVID-19 period")
for v,val in [("rhinovirus/enterovirus",1.89),("adenovirus",0.35),("parainfluenza 3",0.24),("RSV A",0.19),("RSV B",0.19),("human metapneumovirus",0.16),("coronavirus OC43",0.16),("influenza A",0.11),("influenza B",0.02)]:
    r(pre,"0-2 y","mixed",f"viral ARI incidence: {v}",val,"per child-year",pn,P,"Table 2")
r(pre,"0-2 y","mixed","median ARI symptom duration, all viruses",5,"days",pn,P,"IQR 3-9")
r(pre,"0-2 y","mixed","median ARI symptom duration, RSV",7,"days",pn,P,"")
r(pre,"0-2 y","mixed","share of viral infections that were symptomatic",37,"%","821 of 2211",P,"")
r(pre,"0-2 y","mixed","share of RSV infections with ED visit or hospitalisation",15,"%",pn,P,"about 15% as stated")

# Thompson
for s_,v in [("common cold",15),("non-specific RTI",16),("acute cough",25),("earache",'7-8'),("sore throat",'2-7'),("bronchiolitis",21),("croup",2)]:
    r(tho,"children (ranges vary by study)","primary/emergency care",f"days until 90% resolved: {s_}",v,"days","23 RCTs + 25 observational studies",TH,"90th percentile, not median")

# Monto
r(mon,"0-4 y","community (mixed)","respiratory illnesses (count / person-years)","2657 / 539","illnesses / person-years","539 person-years",M,"Ratio not stated in text; paper says rates peak at 1-2 y")
for a,v in [("rhinovirus",34),("coronavirus",14),("influenza",9),("bacterial",8),("parainfluenza",4),("RSV",4),("adenovirus",2),("other virus",2),("unknown/non-infectious",23)]:
    r(mon,"all ages","community",f"share of respiratory illnesses: {a}",v,"% of illnesses","about 5,360 person-years",M,"All ages, not children only")
r(mon,"all ages","community","share of illnesses with physician consultation",25.4,"%","",M,"")

# Vesa
for a,v in [("rhinovirus",63.1),("RSV",14.7),("parainfluenza 3",6.7),("influenza A",6.7),("adenovirus",6.2)]:
    r(ves,"2-24 mo","mixed",f"share of virus-specific URI episodes: {a}",v,"% of 761 virus episodes","329 children",V,"Among virus-positive sampled episodes only")
r(ves,"2-24 mo","mixed","share of URIs with AOM",43.4,"% of 870 URIs","329 children",V,"57.7% with RSV")

# Chonmaitree
r(cho,"0-12 mo","mixed","share of URTI episodes complicated by AOM",27,"% of URTI","362 infants",CH,"")
r(cho,"0-12 mo","mixed","share of URTI specimens virus-positive",76,"% of 394 specimens","362 infants",CH,"")

# Vissing
r(vis,"0-3 y","mixed","infection episodes (median, all types)",14,"episodes per child over 3 y","334 children",VI,"range 2-43; diary")
r(vis,"0-3 y","daycare","aIRR per extra child in daycare, URI",1.11,"rate ratio","334 children",VI,"95% CI 1.03-1.20")

# Hullegie
r(hul,"0-6 y","daycare in first year","GP-diagnosed acute gastroenteritis",12.2,"per 100 child-years","2220 children",HU,"")
r(hul,"0-6 y","no daycare in first year","GP-diagnosed acute gastroenteritis",13.3,"per 100 child-years","2220 children",HU,"")
r(hul,"age 1 y","daycare vs home","IRR acute gastroenteritis",1.13,"rate ratio","2220 children",HU,"95% CI 1.06-1.21; excess greatest in first 12 mo after entry; lower at 3-6 y")

# Sarna
r(sar,"0-2 y","mixed","ARIs per child-month",0.56,"per child-month","154 infants; 1651 episodes",SA,"95% CI 0.54-0.59; diary")
r(sar,"0-2 y","mixed","median duration runny nose",6.0,"days","154 infants",SA,"")
r(sar,"0-2 y","mixed","share of days with symptoms",19.7,"% of child-days","88,032 child-days",SA,"")

# Rindel
r(rin,"nursery age (vuggestue, roughly 0-3 y)","daycare nursery","sick leave share of opening days",7.5,"% of days","24 nurseries",RI,"Ages and n children not stated in abstract")
r(rin,"nursery age","daycare nursery","mean sick days per child (range across nurseries)","14.6-24.4","days per year","24 nurseries",RI,"")

# Fleming
r(fle,"<5 y","daycare attendees vs not","OR for URTI in past 2 weeks",1.6,"odds ratio","575 children",FL,"Cross-sectional phone survey")
r(fle,"<5 y","full-time daycare vs not","OR for ear infection in past 2 weeks",3.8,"odds ratio","575 children",FL,"")

with open("/home/claude/site/src/winter/data/cohort_figures.csv","w",newline="") as f:
    w=csv.writer(f); w.writerow("study,country,years,ages,care_type,metric,value,unit,n,source_url,note".split(","))
    w.writerows(rows)
print(len(rows))
