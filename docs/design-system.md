# Divine Foam & Mattress — Design System & UX Specification

> Status: Initial design direction. This is a planning specification, not a final visual approval. The supplied Divine logo must remain unchanged.

## Project identity
- Official business name: Divine Foam & Mattress.
- Primary objective: a premium, immersive, product-led website that accurately presents the materials Divine supplies and converts visitors into WhatsApp or contact-form enquiries.
- Audience paths: B2B / wholesale buyers and retail customers.
- Do not imply that Divine manufactures furniture, mattresses or sofas, or offers custom cutting, delivery, installation or upholstery labour unless separately confirmed.

## Global navigation requirements
- Provide a persistent, clearly discoverable **Home** control on every page/route. It must return visitors to the website's first page (the homepage), not merely scroll to the top of the current page. On the homepage it may act as a return-to-top control.
- Provide a site-wide **English / ગુજરાતી** language switcher in the global navigation. It must switch the website's own interface and authored content, not rely on browser auto-translation.
- The language switcher must work across all pages and sections, including navigation, product/category content, buttons, forms, validation messages, contact details labels, and footer.
- Preserve the visitor's selected language when navigating between pages and, where technically appropriate, between visits.
- Use Gujarati-capable typography and test line wrapping, button widths, navigation layout and mobile responsiveness in both languages.
- The language control must remain easy to find on desktop and mobile. Avoid duplicating competing language controls.

## Visual direction
- Target: premium, modern, tactile, immersive and confident; visually memorable without sacrificing clarity, accessibility or loading performance.
- Use a restrained editorial layout for business information and product catalogues, contrasted with selected high-impact 3D scenes.
- Avoid making every section a heavy 3D scene. Use 3D where it explains material structure or creates a memorable brand moment.
- Use frosted-glass effects selectively for navigation and overlays; retain strong contrast and readable text.
- Keep page hierarchy clear, with generous spacing, consistent grid alignment and strong calls to action.
- Final palette must be checked against the supplied, unchanged Divine logo before approval. Working direction: warm ivory and charcoal foundations, a restrained Divine brand accent, and cyan / yellow / royal-blue material colours where they accurately represent the 3D foam-layer concept. Do not recolour or redesign the logo.
- Working type direction: Sora for display headings, Inter for Latin body/interface text, and Noto Sans Gujarati for Gujarati text. Confirm font rendering and licensing/availability before implementation.

## Motion and interaction direction
- Smooth page and section transitions.
- Scroll-driven camera choreography for selected 3D scenes.
- Exploded mattress-layer interaction with clear labels and a reset/reassemble state.
- Subtle cursor parallax and hover responses; respect reduced-motion preferences.
- Restrained logo/brand presentation; genuine brand marks must not be distorted.
- Product cards should reveal useful information and contextual enquiry actions without excessive motion.
- Provide a usable non-3D fallback for mobile, reduced-motion settings and devices with limited graphics performance.
- Animation must never block navigation, reading, keyboard use or contact actions.

## 3D art direction
- Main visual: a layered mattress/material cutaway, with layers labelled only using confirmed product/material terminology.
- Additional visuals may illustrate foam, fabrics, padding, adhesives and upholstery applications.
- A sofa or chair visual is an application illustration only; do not imply Divine manufactures or sells that finished furniture unless confirmed.
- Prefer procedural Three.js geometry and optimized web assets; no paid fal dependency.
- Keep 3D scenes lightweight, responsive and progressively loaded.

## Content and catalogue structure
- Keep the catalogue divided into distinct, relevant categories; do not place every product in one undifferentiated gallery.
- Foam: PU Foam, HR Foam, Bonded Foam, Soft Foam, Hard Foam, Memory Foam.
- Mattress and cushion: Mattress, Mattress materials, Cushion materials.
- EPE and rebonded: EPE Armour Sheet, Rebonded Foam.
- Fabrics: Mattress Fabric, Sofa Fabric.
- Padding: Recron Padding.
- Adhesives and named products: Sprayable Adhesive, Non-Sprayable Adhesive, FoamFix, 5in1, FastTack, and listed Fevicol / Pidilite products.
- Lining-work hardware: Stapler Pins and other hardware only where individually verified.
- Product descriptions, specifications, sizes, prices, variants, stock and performance claims must be sourced from the business; do not invent them.
- Provide distinct content and enquiry paths for wholesale/B2B and retail audiences.
- Use contextual WhatsApp messages that include the selected category/product.

