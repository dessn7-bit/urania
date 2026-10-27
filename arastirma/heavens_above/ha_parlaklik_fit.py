import math, statistics as st, runpy, io, contextlib
buf=io.StringIO()
with contextlib.redirect_stdout(buf):
    g=runpy.run_path(__file__.replace('ha_parlaklik_fit.py','ha_parlaklik_testi.py'))
rows=g['rows']; geom=g['geom']
models={
 'lambert':lambda p:-2.5*math.log10(math.sin(p)+(math.pi-p)*math.cos(p)),
 'illumfrac(1+cos)/2':lambda p:-2.5*math.log10(1+math.cos(p)),
 'linear 1-phi/pi':lambda p:-2.5*math.log10(2*(1-p/math.pi)),
}
data=[]
seen=set()
for (k,tl,haalt,haaz,had,ham,lbl) in rows:
    if (k,tl) in seen: continue
    seen.add((k,tl))
    alt,az,d,phi,m0=geom(k,tl)
    data.append((k,tl,lbl,alt,d,phi,ham,m0))
for name,f in models.items():
    for withext in (False,True):
        res=[]
        for (k,tl,lbl,alt,d,phi,ham,m0) in data:
            m=m0+5*math.log10(d/1000)+f(phi)
            if withext:
                X=1/math.cos(math.radians(90-max(alt,0.5)))
                m+=0.12*X if alt>2 else 0  # skip horizon points
            res.append((k,m-ham,lbl,phi,alt))
        r=[x[1] for x in res]
        r2=[x[1] for x in res if x[4]>2]
        print(f"{name:22} ext={withext!s:5} n={len(r)} mean={st.mean(r):+.3f} rms={math.sqrt(st.mean([x*x for x in r])):.3f} maxabs={max(map(abs,r)):.2f} | alt>2: rms={math.sqrt(st.mean([x*x for x in r2])):.3f} max={max(map(abs,r2)):.2f}")
print()
f=models['linear 1-phi/pi']
for (k,tl,lbl,alt,d,phi,ham,m0) in data:
    m=m0+5*math.log10(d/1000)+f(phi)
    print(f"{k} {tl} {lbl:13} alt={alt:5.1f} d={d:6.0f} phi={math.degrees(phi):6.1f} HA={ham:5.1f} model={m:6.2f} round={round(m,1):5.1f} diff={round(m,1)-ham:+.1f}")
