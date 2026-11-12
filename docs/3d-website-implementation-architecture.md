# Divine Foam & Mattress — 3D Website Implementation Architecture

## Goal
Build a genuinely interactive, real-time 3D brand and catalogue website for Divine Foam & Mattress. It should feel cinematic and premium while remaining fast, accessible, bilingual, and deployable without paid AI-media services.

This document translates the approved Figma homepage and motion direction into a working browser experience.

## Cost and dependency policy
- Do not make Runway, Fal, paid image/video generation, a paid CMS, or a paid database a runtime dependency.
- Prefer open-source libraries and static hosting.
- Three.js is MIT-licensed; React Three Fiber is MIT-licensed. GSAP and its animation plugins are available under GreenSock's standard no-charge license. Preserve required notices and re-check terms when pinning versions.
- Pin npm dependencies through the lockfile and review each package's own license.
- The public catalogue/enquiry site does not need a database in v1. Keep product content in version-controlled data files. Add a database only if the business later needs accounts, live stock, orders, or editable inventory.
- External AI-generated video is optional marketing material, never a substitute for the real-time 3D scene.

## Proposed stack
- React + Vite + TypeScript
- Three.js
- @react-three/fiber and @react-three/drei
- GSAP + ScrollTrigger for choreographed scroll sequences and interface transitions
- CSS for layout, typography, responsive behaviour, focus states, and reduced-motion fallbacks
- GitHub Pages for static v1 deployment, with Vite base path configured for the repository
- GitHub Actions to build and publish the static site

## Experience architecture

### 1. Global shell
Every route shares:
- Persistent header/navigation with the original Divine logo asset when available
- Visible Home control that navigates to the actual home route
- English / ગુજરાતી language switcher
- Footer with verified business contact details and hours
- Reduced-motion support
- Keyboard-visible focus and touch-friendly controls

Language behaviour:
- All site-authored labels, navigation, buttons, forms, validation messages, metadata, and footer content must have English and Gujarati translations.
- Persist the selected language locally in the browser.
- Use semantic translation keys rather than duplicating whole page components.
- Keep company names, supplied brand names, addresses, and phone numbers unchanged unless an approved Gujarati transliteration is supplied.

### 2. Home experience
1. **Cinematic arrival:** a real-time Three.js foam/mattress material sculpture in a warm studio environment. Use procedural geometry and shader/material treatments initially; replace with approved real product assets when supplied.
2. **Scroll choreography:** camera movement and composition change as the visitor scrolls. Normal document scrolling remains in control; no scroll hijacking.
3. **Exploded material story:** distinct foam, fabric, padding, and support layers separate in 3D with clear labels. Show only layers that correspond to actual business products/materials.
4. **Material interaction:** visitors can rotate or inspect the scene and select material categories. Provide keyboard-accessible equivalent controls.
5. **Catalogue discovery:** responsive category cards with real product photography and concise live text.
6. **Business pathways:** separate navigation for furniture shops, mattress makers, sofa manufacturers, upholsterers/lining workers, and retail customers.
7. **Trust and enquiry:** approved business metrics, verified brand references, contact details, and WhatsApp enquiry actions.

### 3. Real-time 3D scene
The 3D scene is a true WebGL scene, not a prerecorded video:
- Camera, geometry, lights, materials, shadows, and animation run in the browser.
- Pointer movement produces bounded parallax and gentle object response.
- Scroll progress drives camera position, object arrangement, and exploded-layer offsets.
- Touch input supports drag rotation and tap-to-select.
- Use raycasting through React Three Fiber event handlers for selectable objects.
- Use physically based materials only where they improve the result; avoid expensive effects with little visual value.
- Keep the scene decorative when it does not add information. Product facts remain available as HTML text.

### 4. Motion system
- GSAP timelines for intro, section reveals, camera choreography, and material transitions.
- ScrollTrigger for scroll-linked timelines.
- Small CSS transitions for buttons, links, menus, and focus states.
- Use one coordinated timeline per major scene; clean it up on route changes and component unmount.
- Do not animate every element continuously. Prioritise a few deliberate, high-quality movements.
- Motion must never block navigation, contact links, reading, or form submission.

### 5. Performance and accessibility
- Lazy-load the 3D scene and heavy catalogue imagery.
- Dynamically import the 3D experience so the rest of the site renders first.
- Use compressed textures and geometry; prefer procedural geometry for the first prototype.
- Cap device pixel ratio and adapt quality based on device capability.
- Pause or reduce animation when the tab is hidden.
- Provide a static CSS/HTML fallback when WebGL is unavailable.
- Respect the prefers-reduced-motion media preference; reduced-motion mode must not run scroll-driven camera choreography.
- Target smooth interaction on capable devices, but do not promise 60 FPS on every phone.
- Keep text, links, and controls semantic and accessible; do not hide essential product details behind hover.
- Test on low/mid-range Android devices, desktop browsers, keyboard-only navigation, and reduced-motion settings.

