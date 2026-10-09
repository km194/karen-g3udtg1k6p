"""Record every line in lines.js with free local Kokoro voices -> voices/<id>.mp3.

Runs on the Mac, costs nothing. Re-run after changing a line or her name:
    /Users/kevinmu/Desktop/Viral-Content-Factory/venv/bin/python gen_voices.py
Only missing or changed lines are re-recorded (a .txt next to each mp3 remembers its text).
"""
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'voices'
OUT.mkdir(exist_ok=True)

# character -> (kokoro voice, speed, pitch factor; >1 = higher)
CAST = {
    'harry':    ('bm_lewis', 1.0, 1.06),
    'ron':      ('bm_george', 1.08, 1.04),
    'hermione': ('bf_emma', 1.05, 1.0),
    'hat':      ('bm_fable', 0.9, 0.8),
    'yato':     ('am_puck', 1.05, 1.0),
    'hiccup':   ('am_eric', 1.0, 1.05),
    'jake':     ('am_michael', 0.95, 1.0),
    'neytiri':  ('af_nova', 0.92, 1.0),
    'kiri':     ('af_sky', 0.95, 1.06),
    'tuk':      ('af_bella', 1.05, 1.28),
}


def lines():
    js = "global.window={};require('./lines.js');process.stdout.write(JSON.stringify(window.LINES))"
    return json.loads(subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, text=True, check=True).stdout)


def her_name():
    s = (ROOT / 'story.js').read_text()
    return re.search(r"herName:\s*'([^']*)'", s).group(1)


def main():
    from kokoro import KPipeline
    name = her_name()
    pipes = {}
    todo = 0
    for lid, (char, text) in lines().items():
        text = text.replace('{name}', name)
        mp3, stamp = OUT / f'{lid}.mp3', OUT / f'{lid}.txt'
        if mp3.exists() and stamp.exists() and stamp.read_text() == text:
            continue
        voice, speed, pitch = CAST[char]
        lang = voice[0]
        pipe = pipes.setdefault(lang, KPipeline(lang_code=lang))
        audio = np.concatenate([np.asarray(a) for _, _, a in pipe(text, voice=voice, speed=speed)])
        wav = OUT / f'{lid}.wav'
        sf.write(wav, audio, 24000)
        af = f'asetrate={int(24000 * pitch)},aresample=24000,atempo={1 / pitch:.3f}' if pitch != 1.0 else 'anull'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav), '-af', af + ',loudnorm=I=-16:TP=-1.5',
                        '-ac', '1', '-b:a', '64k', str(mp3)], check=True)
        wav.unlink()
        stamp.write_text(text)
        todo += 1
        print(f'recorded {lid}: {text}')
    print(f'done, {todo} new recordings')


if __name__ == '__main__':
    sys.exit(main())
