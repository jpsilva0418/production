#!/usr/bin/env python3
"""Regenerate the film/stills catalogue block in ../shared/media.js from what is on disk."""
import os, json, subprocess, re
from PIL import Image
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.normpath(os.path.join(HERE,'..'))
FILM=os.path.join(ROOT,'media/film'); ST=os.path.join(ROOT,'media/stills'); MJS=os.path.join(ROOT,'shared/media.js')
def dims(p):
    o=subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height,duration','-of','csv=p=0',p],capture_output=True,text=True).stdout.strip().split(',')
    return int(o[0]),int(o[1]),(round(float(o[2]),1) if len(o)>2 and o[2] else None)
desc=json.load(open(os.path.join(HERE,'media-descriptions.json')))
src={'m':'showreel','hero':'showreel','montage':'showreel','fd':'field','w':'western','nr':'nightride','ch':'highway','fo':'forest','jp':'jpsea'}
film={}
for f in sorted(os.listdir(FILM)):
    if not f.endswith('.mp4'): continue
    n=f[:-4]; w,h,d=dims(os.path.join(FILM,f))
    film[n]={'mp4':f'film/{n}.mp4','webm':(f'film/{n}.webm' if os.path.exists(f'{FILM}/{n}.webm') else None),'poster':f'film/{n}-poster.jpg','w':w,'h':h,'dur':d,'source':src[n.split('-')[0]],'alt':desc.get(n,n),'kb':os.path.getsize(os.path.join(FILM,f))//1024}
stills={}
for f in sorted(os.listdir(ST)):
    n=f[:-4]; im=Image.open(os.path.join(ST,f))
    stills[n]={'src':f'stills/{f}','w':im.width,'h':im.height,'source':src[n.split('-')[0]],'alt':desc.get(n,n.replace('-',' '))}
s=open(MJS,encoding='utf-8').read()
s=re.sub(r"  film: \{.*?\n  \},\n  stills: \{.*?\n  \},\n", "  film: "+json.dumps(film,indent=4,ensure_ascii=False)+",\n  stills: "+json.dumps(stills,indent=4,ensure_ascii=False)+",\n", s, flags=re.S)
open(MJS,'w',encoding='utf-8').write(s); print('catalogued',len(film),'clips',len(stills),'stills')
