# Divine × Blockhaus — Implementation Master Plan

Status: Planning baseline (no production source code changed in this commit)
Repository: `Emtechnical/divine-foam-3d`
Reference: `reference/PASTE_BLOCKHAUS_PROMPT_HERE.md`
Live site: https://emtechnical.github.io/divine-foam-3d/

## 1. Mission and non-negotiables

Build a premium, immersive, scroll-led 3D brand experience for Divine Foam & Mattress, Nadiad, Gujarat. Blockhaus is the interaction, motion, rendering and craft benchmark; Divine's real identity, products, assets, language and business facts remain the source of truth.

- Follow the Blockhaus prompt's actual systems and verification intent, not merely its visual mood.
- Port techniques into the existing React 19 + Vite + TypeScript + Three.js 0.180 + React Three Fiber 9 + Drei 10 + GSAP architecture. Do not paste its single-file Three.js 0.169 implementation wholesale.
- Preserve the existing working site and deploy pipeline. Make small, reviewable commits with a successful production build at each milestone.
- Use procedural, genuinely interactive Three.js geometry for 3D scenes. Do not pass AI-generated stills off as interactive 3D.
- Use the supplied Divine photographs as photographs, clearly distinguished from procedural 3D material studies.
- Keep the whole experience in the transparent/glass visual direction requested by the owner, with Divine plum, champagne, warm bone and restrained accent colours.
- Keep English/Gujarati whole-site switching and a persistent return-to-home control.
- No invented specifications, prices, warranties, certifications, manufacturing claims, delivery/installation services, exclusivity or unverified stock claims.
- Public-facing use of the storefront and personal/event photographs remains subject to owner approval.

## 2. What the Blockhaus reference actually specifies

The supplied reference is a complete, long-form single-page implementation spec with these major systems:

1. A designed page shell, typography, design tokens, dark rounded hero window, notch treatment and responsive chrome.
2. A loader with rolling 000–100 digits, staged block drops, wipe and curtain; bounded patience/watchdog behaviour.
3. A hero toybox: separate Three.js renderer, five procedural toy shapes/materials, 62 desktop / 34 phone bodies, sphere colliders, a custom one-step solver, cursor sphere, drag shove, click burst/flash/return, shadows and GTAO.
4. Two page-space flat twisted paper ribbons, scroll-drawn and reversible, with a moving project rider.
5. A finale with its own scene/lights, 58 ordered target poses, scroll-scrubbed assembly/un-assembly, orbiting storm, halo/bloom, kinetic words, counter and orange flood into the footer.
6. A growing reel card with riding words, poster/video, cursor-following play control and accessible player open/close behaviour.
7. Work grid, index/peek interactions, hover image treatment, navigation/menu, ticker, anchor scrolling, reveals, letter roll, header and progress gauge.
8. A shared scroll animation loop, resize handling and rendering only near/in view.
9. Phone/tablet-specific body counts, DPR, shadows, FOV, scene dimensions, layout, touch behaviour and no-horizontal-overflow requirements.
10. No-WebGL still states, caught dynamic-import failure, a 10-second watchdog, bounded loader, reduced-motion rules and no-JS behaviour.
11. A final verification checklist covering loading, interactions, scroll reversal, mobile, console errors and failure modes.

The reference's Blockhaus copy, studio identity, fictional portfolio, Lisbon/Hong Kong addresses, emails, toys, key art, reel and hosted media are not Divine assets and must not be reused as Divine facts or branding.

## 3. Translation map: Blockhaus systems → Divine experience

