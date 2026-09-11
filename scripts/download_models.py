"""Resumable, range-verified download from the official BodyParts3D archive."""
import urllib.request, concurrent.futures, time, re
from pathlib import Path
url='https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_BP3D_4.0_obj_99.zip'
dest=Path(__file__).resolve().parents[2]/'scratch/bodyparts.zip'
chunks=dest.parent/'chunks';chunks.mkdir(exist_ok=True)
with urllib.request.urlopen(urllib.request.Request(url,headers={'Range':'bytes=0-0'}),timeout=30) as r:
    header=r.headers.get('Content-Range','');print(header,flush=True)
    total=int(header.split('/')[-1]); assert r.status==206
start=dest.stat().st_size if dest.exists() else 0
size=2*1024*1024
jobs=[(n,min(n+size-1,total-1)) for n in range(start,total,size)]
def get(job):
    a,b=job;f=chunks/f'{a}-{b}.bin'
    if f.exists() and f.stat().st_size==b-a+1:return f
    for attempt in range(8):
        try:
            req=urllib.request.Request(url,headers={'Range':f'bytes={a}-{b}'})
            with urllib.request.urlopen(req,timeout=50) as r:
                assert r.status==206 and r.headers['Content-Range'].startswith(f'bytes {a}-{b}/'),r.headers
                data=r.read()
            assert len(data)==b-a+1,(len(data),b-a+1)
            f.write_bytes(data);print(f'Obtido {a/total:.0%}–{b/total:.0%}',flush=True);return f
        except Exception as e:
            print(f'Retomando bloco {a}, tentativa {attempt+1}: {type(e).__name__}',flush=True);time.sleep(1)
    raise RuntimeError(f'Não foi possível baixar o bloco {a}')
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool: files=list(pool.map(get,jobs))
with dest.open('ab') as out:
    for f in files: out.write(f.read_bytes())
assert dest.stat().st_size==total
import zipfile
with zipfile.ZipFile(dest) as z:
    bad=z.testzip();assert bad is None,bad;print(f'ZIP validado: {len(z.namelist())} arquivos, {total} bytes.',flush=True)
