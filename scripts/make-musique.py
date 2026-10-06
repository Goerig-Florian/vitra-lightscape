"""
Compose la musique du teaser Vitra Lightscape (14 s), calée sur la chronologie de la page /reel/ :

  0,0 - 1,2   presque silence, un souffle d'air
  1,2 - 2,1   le trait de néon balaie l'écran : whoosh grave + bourdonnement électrique, qui s'éteint
  2,1 - 2,6   écran noir : nappe très grave
  2,6 - 4,4   la lumière du premier mapping : montée de la nappe, whoosh brillant, scintillements quand la barre se dessine
              (3,0 : le néon se rallume, petit « clic » électrique)
  4,4         petit impact doux : le logo est complet
  5,6 - 7,0   deuxième mapping (anneaux) : whoosh aérien, gouttes cristallines
  8,2 - 9,6   troisième mapping (faisceaux) : whoosh lumineux qui monte, arpège scintillant
  10,8 - 12,2 quatrième mapping (trame de points) : whoosh rythmé, pulsations douces
  12,6 - 14,0 la musique se retire, queue de réverbération, fondu

Tout est synthétisé ici (aucun échantillon externe, aucune musique existante) : la création est libre de droits.
Tonalité : la mineur (accords la m9, fa maj9, do maj7 add9, la m9). Pas de musique épique : une ambiance de nuit, de lumière.

Sortie : exports/musique/ (wav, mp3 et le teaser avec le son).
Usage : python scripts/make-musique.py [chemin-de-ffmpeg]

Variante avec un morceau existant (ex. « Lights.mp3 », fourni par l'équipe) :
  python scripts/make-musique.py [chemin-de-ffmpeg] --lights "C:/chemin/Lights.mp3"
Le morceau est utilisé depuis sa première seconde ; seuls les effets (whooshes, néon, impact) sont gardés, sans nappes ni notes,
pour ne pas jurer avec lui. Son « drop » (à 8,1 s) tombe sur le troisième mapping (8,2 s). Sortie : fichiers « -lights ».
ATTENTION : ce morceau n'est pas de nous. Son utilisation publique demande l'accord de son auteur (voir CREDITS.md).
"""
import subprocess
import sys
from pathlib import Path

import numpy as np
from scipy import signal
from scipy.io import wavfile

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "exports" / "musique"
OUT.mkdir(parents=True, exist_ok=True)
import argparse

_ap = argparse.ArgumentParser()
_ap.add_argument("ffmpeg", nargs="?", default="ffmpeg")
_ap.add_argument("--lights", default=None)
_args = _ap.parse_args()
FFMPEG = _args.ffmpeg
LIGHTS = _args.lights
DECALAGE = 0.1  # le drop du morceau (8,1 s) tombe ainsi pile sur le troisième mapping (8,2 s)
SUFFIXE = "-lights" if LIGHTS else ""

SR = 44100
DUR = 14.0
N = int(SR * DUR)
T = np.arange(N) / SR
rng = np.random.default_rng(2027)


def smooth(t0, t1):
    """Montée douce de 0 à 1 entre t0 et t1."""
    return 0.5 - 0.5 * np.cos(np.pi * np.clip((T - t0) / max(t1 - t0, 1e-6), 0, 1))


def bump(a, b, c, d):
    return smooth(a, b) * (1 - smooth(c, d))


def hz(note):
    """Fréquence d'une note : 'A4' -> 440."""
    names = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}
    n = names[note[0]]
    i = 1
    if note[1] == "#":
        n += 1
        i = 2
    o = int(note[i:])
    return 440.0 * 2 ** ((n - 9 + 12 * (o - 4)) / 12)


stereo = np.zeros((2, N))
reverb_send = np.zeros((2, N))


def add(sig, pan=0.0, send=0.25):
    """Ajoute un signal mono au mixage. pan : -1 (gauche) à 1 (droite), constant ou tableau."""
    pan = np.broadcast_to(np.asarray(pan, dtype=float), (N,)) if np.ndim(pan) else np.full(N, float(pan))
    ang = (pan + 1) * np.pi / 4
    l, r = sig * np.cos(ang), sig * np.sin(ang)
    stereo[0] += l
    stereo[1] += r
    reverb_send[0] += l * send
    reverb_send[1] += r * send


def lowpass(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, fc, "low", fs=SR, output="sos"), x)


def highpass(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, fc, "high", fs=SR, output="sos"), x)


