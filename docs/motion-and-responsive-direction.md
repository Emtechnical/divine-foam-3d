# Divine Foam & Mattress — Responsive and Motion Design Direction

**Figma:** https://www.figma.com/design/HnwWY5MWdT9f1REF8Cucd4  
**Repository:** Emtechnical/divine-foam-3d  
**Status:** Desktop homepage concept, mobile homepage concept, and six-scene motion storyboard created in Figma.

## Creative ambition

The website must not feel like a static page decorated with 3D images. The 3D scene is part of the interface and should respond to the visitor. Aim for the visual confidence and craft of contemporary interactive product/brand experiences, while keeping the business catalogue and enquiry journey clear.

## Motion storyboard

1. **Arrival — material studio:** a sculptural material form in a softly lit 3D environment; subtle idle movement and cursor-responsive parallax.
2. **Scroll — camera choreography:** scroll progress moves the camera around the object and reveals the material story. Motion should be eased and intentional, not a forced-scroll gimmick.
3. **Reveal — exploded layers:** material layers separate, hold in a readable exploded arrangement, then reassemble as the story continues. Final materials and construction must be based on confirmed assets and facts.
4. **Touch — material exploration:** hover/tap highlights a material, rotates/focuses the object and reveals its category details. Touch devices use tap-to-focus; essential information must never be hover-only.
5. **Transition — category journey:** camera, light and material shape transitions connect sections. Global navigation, Home and language controls remain stable.
6. **Convert — enquiry:** the motion resolves into a calm, high-contrast enquiry action. Carry selected category context into WhatsApp/form enquiry where feasible.

## Responsive design

A 390px mobile homepage concept has been created. It keeps the editorial headline, material hero, category cards, business paths, brands, metrics and enquiry CTA while stacking content vertically.

Mobile interactions should use touch-first tap states and a lighter 3D quality tier. The global Home and English / Gujarati controls remain accessible.

## Design and colour direction

Retain the current warm paper / plum / ink foundation, but keep refining the balance. Use cyan, sunshine yellow and royal blue as material accents, not as uncontrolled decoration. Strong 3D lighting, depth and restrained contrast should create the premium feel. Validate the palette against the original logo when the actual asset is supplied; never alter the logo.

## Implementation direction (when we move from design to the live site)

Recommended stack already planned: React + Vite, Three.js / React Three Fiber / Drei, GSAP with ScrollTrigger, Tailwind CSS, deployed as a static GitHub Pages site.

Potential runtime behaviours:
- Real-time pointer parallax and object rotation with bounded movement.
- Scroll-triggered camera path and exploded-view sequence.
- Raycast/pointer interaction for material selection.
- Smooth route/page transitions and shared navigation.
- Context-aware WhatsApp enquiry.
- Adaptive render resolution, reduced effects on low-power devices, lazy-loaded 3D assets.

The Figma storyboard communicates intended motion; Figma itself is not the running 3D experience. The live implementation is where real-time 3D, physics-like transitions, pointer response and scroll choreography will be built.

## Performance, accessibility and reliability

- Target smooth 60fps on capable hardware; do not promise 60fps on every device.
- Respect `prefers-reduced-motion` and provide a genuinely usable reduced-motion experience.
- Do not hijack scrolling or trap keyboard/touch navigation.
- Lazy-load heavy 3D assets and use compressed textures and optimized geometry.
- Provide mobile and low-power quality tiers, with static/2D fallbacks.
- Keep all copy, product details, forms, navigation and enquiry actions accessible without interacting with 3D.
- Maintain stable Home navigation and site-wide English / Gujarati parity.

## Content accuracy guardrails

The 3D layer illustration is a visual concept, not a technical mattress specification. Never invent material layer order, densities, performance claims, product properties, manufacturing services or warranties. Use only confirmed Divine Foam & Mattress supply categories and verified owner-supplied product imagery.

## Next steps

1. Continue refining the Figma desktop/mobile layouts and design system.
2. Build reusable interface components and page concepts.
3. Obtain and classify the actual owner image archive; preserve the original logo.
4. Design remaining pages and complete the bilingual content map.
5. Implement the live 3D experience and test on desktop/mobile before launch.