## Brand assets and supplied image archive
- The original Divine logo is approved and must not be edited, recreated, recoloured, cropped, distorted or replaced.
- When the supplied ZIP/image archive is available in the project workspace, inspect and classify every image before placement.
- Create an asset inventory mapping each image to its subject, category, intended page/section, dimensions, quality and any cleanup required.
- Some supplied images contain rounded corners and explanatory text/captions at the bottom. Treat those as temporary annotations for internal identification only.
- For website presentation, remove only the unwanted rounded-corner treatment and explanatory caption/text, while preserving the actual photograph/product content. Avoid destructive cropping, stretching or altering product details.
- Do not apply one blanket crop/edit to all images. Inspect each asset individually and choose a suitable treatment.
- Distribute images across their relevant pages and sections; do not dump all assets into one gallery or use irrelevant images as decoration.
- Use original, genuine brand logo files. Never approximate or AI-generate company logos.
- Keep a record of original source files and cleaned website-ready derivatives.

## Proposed page structure
1. Home — brand introduction, selected 3D material experience, category overview, customer paths, supplied brands, verified business facts and enquiry CTA.
2. Products & Materials — category-led catalogue and individual product detail sections/pages as source content permits.
3. Business Solutions — clearly separated information for furniture shops, mattress makers, sofa manufacturers, upholsterers, lining workers, furnishing businesses and retail customers; do not imply unconfirmed services.
4. Brands — genuine logos and accurately described supply relationships.
5. About — verified business introduction and authentic shop/business photography.
6. Contact & Enquiry — WhatsApp, phone, email, verified address/map, confirmed opening hours and enquiry form.

## Accessibility, responsiveness and performance
- Responsive desktop, tablet and mobile layouts.
- Keyboard-accessible navigation, controls and forms.
- Visible focus states, semantic headings, descriptive image alt text and sufficient contrast.
- Respect prefers-reduced-motion.
- Lazy-load non-critical images and 3D scenes; use optimized responsive image formats.
- Provide static/2D fallbacks where WebGL is unavailable or unsuitable.
- Test the complete experience in English and Gujarati, including long labels and form states.

## Technical direction
- React + Vite.
- Tailwind CSS.
- Three.js with React Three Fiber and Drei.
- GSAP / ScrollTrigger for carefully selected scroll choreography.
- GitHub as the source of truth; GitHub Pages as the initial static-hosting target.
- No database is required for the public catalogue and enquiry website.
- Do not depend on paid fal generation or require the user to install Blender, VS Code or use a terminal.

## Design approval gates
1. Review and classify the complete image archive.
2. Extract/check the Divine logo's existing palette; preserve the logo unchanged.
3. Approve typography, palette, spacing, grid, buttons, navigation and card patterns.
4. Design desktop and mobile navigation including Home and English / ગુજરાતી controls.
5. Approve homepage wireframe and key 3D storyboards before full implementation.
6. Validate all content against the business audit before publishing.


## Generated visual branding and logo-placement rule
- When creating a new foam/material hero image, product visual, promotional graphic or animation keyframe, include the small official Divine logo only when it improves brand recognition and does not clutter the composition.
- Use the exact original logo asset supplied by the owner. Never redraw, regenerate, recolour, distort, crop or otherwise modify it.
- Place it discreetly with sufficient clear space and contrast; do not let it compete with the product/material subject or important text.
- Do not invent a logo lockup or place a logo on every visual automatically. For pure decorative 3D scenes, a logo may be omitted; for branded hero/marketing visuals, prefer a subtle authentic logo placement.
- Keep any text on generated visuals to a minimum. All business-critical text should remain live website text rather than baked into an image, so it stays crisp, accessible and translatable into Gujarati.
- If the original logo file is not available at generation time, leave a clean reserved area or omit the logo. Never approximate it with generated lettering.