def band(x, f0, f1, order=2):
    return signal.sosfilt(signal.butter(order, [f0, f1], "band", fs=SR, output="sos"), x)


# ------------------------------------------------------------------ whooshes : bruit balayé par un filtre qui monte
def whoosh(t0, t1, f0, f1, largeur, niveau, courbe=1.0, pan=None, tail=0.35):
    bruit = rng.normal(size=N)
    f, tt, z = signal.stft(bruit, fs=SR, nperseg=2048, noverlap=1536)
    u = np.clip((tt - t0) / (t1 - t0), 0, 1)
    fc = f0 * (f1 / f0) ** (u**courbe)
    masque = np.exp(-0.5 * (np.log2((f[:, None] + 1) / fc[None, :]) / largeur) ** 2)
    # enveloppe : monte jusqu'au passage de la lumière, retombe doucement
    env = np.sin(np.pi * np.clip((tt - t0) / (t1 - t0 + tail), 0, 1)) ** 1.4
    _, x = signal.istft(z * masque * env[None, :], fs=SR, nperseg=2048, noverlap=1536)
    x = np.pad(x, (0, max(0, N - len(x))))[:N] * niveau
    if pan is None:
        pan = np.linspace(-0.9, 0.9, N)
    p = np.clip((T - t0) / (t1 - t0), 0, 1)
    pan_arr = -0.9 + 1.8 * (0.5 - 0.5 * np.cos(np.pi * p))
    add(x, pan_arr, send=0.3)


# ------------------------------------------------------------------ nappes (pad) : sinus harmoniques légèrement désaccordés
def voix(f, n_harm=7):
    sig = np.zeros(N)
    for det in (-3.0, 0.0, 3.5):  # centièmes de ton
        ff = f * 2 ** (det / 1200)
        vib = 1 + 0.0009 * np.sin(2 * np.pi * rng.uniform(0.15, 0.35) * T + rng.uniform(0, 6))
        for h in range(1, n_harm + 1):
            sig += np.sin(2 * np.pi * np.cumsum(ff * h * vib) / SR + rng.uniform(0, 6.28)) / h**1.25
    return sig


def accord(t0, t1, notes, niveau, fc=1700, fondu=1.4):
    env = smooth(t0 - fondu * 0.5, t0 + fondu) * (1 - smooth(t1 - fondu * 0.5, t1 + fondu))
    sig = sum(voix(hz(n)) for n in notes)
    sig = lowpass(sig, fc) * env * niveau / max(1, len(notes)) * 1.6
    souffle = 0.85 + 0.15 * np.sin(2 * np.pi * 0.11 * T)  # la nappe respire
    add(sig * souffle, np.sin(2 * np.pi * 0.05 * T) * 0.35, send=0.45)


# ------------------------------------------------------------------ cloches cristallines
def cloche(t0, f, vel, pan=0.0, long=1.0):
    t = T - t0
    m = t >= 0
    x = np.zeros(N)
    tm = t[m]
    for ratio, amp, dec in ((1, 1.0, 2.2), (2.76, 0.45, 1.3), (5.4, 0.2, 0.7), (8.93, 0.09, 0.4)):
        x[m] += amp * np.sin(2 * np.pi * f * ratio * tm) * np.exp(-tm / (dec * long))
    x[m] *= np.minimum(1, tm / 0.004)
    add(x * vel, pan, send=0.55)


if LIGHTS:  # avec un morceau existant : pas de nappes ni de notes (elles pourraient jurer avec sa tonalité)
    accord = lambda *a, **k: None  # noqa: E731
    cloche = lambda *a, **k: None  # noqa: E731
GARDE = 0.0 if LIGHTS else 1.0

# ------------------------------------------------------------------ 1) le souffle d'air du début
air = lowpass(rng.normal(size=N), 520) * 0.018 * GARDE * bump(0.0, 1.0, 12.8, 14.0)
add(air, 0.0, send=0.5)

# ------------------------------------------------------------------ 2) le néon balaie l'écran (1,2 - 2,1) : whoosh grave + bourdonnement
whoosh(1.2, 2.1, 110, 2600, 1.15, 0.62, courbe=1.1, tail=0.15)
hum = np.zeros(N)
for h in range(1, 14):  # buzz électrique à 100 Hz et ses harmoniques
    hum += np.cos(2 * np.pi * 100 * h * T + rng.uniform(0, 6.28)) * rng.uniform(0.4, 1.0) / h**0.8
