import math, sys
from skyfield.api import load, EarthSatellite, wgs84
from datetime import datetime, timedelta, timezone

ts = load.timescale()
eph = load('/tmp/claude-0/-home-claude/56988ba9-8a4f-55a3-b598-a36da9c3de82/scratchpad/de421.bsp')
sun, earth = eph['sun'], eph['earth']
obs = wgs84.latlon(41.0046, 29.0762, 0)

# TLEs fetched earlier today (recorded in uydu_kaynaklar.md); epochs match HA pages (ISS 27 Oct, CSS 26 Oct)
TLE = {
 'ISS': ('1 25544U 98067A   26300.17675415  .00005704  00000+0  11132-3 0  9993',
         '2 25544  51.6336   6.9404 0006948 314.9066  45.1358 15.49073103592213', -1.8),
 'CSS': ('1 48274U 21035A   26299.76014724  .00007428  00000+0  89206-4 0  9994',
         '2 48274  41.4690 242.6948 0003157 219.3970 140.6639 15.61173988313716', 0.0),
}
sats = {k: (EarthSatellite(a, b, k, ts), m0) for k, (a, b, m0) in TLE.items()}

# (sat, local date-time UTC+3, HA alt, HA az, HA distance km or None, HA mag, label)
rows = [
 # detail pages
 ('CSS','2026-10-27 18:57:59',0,251,2256,3.7,'D rise'),
 ('CSS','2026-10-27 19:00:03',10,249,1404,2.1,'D 10deg'),
 ('CSS','2026-10-27 19:03:12',68,165,417,-2.0,'D max'),
 ('CSS','2026-10-27 19:05:12',20,86,950,-0.8,'D shadow'),
 ('CSS','2026-10-29 18:35:08',0,260,2258,4.5,'D rise'),
 ('CSS','2026-10-29 18:37:12',10,260,1405,2.5,'D 10deg'),
 ('CSS','2026-10-29 18:40:23',88,173,389,-2.1,'D max'),
 ('CSS','2026-10-29 18:43:24',11,82,1338,-0.1,'D shadow'),
 ('ISS','2026-10-30 06:55:31',8,307,1680,-1.3,'D exit shadow'),
 ('ISS','2026-10-30 06:55:56',10,308,1511,-1.5,'D 10deg'),
 ('ISS','2026-10-30 06:59:20',80,34,434,-3.6,'D max'),
 ('ISS','2026-10-30 07:02:43',10,123,1505,0.4,'D below10'),
 ('ISS','2026-10-30 07:04:49',0,125,2367,1.6,'D sets'),
 ('ISS','2026-11-01 05:24:45',30,51,791,-2.0,'D exit shadow'),
 ('ISS','2026-11-01 05:27:12',10,93,1507,0.1,'D below10'),
 ('ISS','2026-11-01 05:29:26',0,103,2370,1.3,'D sets'),
]
# summary "highest point" rows (alt, az, mag)
summ = {
'ISS': [('2026-10-27 06:07:40',16,'NNE',-1.4),('2026-10-28 05:20:33',14,'NNE',-1.0),('2026-10-28 06:57:30',33,'NNE',-2.3),
 ('2026-10-29 06:09:49',24,'NNE',-1.9),('2026-10-30 05:22:33',19,'NNE',-1.4),('2026-10-30 06:59:20',80,'NNE',-3.6),
 ('2026-10-31 06:11:45',49,'NNE',-3.0),('2026-11-01 05:24:45',30,'NE',-2.0),('2026-11-01 07:00:54',34,'SW',-2.8),
 ('2026-11-02 06:13:25',60,'SW',-3.7),('2026-11-03 05:27:15',32,'ESE',-2.1),('2026-11-03 07:02:12',12,'SW',-1.5),
 ('2026-11-04 06:15:08',20,'SW',-2.1),('2026-11-05 05:30:06',12,'SSE',-0.9)],
'CSS': [('2026-10-27 19:03:12',68,'SSE',-2.0),('2026-10-27 20:37:24',14,'W',1.2),('2026-10-28 19:40:13',81,'N',-2.3),
 ('2026-10-29 18:40:23',88,'S',-2.1),('2026-10-29 20:15:35',26,'W',0.2),('2026-10-30 19:17:24',80,'N',-2.2),
 ('2026-10-31 19:53:46',52,'WSW',-1.4),('2026-11-01 18:54:31',90,'WNW',-2.2),('2026-11-01 20:29:01',15,'W',1.1),
 ('2026-11-02 19:31:24',49,'SSW',-1.5),('2026-11-03 18:31:33',71,'SSW',-1.9),('2026-11-03 20:07:30',19,'SW',0.4),
 ('2026-11-04 19:08:19',31,'SSW',-0.5),('2026-11-05 19:44:49',12,'SW',0.9)],
}
for k, lst in summ.items():
    for (t, alt, az, mag) in lst:
        rows.append((k, t, alt, az, None, mag, 'S max'))

