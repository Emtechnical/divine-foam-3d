import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const sceneCounts = [300, 270, 270, 210] as const;
const TOTAL = sceneCounts.reduce((sum, value) => sum + value, 0);
const FRAME_ROOT = `${import.meta.env.BASE_URL}assets/frames`;

function resolveFrame(progress: number) {
  const globalIndex = Math.min(TOTAL - 1, Math.max(0, Math.round(progress * (TOTAL - 1))));
  let offset = globalIndex;
  for (let scene = 0; scene < sceneCounts.length; scene += 1) {
    if (offset < sceneCounts[scene]) return { scene, frame: offset + 1, globalIndex };
    offset -= sceneCounts[scene];
  }
  return { scene: 3, frame: sceneCounts[3], globalIndex: TOTAL - 1 };
}

function createCinematicMaterial(texture: THREE.Texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uPointer: { value: new THREE.Vector2() },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uScroll: { value: 0 },
    },
    vertexShader: `
      uniform sampler2D uMap;
      uniform vec2 uPointer;
      uniform float uTime;
      uniform float uScroll;
      varying vec2 vUv;
      varying float vRelief;
      void main() {
        vUv = uv;
        vec4 pixel = texture2D(uMap, uv);
        float luminance = dot(pixel.rgb, vec3(0.2126, 0.7152, 0.0722));
        float radial = 1.0 - smoothstep(0.12, 0.72, distance(uv, vec2(0.5)));
        float directional = dot(uv - 0.5, uPointer);
        float depth = (luminance - 0.5) * 0.16;
        depth += radial * directional * 0.20;
        depth += radial * sin(uTime * 0.18 + uv.y * 5.0) * 0.006;
        vec3 p = position;
        p.z += depth;
        p.x += uPointer.x * (uv.x - 0.5) * 0.035;
        p.y += uPointer.y * (uv.y - 0.5) * 0.025;
        vRelief = depth;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uMap;
      uniform vec2 uResolution;
      uniform vec2 uPointer;
      varying vec2 vUv;
      varying float vRelief;
      void main() {
        float aspect = uResolution.x / max(1.0, uResolution.y);
        float imageAspect = 1280.0 / 720.0;
        vec2 uv = vUv;
        if (aspect > imageAspect) {
          float scale = imageAspect / aspect;
          uv.y = (uv.y - 0.5) * scale + 0.5;
        } else {
          float scale = aspect / imageAspect;
          uv.x = (uv.x - 0.5) * scale + 0.5;
        }
        vec2 texel = vec2(1.0 / 1280.0, 1.0 / 720.0);
        vec3 center = texture2D(uMap, uv).rgb;
        vec3 north = texture2D(uMap, uv + vec2(0.0, texel.y)).rgb;
        vec3 south = texture2D(uMap, uv - vec2(0.0, texel.y)).rgb;
        vec3 east = texture2D(uMap, uv + vec2(texel.x, 0.0)).rgb;
        vec3 west = texture2D(uMap, uv - vec2(texel.x, 0.0)).rgb;
        vec3 sharpened = center * 1.28 - (north + south + east + west) * 0.07;
        sharpened = (sharpened - 0.5) * 1.08 + 0.5;
        float light = 1.0 + clamp(vRelief * 0.7, -0.06, 0.06);
        vec3 warmLift = vec3(0.018, 0.010, 0.002) * (0.35 + max(vRelief, 0.0));
        gl_FragColor = vec4(max(sharpened * light + warmLift, 0.0), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
    depthWrite: true,
    depthTest: true,
  });
}

export default function CinematicShowroom() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let raf = 0;
    let targetProgress = 0;
    let displayedProgress = 0;
    let pointerX = 0;
    let pointerY = 0;
    let currentGlobalFrame = -1;
    let desiredKey = '';
    let lastScrollY = window.scrollY;
    let scrollDirection = 1;
    const cache = new Map<string, HTMLImageElement>();
    const pending = new Map<string, HTMLImageElement>();
    const loadQueue: string[] = [];
    let activeLoads = 0;
    const MAX_LOADS = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      precision: 'highp',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.domElement.className = 'cinematic-webgl';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#100d16');
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 20);
    camera.position.set(0, 0, 5);

    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = 1280;
    sourceCanvas.height = 720;
    const context = sourceCanvas.getContext('2d', { alpha: false });
    if (!context) {
      renderer.dispose();
      return;
    }
    context.fillStyle = '#100d16';
    context.fillRect(0, 0, 1280, 720);

    const texture = new THREE.CanvasTexture(sourceCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    const material = createCinematicMaterial(texture);
    const geometry = new THREE.PlaneGeometry(2, 2, 180, 102);
    const plane = new THREE.Mesh(geometry, material);
    plane.position.z = 0;
    scene.add(plane);

    const ambient = new THREE.AmbientLight('#ffffff', 0.28);
    scene.add(ambient);
    const gold = new THREE.PointLight('#e6c28c', 1.1, 7);
    gold.position.set(1.4, 1.1, 2);
    scene.add(gold);
    const violet = new THREE.PointLight('#9e72bb', 0.75, 7);
    violet.position.set(-1.5, -0.8, 1.5);
    scene.add(violet);

    const dustCount = 160;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i += 1) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 2.2;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
      dustPositions[i * 3 + 2] = Math.random() * 0.35 + 0.2;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({ color: '#f0d8ae', size: 0.0022, transparent: true, opacity: 0.28, sizeAttenuation: true, depthWrite: false });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    const draw = (key: string) => {
      const img = cache.get(key);
      if (!img?.complete || !img.naturalWidth || desiredKey !== key) return;
      context.drawImage(img, 0, 0, 1280, 720);
      texture.needsUpdate = true;
      const [sceneIndex, frame] = key.split(':').map(Number);
      currentGlobalFrame = sceneCounts.slice(0, sceneIndex).reduce((sum, n) => sum + n, 0) + frame - 1;
    };

    const pumpQueue = () => {
      while (!disposed && activeLoads < MAX_LOADS && loadQueue.length) {
        const key = loadQueue.shift()!;
        if (cache.has(key) || pending.has(key)) continue;
        const [sceneIndex, frame] = key.split(':').map(Number);
        const img = new Image();
        img.decoding = 'async';
        pending.set(key, img);
        activeLoads += 1;
        img.onload = () => {
          pending.delete(key);
          activeLoads -= 1;
          if (!disposed) {
            cache.set(key, img);
            if (desiredKey === key) draw(key);
            trimCache();
            pumpQueue();
          }
        };
        img.onerror = () => {
          pending.delete(key);
          activeLoads -= 1;
          pumpQueue();
        };
        img.src = `${FRAME_ROOT}/scene-${String(sceneIndex + 1).padStart(2, '0')}/frame-${String(frame).padStart(3, '0')}.jpg`;
      }
    };

    const enqueue = (sceneIndex: number, frame: number, priority = false) => {
      if (sceneIndex < 0 || sceneIndex >= sceneCounts.length || frame < 1 || frame > sceneCounts[sceneIndex]) return;
      const key = `${sceneIndex}:${frame}`;
      if (cache.has(key)) {
        if (priority) draw(key);
        return;
      }
      if (pending.has(key) || loadQueue.includes(key)) return;
      if (priority) loadQueue.unshift(key);
      else loadQueue.push(key);
      pumpQueue();
    };

    const trimCache = () => {
      if (cache.size <= 28) return;
      const keep = new Set<string>();
      const { scene, frame } = resolveFrame(targetProgress);
      for (let i = -7; i <= 18; i += 1) {
        const index = sceneCounts.slice(0, scene).reduce((sum, n) => sum + n, 0) + frame - 1 + i;
        if (index >= 0 && index < TOTAL) {
          const resolved = resolveFrame(index / (TOTAL - 1));
          keep.add(`${resolved.scene}:${resolved.frame}`);
        }
      }
      for (const key of cache.keys()) {
        if (cache.size <= 22) break;
        if (!keep.has(key)) cache.delete(key);
      }
    };

    const updateFromScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      targetProgress = progress;
      scrollDirection = window.scrollY >= lastScrollY ? 1 : -1;
      lastScrollY = window.scrollY;
      const resolved = resolveFrame(progress);
      desiredKey = `${resolved.scene}:${resolved.frame}`;
      enqueue(resolved.scene, resolved.frame, true);
      // Direction-aware look-ahead. The queue is deliberately bounded so a fast fling cannot
      // flood the browser with hundreds of simultaneous image decodes.
      for (let i = 1; i <= 16; i += 1) {
        const future = Math.max(0, Math.min(TOTAL - 1, resolved.globalIndex + i * scrollDirection));
        const next = resolveFrame(future / (TOTAL - 1));
        enqueue(next.scene, next.frame);
      }
      for (let i = 1; i <= 3; i += 1) {
        const previous = Math.max(0, Math.min(TOTAL - 1, resolved.globalIndex - i));
        const prev = resolveFrame(previous / (TOTAL - 1));
        enqueue(prev.scene, prev.frame);
      }
      material.uniforms.uScroll.value = progress;
    };

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      const aspect = width / height;
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
      material.uniforms.uResolution.value.set(width, height);
      plane.scale.set(aspect, 1, 1);
    };

    const onPointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerY = -(event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', updateFromScroll, { passive: true });
    resize();
    updateFromScroll();

    const render = (time: number) => {
      if (disposed) return;
      // Smooth small deltas, but accelerate when the visitor makes a large scroll jump.
      const delta = targetProgress - displayedProgress;
      displayedProgress += Math.sign(delta) * Math.min(Math.abs(delta), Math.max(0.0008, Math.abs(delta) * 0.18));
      material.uniforms.uTime.value = time * 0.001;
      const pointer = material.uniforms.uPointer.value as THREE.Vector2;
      pointer.lerp(new THREE.Vector2(pointerX, pointerY), 0.045);
      camera.position.x += (pointerX * 0.045 - camera.position.x) * 0.035;
      camera.position.y += (pointerY * 0.028 - camera.position.y) * 0.035;
      camera.lookAt(0, 0, 0);
      plane.rotation.y += (pointerX * 0.012 - plane.rotation.y) * 0.035;
      plane.rotation.x += (-pointerY * 0.009 - plane.rotation.x) * 0.035;
      dust.rotation.z = Math.sin(time * 0.00007) * 0.012;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', updateFromScroll);
      cache.clear();
      pending.clear();
      loadQueue.length = 0;
      geometry.dispose();
      material.dispose();
      texture.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="cinematic-background" aria-hidden="true" />;
}
