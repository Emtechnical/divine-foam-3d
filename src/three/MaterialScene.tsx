import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function MaterialLayers() {
  const assembly = useRef<THREE.Group>(null);
  const scrollProgress = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const travel = Math.max(1, window.innerHeight * 0.9);
      scrollProgress.current = THREE.MathUtils.clamp(window.scrollY / travel, 0, 1);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state, delta) => {
    if (!assembly.current) return;
    assembly.current.position.y = THREE.MathUtils.damp(assembly.current.position.y, -scrollProgress.current * 0.48, 3, delta);
    assembly.current.rotation.y = THREE.MathUtils.damp(assembly.current.rotation.y, -0.28 + state.pointer.x * 0.2, 3, delta);
    assembly.current.rotation.x = THREE.MathUtils.damp(assembly.current.rotation.x, -0.12 + state.pointer.y * 0.06, 3, delta);
  });

  const layers = [
    { y: 0.68, color: '#f4eee8', width: 3.65, depth: 2.28, height: 0.34 },
    { y: 0.22, color: '#20c7d8', width: 3.55, depth: 2.22, height: 0.40 },
    { y: -0.25, color: '#f2c94c', width: 3.48, depth: 2.16, height: 0.40 },
    { y: -0.72, color: '#2857a4', width: 3.40, depth: 2.10, height: 0.40 },
  ];

  return <group ref={assembly} rotation={[-0.12, -0.28, -0.07]}>
    <Float speed={1} rotationIntensity={0.025} floatIntensity={0.10}>
      {layers.map((layer, index) => <group key={layer.color} position={[0, layer.y, 0]}>
        <RoundedBox args={[layer.width, layer.height, layer.depth]} radius={0.11} smoothness={5} castShadow receiveShadow>
          <meshStandardMaterial color={layer.color} roughness={index === 0 ? 0.82 : 0.62} metalness={0.015} />
        </RoundedBox>
        {index === 0 && <mesh position={[0, layer.height / 2 + 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[layer.width * 0.92, layer.depth * 0.92]} />
          <meshStandardMaterial color="#fffaf4" roughness={0.92} />
        </mesh>}
      </group>)}
    </Float>
  </group>;
}

export default function MaterialScene() {
  return <div className="three-scene" role="img" aria-label="Illustrative interactive 3D stack of foam-like material layers">
    <Canvas camera={{ position: [4.6, 3.1, 5.9], fov: 34 }} dpr={[1, 1.5]} shadows>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 7, 5]} intensity={2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[-4, 1, -3]} intensity={0.9} color="#c9a66b" />
      <MaterialLayers />
      <ContactShadows position={[0, -1.3, 0]} opacity={0.25} scale={7} blur={2.4} far={3} />
      <Environment preset="studio" />
    </Canvas>
    <div className="scene-label"><span>01 — MATERIAL STUDY</span><b>Layers of possibility.</b></div>
  </div>;
}