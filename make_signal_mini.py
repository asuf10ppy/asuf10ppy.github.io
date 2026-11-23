# AUTHOR ONLY (contains the answer path). Do not upload to the public repo.
# Writes signal_mini.wav: declared 348 Hz, true 24,012 Hz (x69), 69 s restored, mono 16-bit (~3.2 MB).
import numpy as np, struct, secrets, hashlib, json
rng=np.random.default_rng(3301)
F=69; DECL=348; SR=DECL*F; U=0.06; T=69.0; FR=int(round(T*SR))
M={'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','.':'.-.-.-',':':'---...','/':'-..-.'}
def keying(text):
    ev=[];ws=text.split(' ')
    for wi,w in enumerate(ws):
        for li,ch in enumerate(w):
            for ei,e in enumerate(M[ch]):
                ev.append((1,1 if e=='.' else 3))
                if ei<len(M[ch])-1: ev.append((0,1))
            if li<len(w)-1: ev.append((0,3))
        if wi<len(ws)-1: ev.append((0,7))
    return ev
def render(ev,f=600,ramp=0.004):
    out=[]
    for on,u in ev:
        n=int(round(u*U*SR)); t=np.arange(n)/SR
        if on:
            s=np.sin(2*np.pi*f*t); r=int(ramp*SR); env=np.ones(n)
            env[:r]=0.5-0.5*np.cos(np.pi*np.arange(r)/r); env[-r:]=env[:r][::-1]; out.append(s*env)
        else: out.append(np.zeros(n))
    return np.concatenate(out).astype(np.float32)
real=render(keying("ASUF10PPY.GITHUB.IO/SYNERGY2026"))
rep=np.concatenate([render(keying("KEEP LOOKING")),np.zeros(int(1.2*SR),np.float32)]); L=len(rep)
start=int(10.33*SR); afterU=start+len(real)+int(1.2*SR)
sig=(0.03*np.sin(2*np.pi*3301*np.arange(FR,dtype=np.float64)/SR)).astype(np.float32)
for k in range((start-int(0.5*SR))//L): sig[k*L:(k+1)*L]+=0.55*rep
for k in range((FR-afterU)//L): sig[afterU+k*L:afterU+(k+1)*L]+=0.55*rep
sig[start:start+len(real)]+=0.55*real
sig=(sig+rng.normal(0,0.12,FR).astype(np.float32))*(0.9/(0.55+0.03+4*0.12))
pcm=np.clip(sig*32767,-32768,32767).astype('<i2').tobytes()
open('/mnt/user-data/outputs/site/signal_mini.wav','wb').write(b'RIFF'+struct.pack('<I',36+len(pcm))+b'WAVEfmt '+struct.pack('<IHHIIHH',16,1,1,DECL,DECL*2,2,16)+b'data'+struct.pack('<I',len(pcm))+pcm)
print('message s',len(real)/SR,'ends',(start+len(real))/SR,'declared min',FR/DECL/60)