def geom(k, tloc):
    sat, m0 = sats[k]
    dt = datetime.strptime(tloc, '%Y-%m-%d %H:%M:%S').replace(tzinfo=timezone(timedelta(hours=3)))
    t = ts.from_datetime(dt)
    topo = (sat - obs).at(t)
    alt, az, dist = topo.altaz()
    # phase angle at satellite between Sun and observer
    satpos = (earth + sat).at(t)
    obspos = (earth + obs).at(t)
    sunpos = sun.at(t) if False else earth.at(t).observe(sun)  # unused
    s_sat = satpos.position.km
    to_sun = eph['sun'].at(t).position.km - s_sat
    to_obs = obspos.position.km - s_sat
    c = sum(a*b for a, b in zip(to_sun, to_obs)) / (math.dist(to_sun,[0,0,0]) * math.dist(to_obs,[0,0,0]))
    phi = math.acos(max(-1, min(1, c)))
    return alt.degrees, az.degrees, dist.km, phi, m0

def lam(phi):  # Karpov eq.4: 0 at 90 deg
    return -2.5*math.log10(math.sin(phi) + (math.pi-phi)*math.cos(phi))
def frac(phi):  # illuminated fraction normalised at 90 deg (Mallama eq.1 form)
    return -2.5*math.log10((1+math.cos(phi)))
def airmass(altdeg):
    z = math.radians(90-max(altdeg, 0.5))
    return 1/math.cos(z)

print(f"{'sat':3} {'local time':19} {'lbl':13} {'HAalt':>5} {'alt':>5} {'HAd':>5} {'d':>6} {'phi':>5} {'HAmag':>5} {'L':>5} {'F':>5} {'L-HA':>5} {'F-HA':>5} {'resid_noPhase':>6}")
resL=[];resF=[];out=[]
for (k, tl, haalt, haaz, had, ham, lbl) in rows:
    alt, az, d, phi, m0 = geom(k, tl)
    r = m0 + 5*math.log10(d/1000)
    mL = r + lam(phi); mF = r + frac(phi)
    resL.append((k,mL-ham,alt)); resF.append((k,mF-ham,alt))
    out.append((k,tl,lbl,haalt,alt,had,d,math.degrees(phi),ham,mL,mF))
    print(f"{k:3} {tl:19} {lbl:13} {haalt:5} {alt:5.1f} {str(had or ''):>5} {d:6.0f} {math.degrees(phi):5.1f} {ham:5.1f} {mL:5.2f} {mF:5.2f} {mL-ham:5.2f} {mF-ham:5.2f} {ham-r:6.2f}")
import statistics as st
for name, R in (('Lambert', resL), ('IllumFrac', resF)):
    for k in ('ISS','CSS'):
        v=[x for s,x,a in R if s==k]
        print(name, k, 'n=',len(v),'mean=%.3f'%st.mean(v),'sd=%.3f'%st.pstdev(v),'maxabs=%.2f'%max(abs(x) for x in v))
    v=[x for s,x,a in R]
    print(name,'ALL n=',len(v),'mean=%.3f sd=%.3f maxabs=%.2f'%(st.mean(v),st.pstdev(v),max(abs(x) for x in v)))
