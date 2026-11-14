import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const FRAME_RATE = 30;
const VIDEO_PATH = `${import.meta.env.BASE_URL}assets/divine-sequence.mp4`;

export default function CinematicShowroom() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let raf = 0;
    let targetProgress = 0;
    let lastSeekAt = 0;
    let pointerX = 0;
    let pointerY = 0;
    let currentPointerX = 0;
    let currentPointerY = 0;
    let disposed = false;

    // Decode the original 1,050 frames as one hardware-decoded, all-intra video.
    const video = document.createElement('video');
    video.src = VIDEO_PATH;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.loop = false;
    video.setAttribute('playsinline', '');
    Object.assign(video.style, {
      position: 'absolute',
      width: '2px',
      height: '2px',
      opacity: '0',
      pointerEvents: 'none',
      left: '0',
      top: '0',
    });
    host.appendChild(video);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
      precision: 'mediump',
      stencil: false,
      depth: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.domElement.className = 'cinematic-webgl';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#100d16');
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 5;

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    // A single clean video surface: no per-pixel sharpening, fake luminance relief,
    // canvas copies, particle layers or expensive multi-sample fragment shader.
    const geometry = new THREE.PlaneGeometry(2, 2, 24, 14);
    const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const resize = () => {
      const width = Math.max(1, window.innerWidth);
      const height = Math.max(1, window.innerHeight);
      const aspect = width / height;
      renderer.setSize(width, height, false);
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();

      // Cover the viewport without stretching the original 16:9 frames.
      const sourceAspect = 16 / 9;
      if (aspect > sourceAspect) plane.scale.set(aspect / sourceAspect, 1, 1);
      else plane.scale.set(1, sourceAspect / aspect, 1);
    };

    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    };
    const onPointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerY = -(event.clientY / window.innerHeight - 0.5) * 2;
    };

    const onMetadata = () => {
      if (video.duration > 0) video.currentTime = targetProgress * video.duration;
    };

    video.addEventListener('loadedmetadata', onMetadata);
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    resize();
    onScroll();
    video.load();

    const render = (time: number) => {
      if (disposed) return;

      // The source is 30 fps. Seek at that cadence instead of decoding the same
      // requested position repeatedly on every 60/120/144 Hz display refresh.
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA && time - lastSeekAt >= 1000 / FRAME_RATE) {
        const duration = Number.isFinite(video.duration) ? video.duration : 0;
        if (duration > 0) {
          const nextTime = Math.min(duration - 1 / FRAME_RATE, targetProgress * duration);
          if (Math.abs(video.currentTime - nextTime) > 1 / (FRAME_RATE * 2)) {
            video.currentTime = Math.max(0, nextTime);
          }
        }
        lastSeekAt = time;
      }

      // Restrained camera parallax, without distorting or blurring the source image.
      currentPointerX += (pointerX - currentPointerX) * 0.045;
      currentPointerY += (pointerY - currentPointerY) * 0.045;
      camera.position.x = currentPointerX * 0.035;
      camera.position.y = currentPointerY * 0.022;
      camera.lookAt(0, 0, 0);
      plane.rotation.y = currentPointerX * 0.008;
      plane.rotation.x = -currentPointerY * 0.006;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      video.removeEventListener('loadedmetadata', onMetadata);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      video.pause();
      video.removeAttribute('src');
      video.load();
      texture.dispose();
      material.dispose();
      geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      video.remove();
    };
  }, []);

  return <div ref={hostRef} className="cinematic-background" aria-hidden="true" />;
}