| Blockhaus system | Divine adaptation | Implementation direction |
|---|---|---|
| Toybox hero + physics pile | A tactile material universe: foam blocks, textile swatches, soft forms and material samples | Dedicated R3F Canvas; procedural geometry/materials; lightweight custom collider/impulse interaction or a carefully profiled physics library |
| Cursor sphere / burst | Cursor/finger pushes material samples; tap/click creates a controlled material ripple or separation burst | Pointer events, raycasting, damped impulses; touch-safe with vertical page scrolling retained |
| Twisted paper ribbons | Layered fabric/foam ribbons travelling through the brand story | Procedural BufferGeometry ribbon meshes in page/world space, scroll-scrubbed and reversible |
| Showreel growth | Divine material film / real-photo editorial reveal | Video only if a real/licensed Divine film is supplied; otherwise use a photo-led editorial stage with animated 3D material transition |
| Work grid + index peek | Product/material catalogue with real supplied photos and clear category details | Accessible cards, photo crops, hover/focus states, category-specific enquiry links |
| 58-piece house finale | Mattress/material stack assembly: textile cover, foam layers, padding and structural layers | Dedicated finale scene with explicit target transforms and scroll-scrubbed assembly; only depict layers as illustrative, not exact product construction unless verified |
| Storm / halo / orange flood | Floating foam/fibre particles and a Divine champagne/plum light field that resolves into the brand end card | InstancedMesh/points; capped particle count; restrained post-processing and graceful low-power mode |
| Loader | Divine monogram/material glyph assembly | CSS/SVG-first loader with real milestones, watchdog and timeout; never block page content indefinitely |
| Chrome / ticker / gauge | Divine navigation, enquiry CTA, locale switch, home control and scroll progress | React state + accessible controls; avoid fictional booking ticker or fake live data |
| Reduced-motion / no-WebGL | Static hero and finale compositions with all copy, links and photos still available | Feature detection, static fallback, reduced-motion path and lazy scene activation |

## 4. Existing code baseline and immediate issues

Current stack confirmed from repository:
- React 19, Vite 7, TypeScript 5.9.
- Three.js 0.180, React Three Fiber 9, Drei 10, GSAP 3.14.2.
- GitHub Pages deployment via `.github/workflows/deploy.yml`, Vite base `/divine-foam-3d/`.

Existing source:
- `src/App.tsx`: site shell, language toggle, nav, contact details, categories and sections.
- `src/content.ts`: English/Gujarati copy.
- `src/three/MaterialScene.tsx`: existing procedural foam-layer hero.
- `src/three/CinematicShowroom.tsx`: existing six-chapter sticky showroom and procedural material models.
- `src/Atmosphere.tsx`: lightweight canvas atmosphere.
- `src/styles.css`: current visual system and responsive styles.

Audit findings to address before major visual work:
1. Logo path mismatch: App currently requests `/divine-foam-3d/assets/divine-logo.png`, but the repository asset is `public/assets/photos/DIVINE_LOGO.png`. Correct the path using the Vite base-safe public asset convention.
2. The category data still has empty image fields, so real supplied photos are not wired into the catalogue.
3. The current showroom's foam, mattress, fabric, Recron, rebond and adhesive geometry is a first prototype, not yet the Blockhaus-level scene/interaction system.
4. The current page CSS still reads as a light editorial site in many sections; the requested transparent glass/cinematic treatment is not yet consistent end-to-end.
5. GSAP is installed but the inspected scene/page has not yet been upgraded to a coordinated GSAP scroll timeline architecture.
6. Existing canvas scenes need explicit lifecycle/performance review: pause when offscreen, cap DPR/particle counts on mobile, dispose resources and provide no-WebGL fallback.
7. Confirm all internal image URLs use the configured Vite base path correctly.
8. The reference file begins with a pasted note/placeholder before the actual Blockhaus build spec. It is readable and harmless, but should be cleaned into a clearly labelled reference document after preserving the original content.

## 5. Divine asset map

Assets currently present in `public/assets/photos/`:

| File | Intended placement | Guardrail |
|---|---|---|
| `DIVINE_LOGO.png` | Header, loader/end card where appropriate | Official mark: use unchanged; no redraw, recolour, crop or distortion |
| `MATTRESS_CUSHION.png` | Mattress/cushion category and editorial section | Keep source photo recognisable; remove only surrounding frame/caption if a clean derivative is made |
| `EPE_REBONDED.jfif` | Rebonded foam section | Label as rebonded foam; do not call it an EPE sheet |
| `SOFA_FABRIC.png` | Fabric/textile section | Use for sofa fabric visual reference |
| `RECRON_PADDING.png` | Recron/padding section | Preserve the actual material appearance |
| `LINING_WORK_HARDWARE.png` | Lining-work hardware section | Do not infer every pictured item is an individually confirmed SKU |
| `MATTRESS_TYPES.png` | Optional material/grade reference | Names visible in image (HR32, PU32, PU40, HR40, Softy32, Latexfoam, Hypersoft, Coolgel) need owner confirmation before product-grade claims |
| `DIVINE_OUT_LOOK.png` | Possible store introduction | Do not publish until owner approves |
| `photo_2023-12-25_20-47-55.jpg` | Not assigned | Personal/event photo; exclude until explicit approval |
| `photo_2023-12-25_21-12-07.jpg` | Not assigned | Personal/event photo; exclude until explicit approval |

