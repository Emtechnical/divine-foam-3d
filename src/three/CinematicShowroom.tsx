import { useEffect, useRef, useState } from 'react';

type Language = 'en' | 'gu';
type FramePosition = { scene: number; frame: number };

const frameCounts = [300, 270, 270, 210] as const;

const chapters = [
  {
    eyebrow: '01 / THE ARCHITECTURAL REVEAL',
    title: 'A world opens into comfort.',
    body: 'A cinematic arrival. Architecture, light and a quiet space designed around rest.',
    guTitle: 'આરામની દુનિયામાં એક નવી શરૂઆત.',
    guBody: 'આર્કિટેક્ચર, પ્રકાશ અને આરામ માટે રચાયેલી શાંત જગ્યા.',
  },
  {
    eyebrow: '02 / THE SLEEP SANCTUARY',
    title: 'The centrepiece of a restful space.',
    body: 'A closer journey across the bed, its surface, stitching and tactile details.',
    guTitle: 'આરામદાયક જગ્યાનું કેન્દ્ર.',
    guBody: 'બેડની સપાટી, સિલાઈ અને તેની બારીક વિગતોની નજીકથી સફર.',
  },
  {
    eyebrow: '03 / THE ANATOMY OF COMFORT',
    title: 'Look closer. Comfort has layers.',
    body: 'Move beneath the surface and explore the layered structure of mattress materials.',
    guTitle: 'નજીકથી જુઓ. આરામના અનેક લેયર્સ.',
    guBody: 'સપાટીની અંદર જઈને મેટ્રેસ મટિરિયલ્સના વિવિધ લેયર્સ જુઓ.',
  },
  {
    eyebrow: '04 / THE TEXTILE ATELIER',
    title: 'Texture gives every space its character.',
    body: 'A macro study of fabric, weave, folds and the details you can almost feel.',
    guTitle: 'ટેક્સચર દરેક જગ્યાને ઓળખ આપે છે.',
    guBody: 'ફેબ્રિક, વણાટ, ફોલ્ડ અને સ્પર્શી શકાય તેવી બારીક વિગતો.',
  },
];

function drawCover(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  pointer: { x: number; y: number },
) {
  const width = canvas.clientWidth || window.innerWidth;
  const height = canvas.clientHeight || window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const pixelWidth = Math.round(width * dpr);
  const pixelHeight = Math.round(height * dpr);

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  const context = canvas.getContext('2d');
  if (!context || !image.complete || !image.naturalWidth) return;

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.fillStyle = '#100d16';
  context.fillRect(0, 0, width, height);

  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * 1.025;
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const x = (width - drawWidth) / 2 + pointer.x * width * 0.012;
  const y = (height - drawHeight) / 2 + pointer.y * height * 0.012;

  context.drawImage(image, x, y, drawWidth, drawHeight);
}

