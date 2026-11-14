import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


const counts = [300, 270, 270, 210] as const;
const totalFrames = counts.reduce((sum, count) => sum + count, 0);

function frameAtProgress(progress: number) {
  const absolute = Math.min(totalFrames - 1, Math.max(0, Math.round(progress * (totalFrames - 1))));
  let remaining = absolute;
  for (let scene = 0; scene < counts.length; scene += 1) {
    if (remaining < counts[scene]) return { scene, frame: remaining + 1 };
    remaining -= counts[scene];
  }
  return { scene: 3, frame: counts[3] };
}

function createDepthMaterial(texture: THREE.Texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uImageResolution: { value: new THREE.Vector2(1280, 720) },
      uScroll: { value: 0 },
    },
    vertexShader: `
      uniform vec2 uPointer;
      uniform float uTime;
      uniform float uScroll;
      varying vec2 vUv;
      varying float vDepth;
      void main() {
        vUv = uv;
        vec3 p = position;
        float radial = 1.0 - smoothstep(0.0, 1.15, length(uv - 0.5));
        float wave = sin(uv.y * 8.0 + uTime * 0.18) * cos(uv.x * 6.0 - uTime * 0.12);
        float parallax = dot(uv - 0.5, uPointer) * 0.13;
        p.z += radial * (wave * 0.025 + parallax);
        p.z += sin(uv.x * 3.14159) * sin(uv.y * 3.14159) * (0.018 + uScroll * 0.018);
        vDepth = p.z;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uMap;
      uniform vec2 uResolution;
      uniform vec2 uImageResolution;
      uniform vec2 uPointer;
      varying vec2 vUv;
      varying float vDepth;
      void main() {
        float screenAspect = uResolution.x / max(1.0, uResolution.y);
        float imageAspect = uImageResolution.x / uImageResolution.y;
        vec2 uv = vUv;
        if (screenAspect > imageAspect) {
          float scale = imageAspect / screenAspect;
          uv.y = (uv.y - 0.5) * scale + 0.5;
        } else {
          float scale = screenAspect / imageAspect;
          uv.x = (uv.x - 0.5) * scale + 0.5;
        }
        uv += uPointer * 0.009;
        vec4 color = texture2D(uMap, uv);
        float vignette = smoothstep(0.92, 0.22, distance(vUv, vec2(0.5)));
        color.rgb *= mix(0.58, 1.0, vignette);
        color.rgb += vec3(0.035, 0.022, 0.012) * (0.5 + vDepth * 3.0);
        gl_FragColor = color;
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
    transparent: false,
    depthWrite: true,
  });
}

export default function CinematicShowroom() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let raf = 0;
    let scrollTrigger: ScrollTrigger | undefined;
    let targetProgress = 0;
    let pointerX = 0;
    let pointerY = 0;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.className = 'cinematic-webgl';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#100d16');
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 2.65);

    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = 1280;
    sourceCanvas.height = 720;
    const sourceContext = sourceCanvas.getContext('2d', { alpha: false });
    if (!sourceContext) {
      renderer.dispose();
      return;
    }
    sourceContext.fillStyle = '#100d16';
    sourceContext.fillRect(0, 0, 1280, 720);

    const texture = new THREE.CanvasTexture(sourceCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;

    const material = createDepthMaterial(texture);
    const geometry = new THREE.PlaneGeometry(3.9, 2.2, 96, 54);
    const imagePlane = new THREE.Mesh(geometry, material);
    imagePlane.position.z = -0.18;
    scene.add(imagePlane);

    const ambient = new THREE.AmbientLight('#b7a2c7', 0.35);
    scene.add(ambient);
    const warmLight = new THREE.PointLight('#d7b783', 1.8, 8);
    warmLight.position.set(1.6, 1.0, 1.8);
    scene.add(warmLight);
    const plumLight = new THREE.PointLight('#8d63a5', 1.2, 8);
    plumLight.position.set(-1.8, -0.6, 1.2);
    scene.add(plumLight);

    const particlePositions = new Float32Array(240 * 3);
    for (let i = 0; i < 240; i += 1) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 4.4;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 2.6;
      particlePositions[i * 3 + 2] = Math.random() * 0.8 - 0.1;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: '#d7bd98', size: 0.008, transparent: true, opacity: 0.42, sizeAttenuation: true }),
    );
    scene.add(particles);

    const cache = new Map<string, HTMLImageElement>();
    const pending = new Set<string>();
    let displayedKey = '';
    let desiredKey = '';
    const pointerTarget = new THREE.Vector2(0, 0);

    const drawFrame = (sceneIndex: number, frameNumber: number) => {
      const key = `${sceneIndex}:${frameNumber}`;
      const image = cache.get(key);
      if (!image?.complete || !image.naturalWidth || displayedKey === key) return;
      sourceContext.drawImage(image, 0, 0, 1280, 720);
      texture.needsUpdate = true;
      displayedKey = key;
    };

    const loadFrame = (sceneIndex: number, frameNumber: number, isPriority = false) => {
      if (sceneIndex < 0 || sceneIndex >= counts.length || frameNumber < 1 || frameNumber > counts[sceneIndex]) return;
      const key = `${sceneIndex}:${frameNumber}`;
      if (cache.has(key) || pending.has(key)) {
        if (isPriority) drawFrame(sceneIndex, frameNumber);
        return;
      }
      pending.add(key);
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        pending.delete(key);
        if (disposed) return;
        cache.set(key, image);
        if (desiredKey === key) drawFrame(sceneIndex, frameNumber);
        trimCache(sceneIndex, frameNumber);
      };
      image.onerror = () => pending.delete(key);
      const base = import.meta.env.BASE_URL;
      image.src = `${base}assets/frames/scene-${String(sceneIndex + 1).padStart(2, '0')}/frame-${String(frameNumber).padStart(3, '0')}.jpg`;
    };

    const trimCache = (sceneIndex: number, frameNumber: number) => {
      if (cache.size <= 22) return;
      const keepKeys = new Set<string>();
      for (let offset = -5; offset <= 12; offset += 1) {
        if (frameNumber + offset >= 1 && frameNumber + offset <= counts[sceneIndex]) {
          keepKeys.add(`${sceneIndex}:${frameNumber + offset}`);
        }
      }
      for (const key of cache.keys()) {
        if (cache.size <= 18) break;
        if (!keepKeys.has(key)) cache.delete(key);
      }
    };

    const requestProgress = (progress: number) => {
      targetProgress = Math.max(0, Math.min(1, progress));
      const { scene: sceneIndex, frame } = frameAtProgress(targetProgress);
      desiredKey = `${sceneIndex}:${frame}`;
      loadFrame(sceneIndex, frame, true);
      for (let offset = 1; offset <= 10; offset += 1) loadFrame(sceneIndex, frame + offset);
      for (let offset = 1; offset <= 4; offset += 1) loadFrame(sceneIndex, frame - offset);
      if (frame > counts[sceneIndex] - 8 && sceneIndex < 3) {
        for (let next = 1; next <= 5; next += 1) loadFrame(sceneIndex + 1, next);
      }
      material.uniforms.uScroll.value = targetProgress;
    };

    requestProgress(0);

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.fov = width / height < 0.72 ? 52 : 42;
      camera.updateProjectionMatrix();
      material.uniforms.uResolution.value.set(width, height);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerY = -(event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const hero = document.querySelector<HTMLElement>('.hero');
    scrollTrigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: () => hero ? hero.offsetHeight : 0,
      end: () => Math.max(window.innerHeight + 1, document.documentElement.scrollHeight - window.innerHeight),
      invalidateOnRefresh: true,
      onUpdate: (self) => requestProgress(self.progress),
      onRefresh: (self) => requestProgress(self.progress),
    });
    ScrollTrigger.refresh();

    const render = (time: number) => {
      if (disposed) return;
      material.uniforms.uTime.value = time * 0.001;
      pointerTarget.set(pointerX, pointerY);
      material.uniforms.uPointer.value.lerp(pointerTarget, 0.055);
      camera.position.x += (pointerX * 0.055 - camera.position.x) * 0.035;
      camera.position.y += (pointerY * 0.035 - camera.position.y) * 0.035;
      camera.lookAt(0, 0, -0.2);
      imagePlane.rotation.y += (pointerX * 0.018 - imagePlane.rotation.y) * 0.035;
      imagePlane.rotation.x += (-pointerY * 0.012 - imagePlane.rotation.x) * 0.035;
      particles.rotation.z = Math.sin(time * 0.00008) * 0.025;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      scrollTrigger?.kill();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      cache.clear();
      pending.clear();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      particleGeometry.dispose();
      (particles.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="cinematic-background" aria-hidden="true" />;
}
