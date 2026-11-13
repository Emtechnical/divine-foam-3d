import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { ContactShadows, Environment, Float, Image, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const mattressPhoto = `${import.meta.env.BASE_URL}assets/photos/MATTRESS_CUSHION.png`;

function ProductStage() {
  const product = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Group>(null);
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 9.2));

  useFrame((state, delta) => {
    const px = state.pointer.x;
    const py = state.pointer.y;
    const targetX = px * 0.62;
    const targetY = py * 0.34;
    cameraTarget.current.set(targetX, targetY, 9.2 - Math.abs(px) * 0.28);
    state.camera.position.lerp(cameraTarget.current, 1 - Math.exp(-delta * 2.1));
    state.camera.lookAt(0.15 + px * 0.22, py * 0.12, 0);
    if (product.current) {
      product.current.rotation.y = THREE.MathUtils.damp(product.current.rotation.y, -px * 0.095, 2.2, delta);
      product.current.rotation.x = THREE.MathUtils.damp(product.current.rotation.x, py * 0.045, 2.2, delta);
      product.current.position.y = Math.sin(state.clock.elapsedTime * 0.42) * 0.045;
    }
    if (halo.current) {
      halo.current.rotation.z += delta * 0.035;
      halo.current.rotation.x = THREE.MathUtils.damp(halo.current.rotation.x, py * 0.04, 1.4, delta);
    }
  });

  return <>
    <color attach="background" args={['#100d16']} />
    <fog attach="fog" args={['#100d16', 10, 24]} />
    <ambientLight intensity={0.7} />
    <spotLight position={[3, 7, 7]} angle={0.55} penumbra={0.8} intensity={85} color="#f4dfc1" castShadow />
    <pointLight position={[-5, 1, 2]} intensity={24} color="#9a70b4" />
    <pointLight position={[5, -2, 1]} intensity={18} color="#d2b17b" />
    <Environment preset="studio" environmentIntensity={0.48} />

    <group ref={halo} position={[1.15, 0.05, -1.4]}>
      <mesh rotation={[0.2, -0.18, -0.28]}>
        <torusGeometry args={[3.45, 0.012, 8, 180]} />
        <meshBasicMaterial color="#d2b17b" transparent opacity={0.58} />
      </mesh>
      <mesh rotation={[0.4, 0.2, 0.16]}>
        <torusGeometry args={[3.82, 0.008, 8, 180]} />
        <meshBasicMaterial color="#9e7ab0" transparent opacity={0.42} />
      </mesh>
    </group>

    <group ref={product} position={[1.15, 0, 0]}>
      <Float speed={0.55} rotationIntensity={0.012} floatIntensity={0.045}>
        <Image
          url={mattressPhoto}
          position={[0, 0.08, 0]}
          scale={[8.15, 5.72]}
          zoom={1.12}
          transparent
          toneMapped={false}
        />
      </Float>
    </group>

    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.9, -0.3]} receiveShadow>
      <planeGeometry args={[30, 20]} />
      <meshStandardMaterial color="#17121d" roughness={0.28} metalness={0.22} />
    </mesh>
    <ContactShadows position={[1.1, -2.78, 0]} opacity={0.32} scale={10} blur={3.2} far={5} />
    <Sparkles count={38} scale={[12, 6, 5]} size={1.6} speed={0.16} opacity={0.36} color="#d7bd98" />
  </>;
}

export default function MaterialScene() {
  return <div className="three-scene product-depth-scene" aria-label="Cinematic product photograph with mouse-responsive camera parallax">
    <Canvas camera={{ position: [0, 0, 9.2], fov: 42 }} dpr={[1, 1.5]} shadows gl={{ antialias: true, alpha: false }}>
      <ProductStage />
    </Canvas>
    <div className="product-scene-caption">
      <span>DIVINE / PRODUCT STUDY 001</span>
      <b>Comfort, in its full form.</b>
      <small>MOVE YOUR CURSOR TO EXPLORE THE DEPTH</small>
    </div>
    <div className="product-scene-index">01 — MATTRESS / CUSHION</div>
  </div>;
}
