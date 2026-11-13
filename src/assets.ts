/**
 * Divine-owned visual assets.
 * Public paths are resolved through Vite's BASE_URL so GitHub Pages works
 * under /divine-foam-3d/ as well as local development.
 *
 * Storefront and personal/event photographs are intentionally not exposed
 * here until the owner approves public use.
 */
const photo = (filename: string) => `${import.meta.env.BASE_URL}assets/photos/${filename}`;

export const divineAssets = {
  logo: photo('DIVINE_LOGO.png'),
  foamTypes: {
    src: photo('MATTRESS_TYPES.png'),
    alt: 'Foam types photograph supplied by Divine Foam & Mattress',
  },
  mattressCushion: {
    src: photo('MATTRESS_CUSHION.png'),
    alt: 'Mattress and cushion material photograph supplied by Divine Foam & Mattress',
  },
  rebondedFoam: {
    src: photo('EPE_REBONDED.jfif'),
    alt: 'Rebonded foam material photograph supplied by Divine Foam & Mattress',
  },
  sofaFabric: {
    src: photo('SOFA_FABRIC.png'),
    alt: 'Sofa fabric swatches supplied by Divine Foam & Mattress',
  },
  recronPadding: {
    src: photo('RECRON_PADDING.png'),
    alt: 'Recron padding material photograph supplied by Divine Foam & Mattress',
  },
  liningHardware: {
    src: photo('LINING_WORK_HARDWARE.png'),
    alt: 'Lining-work hardware and tools photograph supplied by Divine Foam & Mattress',
  },
} as const;
