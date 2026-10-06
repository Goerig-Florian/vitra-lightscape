# Reel « vécu » Vitra Lightscape : kit pour un générateur vidéo IA

Document de travail (interne). Un Reel photoréaliste avec des acteurs et un téléphone filmé ne se fabrique pas en code : il faut un générateur vidéo
(Veo, Sora, Runway, Kling, etc.) qui accepte des **images de référence**. Ce fichier prépare le travail : quelles images donner à chaque plan,
et un prompt par plan, à générer séparément (5 à 8 s) puis à monter (Premiere / CapCut).

## Avant de lancer

- **Date : à corriger.** Le brief dit « 17 — 18 SEPTEMBRE 2026 ». Le site, le programme et les affiches disent **17 et 18 septembre 2027**.
  La vidéo d'équipe « teaser-6s » dit « 17 — 18 MAI 2027 ». Choisir une date unique et l'écrire dans le montage (jamais dans le prompt : les IA écrivent mal le texte).
- **Le texte (VITRA. Lightscape, la date, SUIVEZ LA LUMIÈRE.) se pose au montage**, avec le vrai logo du projet (`src/assets/logo/vitra-lightscape.svg`). Demander à l'IA « no text, no logo ».
- **Vertical 9:16**, 5 à 8 s par plan, même seed / même description de style sur tous les plans pour garder la cohérence.
- **Plan 4 (le téléphone) est le plus risqué** : mains et écran. Le générer plusieurs fois, garder le meilleur. Option plus sûre : filmer ou générer le plan sans écran lisible
  et incruster la photo du bâtiment sur l'écran au montage (suivi de mouvement).

## Images de référence à fournir (déjà dans le projet)

| Plan | Images à donner à l'outil |
|------|---------------------------|
| 1, 2, 7 (entrée, suivre, explorer) | `mapping-sources/campus-vue-aerienne.webp` (vue du Campus, chemin bleu) et `public/photos/vitrahaus-nuit.webp`, `public/photos/dome-nuit.webp` |
| 3, 4, 8, 9 (découvrir, téléphone, grand bâtiment) | `mapping-sources/musee-faisceaux.webp` (musée, faisceaux blancs) et `public/photos/design-museum-nuit.webp` ; pour la variante chaude `mapping-sources/halle-ondes-orange.webp` |
| 5, 6 (ressentir, interagir) | `mapping-sources/interieur-volutes.webp` (volutes bleu-violet dans la halle) |
| Variante halle ronde | `mapping-sources/halle-cercles-violets.webp` |

Règle à donner dans chaque prompt : « reproduce the building from the reference image exactly, same proportions, materials and geometry; only the light projection changes ».

## Bloc de style (à coller au début de CHAQUE prompt)

> Photorealistic cinematic commercial, vertical 9:16, shot on a high-end cinema camera with anamorphic lenses, smooth stabilised gimbal movement, night at the Vitra Campus
> in Weil am Rhein. Deep midnight-blue environment, electric-blue guiding line of light on the ground as the common thread, small warm yellow / orange / gold accents.
> Real architecture revealed by light, projections mapped precisely onto the building surfaces, natural reflections on wet stone and glass.
> Premium, elegant, contemporary, architectural. Natural people, correct anatomy and hands, sober contemporary clothes, nobody looks at the camera.
> No text, no logo, no cyberpunk, no neon rainbow colours, no festival look, no floating projections, no distorted architecture, no handheld shake, no cloned crowd.

## Un prompt par plan

1. **Entrer dans Lightscape (0 – 1,5 s).** Slow push-in toward the Vitra Campus at dusk, visitors walking naturally, a thin electric-blue line of light on the ground crosses the frame, the camera starts to follow it.
2. **Suivre (1,5 – 3 s).** The camera glides low along the blue line between visitors, the line winds across the Campus with soft reflections, illuminated buildings appear in the distance.
3. **Découvrir (3 – 4,5 s).** The camera tilts up to reveal the building from the reference image, its façade covered by an elegant mapping of blue lines with a few gold touches that follow its exact geometry, as if truly projected.
4. **Le téléphone (4,5 – 6,5 s).** Three-quarter shot of a visitor pulling a smartphone from a pocket, raising it to photograph the illuminated building, the camera moves slightly closer, the phone screen shows the same building with coherent perspective, the person adjusts the framing and takes the picture, a subtle natural screen flash. Correct hands, undistorted phone.
5. **Ressentir (6,5 – 8 s).** The camera walks in with visitors into an installation where light and architecture merge, slow projections evolving around them, some look up, others discuss, understated reactions, the camera passes behind a silhouette to reveal a new installation.
6. **Interagir (8 – 9,5 s).** A person approaches a light installation and passes a hand in front of it, the projection reacts subtly and follows the gesture, readable but elegant, no particle explosion.
7. **Explorer (9,5 – 11 s).** Wide shot back outside, many visitors (young adults, couples, friends, families, children with parents, architecture lovers) follow the blue line between buildings, several transformed architectures in the depth, nobody looks at the camera.
8. **Le grand bâtiment, plan héros (11 – 13,5 s).** Start on an architectural detail, then a camera move gradually reveals the whole building from the reference image, the mapping intensifies in dominant blue crossed by warm gold light, the audience in silhouette in the foreground, reflections on the ground.
9. **Final humain (13,5 – 16 s).** Wide shot of the building and visitors: a person lowers a phone after taking a photo, a child follows the line of light, a group walks on toward the next installation, the camera stays a few seconds, then fades.

## Montage

Ajouter au montage : le logo du projet, la date (voir plus haut) et « Suivez la lumière. » ; la musique du teaser est dans `exports/musique/` (voir `scripts/make-musique.py`).
