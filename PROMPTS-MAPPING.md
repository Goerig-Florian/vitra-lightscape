# Variantes « mapping » des 31 bâtiments : consignes de génération

Document de travail (interne). Le principe : pour chaque bâtiment, on part de **sa photo de nuit actuelle**
(`public/photos/<id>-nuit.webp`) et on génère une variante avec un mapping lumineux **différent** sur les façades.
La caserne garde ses flammes (déjà faite, rien à générer).

## Comment procéder

1. Donner à l'outil IA la photo de nuit du bâtiment (même cadrage) **et** la consigne commune ci-dessous + la ligne du bâtiment.
2. Enregistrer chaque résultat dans un dossier `photos-mapping/` (non versionné) sous le nom `<id>.png` (ex. `dome.png`).
3. Me dire quand c'est prêt : je les optimise, les nomme `<id>-mapping.webp` (nouveau nom, pour éviter le cache) et je les branche dans les fiches.

## Consigne commune (à coller avant chaque ligne)

> Photo d'architecture de nuit. Garder EXACTEMENT le même bâtiment, le même cadrage, le même ciel, les mêmes personnes et les mêmes
> chemins lumineux blancs. Ajouter uniquement un mapping vidéo (projection de lumière) sur les surfaces du bâtiment, calé sur ses plans
> et ses volumes, avec une lumière réaliste qui se reflète légèrement au sol. Pas de texte, pas de logo, pas de nouveau bâtiment.
> Rendu photographique, haute résolution, même format que la photo d'origine.

## Un mapping différent par bâtiment

Les références que tu m'as données : filaments blancs rayonnants (musée), flammes (caserne), ondes orange (halle brique),
tourbillons bleu-violet (intérieur), lignes bleues (halles de nuit), cercles violets concentriques (halle ronde), géodésique ambrée (dôme).
On évite de dupliquer ces six-là sur les autres bâtiments : on décline autour.

| # | id | Bâtiment | Mapping à demander |
|---|----|----------|--------------------|
| 1 | `vitrahaus` | VitraHaus | Empilement de lignes dorées qui montent d'étage en étage, comme des maisons qui s'allument une à une |
| 2 | `ring-ruisseau` | Ring et Ruisseau | Anneaux d'eau turquoise qui s'élargissent, reflets ondulants |
| 3 | `airstream` | Airstream Kiosk | Bandes chromées rose et cyan qui défilent, esprit néon rétro |
| 4 | `arret-bus` | Arrêt de bus | Pluie de petits points blancs et jaunes qui tombent lentement, comme des lumières de ville |
| 5 | `campus-gallery` | Vitra Campus Gallery | Grille de pixels qui se remplit en dégradé rouge-orangé, façon écran de galerie |
| 6 | `water-garden` | Water Garden | Ondes vert émeraude et bleu, caustiques de lumière sur l'eau et les parois |
| 7 | `design-museum` | Vitra Design Museum | Faisceaux blancs rayonnants depuis quelques foyers (voir ta référence), pointillés sur les toitures |
| 8 | `balancing-tools` | Balancing Tools | Lignes jaune vif qui oscillent comme un pendule, équilibre et contrepoids |
| 9 | `pavillon-ando` | Pavillon de conférences | Cercles concentriques blanc-bleu très sobres, calme, comme des ondes de voix |
| 10 | `doshi` | Doshi Retreat | Dégradé lent rose-corail vers violet, fumée de lumière sur les voûtes |
| 11 | `halle-gehry` | Halle de production (Gehry) | Lignes bleu électrique qui se plient et se froissent, esprit métal déformé |
| 12 | `halle-grimshaw-1981` | Halle de production (Grimshaw 1981) | Quadrillage technique bleu clair qui suit la structure, lignes de circuit |
| 13 | `halle-sanaa` | Halle de production (SANAA) | Cercles violets concentriques sur les façades arrondies (voir ta référence) |
| 14 | `halle-grimshaw-1983` | Halle de production (Grimshaw 1983) | Vagues bleues et points lumineux sur les murs (voir ta référence halles de nuit) |
| 15 | `schaudepot` | Vitra Schaudepot | Silhouettes de chaises et d'objets de design dessinées en lignes ambrées, comme des ombres de collection |
| 16 | `barragan` | Barragán Gallery | Aplats colorés façon Barragán : rose, orange, jaune, en grands blocs qui glissent |
| 17 | `place-prouve` | Place Jean Prouvé | Triangles et losanges blancs et bleu pâle, motif de tôle plissée, lumière tamisée |
| 18 | `caserne` | Caserne de pompiers | **Conservée : flammes** (aucune génération) |
| 19 | `designweg` | Vitra Designweg | Ligne de lumière blanche qui serpente le long du chemin, sans mapping sur façade |
| 20 | `torre` | Torre Numero Due | Fils verticaux rouges et orangés qui montent le long de la tour, comme des cordes de lumière |
| 21 | `halle-siza` | Halle de production (Siza) | Ondes orange sur la brique (voir ta référence), plus douces, en rythme lent |
| 22 | `promenade-siza` | Álvaro-Siza-Promenade | Lignes blanches parallèles qui défilent le long du mur, rythme de marche |
| 23 | `tour-toboggan` | Vitra Tour-Toboggan | Fils bleu glacé le long de la tour et du toboggan (voir ta référence) |
| 24 | `khudi-bari` | Khudi Bari | Motifs de tissage vert et or qui se tricotent sur la structure en bambou |
| 25 | `diogene` | Diogene | Un seul grand disque lumineux blanc chaud qui respire (petite maison, un seul geste) |
| 26 | `umbrella` | Umbrella House | Pluie de gouttes bleu-vert qui coule sur les toiles, parapluie de lumière |
| 27 | `station-service` | Station-service | Bandes de couleur jaune et rouge qui défilent, esprit enseigne de station des années 50 |
| 28 | `dome` | Dôme | Structure géodésique ambrée (voir ta référence), pulsation chaude |
| 29 | `tane` | Tane Garden House | Feuillages de lumière verte et dorée projetés, ombres de branches en mouvement |
| 30 | `oudolf` | Oudolf Garten | Particules multicolores légères sur les massifs, comme des graminées en lumière (pas de façade) |
| 31 | `blockhaus` | Blockhaus | Fissures de lumière blanche et rouge qui se dessinent sur le béton, énergie brute |

## Notes

- 18 (caserne) : on garde `torche-mapping.webp` / la visualisation flammes existante.
- 19, 30 : ce sont des paysages / chemins, pas des façades : le « mapping » reste très léger (ligne de lumière, particules).
- Les mentions « voir ta référence » renvoient aux 8 images que tu m'as envoyées : tu peux les redonner comme image de style à l'outil.
- Garder la mention « visualisation de projet » : ce sont des projections imaginées, pas une installation existante.