## Routes and page inventory
- / — Home / cinematic brand experience
- /materials — Foam, EPE/rebonded, fabrics, padding, adhesives, and hardware categories
- /mattresses — Mattress and mattress-material categories
- /for-business — B2B audiences and enquiry pathways
- /brands — Verified brand list and dealer relationship wording
- /about — Business introduction using only owner-approved facts
- /contact — Address, phone, WhatsApp, email, hours, and map link

The persistent Home control must navigate to /, not merely scroll the current page to its top.

## Content integrity
Use only verified business information. Never invent prices, dimensions, densities, warranties, certifications, delivery, installation, manufacturing, custom cutting, or stock availability.

Confirmed business identity and contact:
- Divine Foam & Mattress
- Pij Road, near MF Furniture, Nadiad, Gujarat 387002
- +91 97244 15440
- divinesleepsol@gmail.com
- WhatsApp: https://wa.me/919724415440

Confirmed categories include PU Foam, HR Foam, Bonded Foam, Soft Foam, Hard Foam, Memory Foam, Mattress, Mattress materials, Cushion materials, EPE Armour Sheet, Rebonded Foam, Mattress Fabric, Sofa Fabric, Recron Padding, Sprayable Adhesive, Non-Sprayable Adhesive, FoamFix, 5in1, FastTack, Fevicol/Pidilite adhesive products, and stapler pins.

Confirmed brands: Kurl-On, Prime Comfort, Jindal, Flexipol / Resiflex, and Pidilite / Fevicol. Divine is an authorized dealer for Pidilite/Fevicol, not an exclusive dealer.

Business hours:
- Monday–Thursday: 9:30 AM–7:30 PM
- Friday: 9:30 AM–12:00 PM and 3:00 PM–7:30 PM
- Saturday: 9:30 AM–7:30 PM
- Sunday: Closed

Approved cumulative metrics exist, but their measurement period and exact definitions still need owner clarification before publication:
- 43,200+ sq. ft. comfort
- 20+ Metric Tonnes Foam
- 600+ Litres Adhesive
- 2,500+ Metres Mattress Fabric
- 700+ Metres Recron

## Asset pipeline
- Preserve every original owner-supplied asset.
- Create cleaned derivatives only when required.
- Remove decorative rounded-corner framing and explanatory bottom captions from supplied images when requested, without cropping or altering the actual product.
- Keep original logo pixels and proportions exactly; never redraw, recolour, distort, or regenerate the logo.
- If the ZIP archive is not attached and accessible, do not pretend to have inspected it. Request it before asset mapping or cleanup.
- Prefer real company/product photography over AI-generated representations for factual catalogue items.
- Generated decorative scenes must not imply an unverified product specification or service.

## Suggested project structure
- src/app — app shell and routing
- src/components/layout — header, footer, persistent Home control, language switcher
- src/components/ui — buttons, category cards, section headings
- src/features/home — homepage, hero scene, material story, business pathways
- src/features/catalogue — materials and mattress pages plus category data
- src/features/business — B2B pathways
- src/features/brands — verified brand list
- src/features/contact — contact page
- src/three — Canvas root, scenes, materials, scroll and pointer animation hooks
- src/content — English and Gujarati dictionaries
- src/styles — design tokens and global styles
- public/assets — original logo, approved product photos, and brand assets

## Delivery sequence
1. **Asset intake and mapping:** inspect the owner's ZIP, catalogue images, brand logos, and original Divine logo. Confirm which image belongs to each category.
2. **Reusable interface layer:** implement header, navigation, language switcher, persistent Home control, buttons, category cards, footer, and responsive layouts.
3. **3D hero prototype:** create one polished procedural foam/mattress scene with pointer interaction and a scroll-driven camera sequence.
4. **Material exploded view:** add individually selectable layers and live labels tied to verified category content.
5. **Remaining pages:** materials, mattresses, business pathways, brands, about, and contact.
6. **Performance/accessibility pass:** test reduced motion, mobile, low-end devices, keyboard navigation, and WebGL fallback.
7. **Deploy:** build with GitHub Actions and publish on GitHub Pages; verify all routes, asset paths, and language persistence.

## Acceptance criteria for the first 3D prototype
- The object is rendered live by Three.js/WebGL; it is not an MP4 pretending to be interactive 3D.
- Pointer movement changes the scene in a restrained, polished way.
- Scrolling through the hero changes camera framing and object composition.
- The scene has deliberate studio lighting, material depth, and soft shadows.
- Home and contact actions remain usable throughout.
- Reduced-motion and no-WebGL fallbacks work.
- No paid generation service is required to run the site.