hum = band(hum, 160, 4200)
add(hum * 0.05 * bump(1.2, 1.55, 1.85, 2.2), np.linspace(-0.8, 0.8, N), send=0.2)
# « clic » d'allumage du néon
click_t = 1.2
clic = np.zeros(N)
i0 = int(click_t * SR)
clic[i0 : i0 + 90] = rng.normal(size=90) * np.exp(-np.arange(90) / 14)
add(highpass(clic, 1500) * 0.5, -0.9, send=0.3)

# ------------------------------------------------------------------ 3) nappe grave : le noir, puis la montée avec le premier mapping
sub = np.sin(2 * np.pi * 55.0 * T) * 0.5 + np.sin(2 * np.pi * 82.41 * T) * 0.22 + np.sin(2 * np.pi * 110.0 * T) * 0.12
add(lowpass(sub, 160) * 0.38 * GARDE * bump(1.5, 2.6, 12.4, 13.8) * (0.85 + 0.15 * np.sin(2 * np.pi * 0.17 * T)), 0.0, send=0.25)

# accords : la m9, fa maj9, do maj7 add9, la m9
accord(2.3, 5.9, ["A2", "E3", "B3", "C4", "E4"], 0.55, fc=1500)
accord(5.4, 8.5, ["F2", "C3", "G3", "A3", "E4"], 0.5, fc=1900)
accord(7.9, 11.1, ["C3", "G3", "B3", "D4", "E4"], 0.52, fc=2300)
accord(10.5, 13.4, ["A2", "E3", "B3", "C4", "E4", "A4"], 0.5, fc=2000)

# ------------------------------------------------------------------ 4) la lumière du premier mapping (2,6 - 4,4)
whoosh(2.6, 4.4, 280, 7200, 0.95, 0.6, courbe=1.0, tail=0.35)
# le néon se rallume (3,0) : clic + bourdonnement bref
tn = 3.0
cl2 = np.zeros(N)
i1 = int(tn * SR)
cl2[i1 : i1 + 110] = rng.normal(size=110) * np.exp(-np.arange(110) / 18)
add(highpass(cl2, 1200) * 0.55, -0.2, send=0.3)
add(hum * 0.05 * bump(tn, tn + 0.05, tn + 0.35, tn + 1.0), np.linspace(-0.2, 0.4, N), send=0.2)
# scintillements pendant que la barre et « Lightscape » se dessinent (3,05 - 3,9)
for _ in range(46):
    tt0 = rng.uniform(3.05, 3.9)
    f = rng.uniform(2400, 7200)
    tr = T - tt0
    mk = tr >= 0
    ping = np.zeros(N)
    ping[mk] = np.sin(2 * np.pi * f * tr[mk]) * np.exp(-tr[mk] / rng.uniform(0.05, 0.14)) * rng.uniform(0.02, 0.06)
    add(ping, np.clip(-0.6 + (tt0 - 3.05) / 0.85 * 1.4 + rng.normal(0, 0.12), -1, 1), send=0.5)

# ------------------------------------------------------------------ 5) petit impact doux (4,4) : le logo est complet
tm = T - 4.4
mk = tm >= 0
fsub = 38 + 34 * np.exp(-tm[mk] / 0.22)
boom = np.zeros(N)
boom[mk] = np.sin(2 * np.pi * np.cumsum(fsub) / SR) * np.exp(-tm[mk] / 0.7) * np.minimum(1, tm[mk] / 0.006)
add(boom * 0.55, 0.0, send=0.35)
souffle = np.zeros(N)
souffle[mk] = lowpass(rng.normal(size=int(mk.sum())), 500) * np.exp(-tm[mk] / 0.25) * 0.35
add(souffle, 0.0, send=0.4)
cloche(4.4, hz("A5"), 0.05, 0.0, long=2.2)
cloche(4.4, hz("E5"), 0.035, 0.1, long=2.2)

# ------------------------------------------------------------------ 6) deuxième mapping, les anneaux (5,6 - 7,0) : gouttes cristallines
whoosh(5.6, 7.0, 600, 4300, 1.3, 0.34, courbe=0.9, tail=0.3)
for t0, n, pan in ((6.0, "E5", -0.5), (6.45, "A5", 0.3), (6.9, "C6", -0.2), (7.4, "G5", 0.6), (7.85, "E5", -0.4), (8.1, "A5", 0.2)):
    cloche(t0, hz(n), 0.085, pan, long=1.4)