function FrameSequenceCanvas({ scene, frame }: FramePosition) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const currentRef = useRef<FramePosition>({ scene, frame });
  const pointerRef = useRef({ x: 0, y: 0 });

  const drawCurrent = () => {
    const canvas = canvasRef.current;
    const current = currentRef.current;
    const image = cacheRef.current.get(`${current.scene}:${current.frame}`);
    if (canvas && image?.complete && image.naturalWidth) {
      drawCover(canvas, image, pointerRef.current);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => drawCurrent();
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    currentRef.current = { scene, frame };
    const base = import.meta.env.BASE_URL;
    const cache = cacheRef.current;

    const load = (sceneIndex: number, frameNumber: number) => {
      if (frameNumber < 1 || frameNumber > frameCounts[sceneIndex]) return;
      const key = `${sceneIndex}:${frameNumber}`;
      const existing = cache.get(key);
      if (existing) {
        if (sceneIndex === scene && frameNumber === frame && existing.complete) drawCurrent();
        return;
      }

      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        const current = currentRef.current;
        if (current.scene === sceneIndex && current.frame === frameNumber) drawCurrent();
      };
      image.src = `${base}assets/frames/scene-${String(sceneIndex + 1).padStart(2, '0')}/frame-${String(frameNumber).padStart(3, '0')}.jpg`;
      cache.set(key, image);
    };

    load(scene, frame);
    for (let offset = 1; offset <= 8; offset += 1) load(scene, frame + offset);
    for (let offset = 1; offset <= 4; offset += 1) load(scene, frame - offset);

    if (scene < 3 && frame >= frameCounts[scene] - 10) {
      for (let next = 1; next <= 4; next += 1) load(scene + 1, next);
    }

    if (cache.size > 24) {
      const keep = [...cache.entries()]
        .map(([key]) => {
          const [sceneKey, frameKey] = key.split(':').map(Number);
          const sceneDistance = Math.abs(sceneKey - scene) * 400;
          return { key, distance: sceneDistance + Math.abs(frameKey - frame) };
        })
        .sort((a, b) => b.distance - a.distance);

      while (cache.size > 20 && keep.length) {
        const oldest = keep.shift();
        if (oldest && oldest.key !== `${scene}:${frame}`) cache.delete(oldest.key);
      }
    }
  }, [scene, frame]);

  return (
    <canvas
      ref={canvasRef}
      className="showroom-frame-canvas"
      aria-label={`Cinematic scene ${scene + 1}, frame ${frame} of ${frameCounts[scene]}`}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerRef.current = {
          x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
          y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
        };
        drawCurrent();
      }}
      onPointerLeave={() => {
        pointerRef.current = { x: 0, y: 0 };
        drawCurrent();
      }}
    />
  );
}

export default function CinematicShowroom({ language }: { language: Language }) {
  const root = useRef<HTMLElement>(null);
  const [position, setPosition] = useState<FramePosition>({ scene: 0, frame: 1 });

  useEffect(() => {
    let raf = 0;

    const update = () => {
      if (!root.current) return;
      const rect = root.current.getBoundingClientRect();
      const span = Math.max(1, root.current.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / span));
      const scaled = progress * 4;
      const scene = Math.min(3, Math.floor(scaled));
      const localProgress = scene === 3 && progress === 1 ? 1 : scaled - scene;
      const frame = 1 + Math.round(localProgress * (frameCounts[scene] - 1));

      setPosition((current) =>
        current.scene === scene && current.frame === frame ? current : { scene, frame },
      );
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, []);

  const chapter = chapters[position.scene];

  return (
    <section className="cinematic-showroom" ref={root} aria-label="Divine cinematic journey">
      <div className="showroom-sticky">
        <FrameSequenceCanvas scene={position.scene} frame={position.frame} />
        <div className="showroom-vignette" />
        <div className="showroom-topline">
          <span>DIVINE / A CINEMATIC JOURNEY</span>
          <span>SCROLL TO MOVE THROUGH THE STORY</span>
        </div>
        <div className="showroom-copy">
          <div className="showroom-index">{chapter.eyebrow}</div>
          <h2 key={position.scene}>{language === 'gu' ? chapter.guTitle : chapter.title}</h2>
          <p key={`body-${position.scene}`}>{language === 'gu' ? chapter.guBody : chapter.body}</p>
          <div className="showroom-progress" aria-label={`Scene ${position.scene + 1} of 4`}>
            {chapters.map((item, index) => (
              <span key={item.eyebrow} className={index === position.scene ? 'is-active' : ''} />
            ))}
          </div>
          <a href="#contact">{language === 'gu' ? 'પૂછપરછ કરો' : 'ENQUIRE ABOUT MATERIALS'} ↗</a>
        </div>
        <div className="showroom-side">NADIAD · GUJARAT <i /> COMFORT, MADE DIVINE</div>
        <div className="showroom-frame-counter">
          {String(position.scene + 1).padStart(2, '0')} / 04
          <i />
          {String(position.frame).padStart(3, '0')} / {String(frameCounts[position.scene]).padStart(3, '0')}
        </div>
      </div>
      <div className="showroom-track" aria-hidden="true">
        {chapters.map((item) => <div key={item.eyebrow} />)}
      </div>
    </section>
  );
}