Image handling requirements:
- Build a documented asset manifest with alt text, section, crop/focal point, and approval status.
- Prefer source originals; make web-optimised derivatives only when necessary and retain the originals.
- Do not bake captions or rounded frames into the photo; use CSS layout and object-position.
- Avoid using an image as a 3D texture unless it adds value and can be loaded without cross-origin/deployment issues.
- Keep genuine photos and procedural 3D renders visually distinct in the UI.

## 6. Business truth and content rules

Use verified business information only:
- Brand: Divine Foam & Mattress.
- Location: Pij Road, near MF Furniture, Nadiad, Gujarat 387002 (confirm postcode before any map/directions embed because an earlier map pin showed a postcode discrepancy).
- Phone/WhatsApp: +91 97244 15440; WhatsApp URL: https://wa.me/919724415440.
- Email: divinesleepsol@gmail.com.
- Products/materials: PU Foam, HR Foam, Bonded Foam, Soft Foam, Hard Foam, Memory Foam; mattresses and mattress/cushion materials; EPE Armour Sheet; Rebonded Foam; Mattress Fabric; Sofa Fabric; Recron Padding; sprayable and non-sprayable adhesives; FoamFix, 5in1, FastTack, Fevicol/Pidilite products; stapler pins and other lining-work hardware.
- Brands supplied: Kurl-On, Prime Comfort, Jindal, Flexipol/Resiflex, Pidilite/Fevicol. Authorized dealer claim only for Pidilite/Fevicol.
- Cumulative figures previously supplied: 43,200+ sq ft Comfort; 20+ metric tonnes Foam; 600+ litres Adhesive; 2,500+ metres Mattress Fabric; 700+ metres Recron. Verify with owner before prominently publishing as current stats.

Do not imply Divine manufactures products, offers custom cutting/installation/delivery, or holds any certification/warranty unless confirmed.

## 7. Visual and interaction direction

- Overall: full-page transparent/glass visual language; deep plum/near-black base, champagne highlights, warm bone surfaces, subtle translucency and restrained luminous accents.
- Use real depth: camera parallax, light response, soft contact shadows, surface roughness/normal detail, controlled reflections and physically plausible foam compression/stack separation where feasible.
- Typography: editorial, high-contrast display headlines paired with a legible sans/mono utility system; Gujarati fallback must be tested at all breakpoints.
- Motion: smooth, intentional, scroll-scrubbed and reversible; no gratuitous constant spinning. Motion must explain a material or move the story forward.
- Navigation: visible locale toggle and home control; keyboard accessible, touch-friendly, focus-visible.
- Enquiry: contextual WhatsApp links should prefill the actual category name, plus direct call/email.
- Audio: default silent; no autoplay sound.

## 8. Implementation phases and gates

### Phase 0 — Baseline and safety
- Confirm current default branch, deployment status and clean production build.
- Preserve a known-good commit before changing the site.
- Correct the logo URL and confirm all public asset paths resolve.
- Keep the reference document out of the production bundle.

Gate: production build passes; current public site still loads.

### Phase 1 — Content and asset integration
- Add a typed asset manifest and wire all approved product photographs into the correct catalogue/story sections.
- Keep the logo original.
- Improve photo framing, edge cleanup through layout (not destructive edits), captions and alt text.
- Ensure English and Gujarati copy is paired for all new content.
- Confirm approval for store and personal/event photos before publishing.

Gate: every displayed factual product image and label is correctly mapped; no unapproved personal photo.

### Phase 2 — Shared motion and page shell
- Introduce a single coordinated scroll-progress source and GSAP timelines where appropriate.
- Establish global glass design tokens, header/menu behaviour, page progress gauge, loader and anchor scrolling.
- Ensure header, home button, locale switch and CTAs work on desktop/mobile.
- Avoid multiple competing RAF loops or independent scroll listeners where one shared driver can be used.

