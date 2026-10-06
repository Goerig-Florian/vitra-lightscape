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

---

# Prompt complet en anglais (à coller dans le générateur, avec les images de référence jointes)

Create a professional, highly realistic and immersive vertical 9:16 Instagram Reel for the communication campaign of **Vitra Lightscape**.

I am attaching several reference images of the project. **Use them as the main visual references to build the sets, architecture, light installations, colours and overall mood of the video.** The buildings and spaces in the video must be directly inspired by the buildings and environments in my references. Do not create a generic light festival or an invented futuristic city: I want to recognise the architectural world of the **Vitra Campus**.

## Intention
The video must feel like a real advertising campaign shot during Vitra Lightscape: professional, premium, cinematic, architectural, spectacular but credible, extremely photorealistic, human and alive. It is **not** an amateur phone video: well-composed frames, fluid camera moves, depth, controlled light, rhythmic editing, architectural details and genuine moments of visitors. In a few seconds it must convey what you discover, what you feel and what you live during Vitra Lightscape.

## Visual direction
Set entirely **at night at the Vitra Campus**. Follow the art direction of my references: deep midnight blue, electric-blue light as the common thread, warm yellow / orange / gold accents, real architecture enhanced by light, projections and mappings integrated into the buildings, realistic light reflections on the ground and glass, an elegant contemporary night atmosphere. Strictly avoid a cyberpunk, sci-fi or theme-park look. Light must **reveal the architecture**, not hide it behind effects.

## Sequence

**Shot 1 – Entering Lightscape.** Elegant opening shot of the Vitra Campus at nightfall. The camera slowly moves toward the site. Visitors walk naturally. On the ground, the **blue line of light**, the central element of Vitra Lightscape, appears and crosses the frame; the camera starts to follow it. Instant sense of curiosity and discovery.

**Shot 2 – Follow.** More dynamic. The camera follows the blue line between visitors as it winds through the Campus toward a first building. Illuminated architecture appears progressively in the distance. The blue light must feel truly embedded in the ground and environment, with natural reflections.

**Shot 3 – Discover.** The camera rises to reveal an emblematic building of the Vitra Campus, faithfully reproduced from my reference images. The building is transformed by an elegant light mapping: lines, luminous textures and blue projections with a few yellow/gold touches that follow its exact geometry, as if really projected. No floating or impossible light effects. The viewer understands: we rediscover architecture through light.

**Shot 4 – The phone.** Very important human shot. Front or three-quarter view of a visitor looking at the illuminated building. The person naturally takes a smartphone out of a pocket and raises it to photograph the building. The camera moves slightly closer. The phone screen is clearly visible and shows exactly the illuminated building in front of the person, with a perspective consistent with their position. They adjust the framing slightly, then take the photo, with a very light natural screen feedback. No deformed phone, no abnormal fingers, no futuristic interface, no incoherent screen. Extremely realistic, as if shot with real actors.

**Shot 5 – Feel.** More immersive. The camera enters with visitors an installation where light, architecture and space blend; projections slowly evolve around them. Some visitors look up, others observe details or talk. No exaggerated reactions. Convey wonder, curiosity, contemplation, discovery. The camera can pass behind a silhouette, then reveal a new light installation.

**Shot 6 – Interact.** A real interaction. A person approaches a light installation; when they pass a hand or their body in front of it, the projections react subtly to the movement, following or slightly transforming the gesture. Immediately understandable but elegant. No particle explosion, no magical effect: Vitra Lightscape stays linked to design, architecture and experience.

**Shot 7 – Explore.** Back outside. A wider shot of several visitors continuing to follow the blue line between buildings. Lightscape is a **route**, not a single installation: several transformed spaces and architectures are visible in the depth. Show different audiences naturally: young adults, couples, groups of friends, families, accompanied children, architecture enthusiasts. Nobody looks at the camera.

**Shot 8 – The big building (hero shot).** Arrival in front of one of the most spectacular buildings. Start on an architectural detail, then a camera move gradually reveals the whole building. The mapping intensifies: dominant blue crossed by a few warm yellow/gold lights. The audience appears in silhouette in the foreground. Light reflects on the ground. This is the **hero shot** of the video and must make people stop scrolling.

**Shot 9 – Human finale.** Wide shot of the building and visitors. A person lowers their phone after taking a photo, a child follows the line of light, a group continues toward the next installation. The camera stays a few seconds to show the event is truly lived by the public. (No text in the generated video: title, date and tagline are added in editing.)

## Direction
Premium communication campaign for a major cultural institution or design brand. Use fluid camera moves, tracking shots, wide architectural shots, close human shots, details of light and material, foreground/background for depth, a few transitions created by a person or architectural element passing in front of the lens, precise rhythmic editing, and changes of scale between monumental architecture and human details. The camera must feel physically present on the Campus.

## Photorealism
Absolute priority to realism. People: correct anatomy, realistic hands, natural movement, sober contemporary clothing, credible faces, coherent interactions. The phone: correct proportions, natural grip, coherent screen, realistic reflection on the glass, screen content perfectly synchronised with the building actually photographed. Buildings must keep their proportions, materials, geometry and architectural identity. **Always use my reference images whenever the corresponding building appears.** Never replace a real building from my references with a randomly generated architecture.

## Avoid absolutely
Obvious AI look, generic invented architecture, cyberpunk universe, multicoloured neon, EDM festival, amateur camera, UGC video, shaky movement, excessive drone shots, cliché slow motion, frozen characters, cloned crowd, identical faces, deformed hands, deformed phone, incoherent phone screen, people looking at the camera, over-acted reactions, unrealistic light, projections floating in the air without support, fantasy effects, deforming architecture, overload of effects, any text, logo or watermark.

The result must look like a genuine official advertisement for Vitra Lightscape, not a demonstration of AI video generation. The feeling: **"I see the event. I understand what I can live there. And I want to be there."**