# ------------------------------------------------------------------ 7) troisième mapping, les faisceaux (8,2 - 9,6) : whoosh qui monte, arpège scintillant
whoosh(8.2, 9.6, 380, 9500, 0.8, 0.46, courbe=0.8, tail=0.35)
arp = ["A4", "C5", "E5", "A5", "C6", "E6", "A5", "E5"]
for k in range(10):
    t0 = 8.4 + k * 0.17
    cloche(t0, hz(arp[k % len(arp)]) * (2 if k >= 8 else 1), 0.045 + 0.007 * k, -0.7 + 0.15 * k, long=0.9)
accord(8.5, 10.4, ["A4", "E5", "A5"], 0.12, fc=3600, fondu=1.0)  # voile lumineux qui s'élève

# ------------------------------------------------------------------ 8) quatrième mapping, la trame de points (10,8 - 12,2) : pulsations douces
whoosh(10.8, 12.2, 220, 3400, 1.0, 0.4, courbe=1.2, tail=0.3)
pas = 0.5
for k in range(int((12.7 - 10.8) / pas) + 1):
    t0 = 10.8 + k * pas
    tr = T - t0
    mk = tr >= 0
    tick = np.zeros(N)
    tick[mk] = highpass(rng.normal(size=int(mk.sum())), 5000) * np.exp(-tr[mk] / 0.018) * 0.12
    add(tick, 0.4 if k % 2 else -0.4, send=0.2)
    f = hz("A1") if k % 2 == 0 else hz("E2")
    pl = np.zeros(N)
    pl[mk] = np.sin(2 * np.pi * f * tr[mk]) * np.exp(-tr[mk] / 0.35) * 0.3 * GARDE
    add(lowpass(pl, 220), 0.0, send=0.2)
    if k % 2 == 1:
        cloche(t0 + 0.25, hz(["E5", "G5", "A5", "D6"][(k // 2) % 4]), 0.04, 0.5 if (k // 2) % 2 else -0.5, long=0.8)

# ------------------------------------------------------------------ 9) la fin : une dernière note, la nappe retombe
cloche(12.9, hz("A5"), 0.07, 0.0, long=3.0)
cloche(13.0, hz("E5"), 0.045, 0.2, long=3.0)

# ------------------------------------------------------------------ réverbération de salle (les envois, 2,8 s)
ir_len = int(2.8 * SR)
tir = np.arange(ir_len) / SR
ir = []
for c in range(2):
    b = rng.normal(size=ir_len) * np.exp(-tir / 0.85)
    b = lowpass(b, 6500)
    b *= np.minimum(1, tir / 0.03)
    ir.append(b / np.sqrt(np.sum(b**2)))
wet = np.stack([signal.fftconvolve(reverb_send[c], ir[c])[:N] for c in range(2)])
mix = stereo * 0.82 + wet * 0.95
if LIGHTS:
    raw = subprocess.run([FFMPEG, "-v", "error", "-i", LIGHTS, "-t", str(DUR + 1), "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    mus = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).T
    d = int(DECALAGE * SR)
    seg = np.zeros((2, N), dtype=np.float32)
    n = min(N - d, mus.shape[1])
    seg[:, d : d + n] = mus[:, :n]
    mix = mix + seg * 0.5

# ------------------------------------------------------------------ finition : fondus, compression douce, niveau
fade = smooth(0.0, 0.35) * (1 - smooth(13.35, 14.0))
mix *= fade
mix = np.tanh(mix * 1.15) / np.tanh(1.15)
pic = np.max(np.abs(mix))
mix = mix / pic * 0.89
wav = OUT / f"vitra-lightscape-teaser-musique{SUFFIXE}.wav"
wavfile.write(wav, SR, (mix.T * 32767).astype(np.int16))
print("wav", wav, "pic", round(float(pic), 3))

mp3 = OUT / f"vitra-lightscape-teaser-musique{SUFFIXE}.mp3"
subprocess.run([FFMPEG, "-y", "-v", "error", "-i", str(wav), "-c:a", "libmp3lame", "-b:a", "224k", str(mp3)], check=True)
print("mp3", mp3)

video = ROOT / "public" / "reel" / "teaser-14s-1080x1920.mp4"
if video.exists():
    avec = OUT / f"teaser-14s-1080x1920-avec-son{SUFFIXE}.mp4"
    subprocess.run([FFMPEG, "-y", "-v", "error", "-i", str(video), "-i", str(wav), "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", str(avec)], check=True)
    print("vidéo avec son", avec)