Gate: navigation, scrolling, language switching and reduced-motion work without console errors.

### Phase 3 — Hero material playground
- Replace the static-feeling hero interaction with a custom procedural material toybox inspired by Blockhaus's physics pile.
- Build a small set of reusable foam/fabric/adhesive forms and colliders.
- Add pointer shove/drag and tap burst, with damped motion and predictable reset.
- Profile the number of bodies and shadows; mobile tier uses a lower count and capped DPR.

Gate: interaction feels responsive, scene settles, touch does not trap vertical scrolling.

### Phase 4 — Scroll-driven material ribbons and story
- Build custom twisted ribbon geometry that draws/undraws with scroll.
- Use the ribbons to connect real material categories and photographic moments.
- Add the material study chapters with deliberate camera moves and crossfades.
- Keep active scene count limited; only render when near viewport.

Gate: scroll forward/backward produces deterministic reversible transitions.

### Phase 5 — Divine material finale
- Create a separate finale scene with explicit target transforms for the mattress/material stack.
- Scrub from separated layers into a resolved stack; reverse cleanly when scrolling up.
- Add a restrained orbiting fibre/foam particle field and a halo/light bloom only where performance allows.
- Finish with Divine identity, verified business CTA and footer transition.

Gate: end state communicates Divine, not Blockhaus; no invented mattress construction claims.

### Phase 6 — Catalogue, reel/editorial and chrome
- Integrate image-led catalogue and index/peek interactions.
- Add a reel only if the owner supplies a real/licensed Divine video; otherwise build a photo-led editorial sequence rather than borrowing Blockhaus video.
- Complete header hide/reveal, mobile menu, focus states, scroll gauge, footer interactions and WhatsApp enquiry details.

Gate: all links and controls function; no fictional portfolio, addresses, ticker data or media.

### Phase 7 — Hardening and release
- No-WebGL fallback, blocked import handling, watchdog, bounded loader, reduced-motion and no-JS behaviour.
- Test at 1440×900, 1024×768, 390×844 and a narrow 320px viewport.
- Check no horizontal overflow, keyboard navigation, image loading, console/network errors, memory/resource cleanup and mobile thermal/performance behaviour.
- Run `npm run build`, inspect GitHub Actions and verify the deployed GitHub Pages URL after each release.

Gate: build and deployment green; all key flows verified on desktop and mobile.

## 9. Acceptance checklist

- [ ] Official logo loads from the actual repository path and remains unmodified.
- [ ] Every public photograph is an approved Divine asset with correct label, crop and alt text.
- [ ] No fictional Blockhaus copy, project names, contact details, address or external portfolio media appears.
- [ ] Transparent/glass theme is consistent across all sections, not only the hero.
- [ ] Hero has real interactive 3D behaviour, not a static image pretending to be 3D.
- [ ] Ribbons draw and reverse with scroll.
- [ ] Finale assembles and reverses with scroll.
- [ ] 3D scenes pause outside viewport and mobile quality is adaptive.
- [ ] Loader cannot hang indefinitely; no-WebGL and blocked-import fallbacks work.
- [ ] Reduced-motion path remains complete and usable.
- [ ] English/Gujarati toggle covers all new copy and accessible labels.
- [ ] Return-to-home control remains available.
- [ ] WhatsApp, phone, email and address details are correct.
- [ ] No unsupported business claims or unverified material grades.
- [ ] No horizontal overflow or console errors at target viewport sizes.
- [ ] Production build and GitHub Pages deployment succeed.

## 10. Immediate next execution order

1. Fix and verify the logo/public asset path.
2. Add the typed asset manifest and wire the approved real product photos into the catalogue.
3. Refactor shared scroll progress and viewport-aware scene lifecycle before adding more 3D complexity.
4. Implement the Blockhaus-inspired hero interaction as a separate, reusable scene.
5. Add the ribbon sequence and mattress/material finale.
6. Apply the global glass design system and finish responsive/accessibility/failure handling.
7. Run the full verification checklist and deploy.

This document is the working master plan. Any change to scope, factual content, asset approval or technical architecture should be recorded here before implementation.
