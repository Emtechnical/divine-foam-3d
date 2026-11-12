import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, Environment, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function Layers() {
  const group = useRef<THREE.Group>(null);
  const scroll = useRef(0);
  useEffect(() => {
    const update = () => {
      const range = Math.max(1, window.innerHeight * 0.9);
      scroll.current = Math.min(1, Math.max(0, window.scrollY / range));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useFrame((state, delta) => {
    if (!group.current) return;
    const targetY = -scroll.current * 0.65;
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 3, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, Math.sin(state.pointer.x * 0.5) * 0.22, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -0.12 + state.pointer.y * 0.08, 3, delta);
  });
  const layers = [
    { y: 0.66, color: '#f4eee8', width: 3.7, depth: 2.3, height: 0.34 },
    { y: 0.19, color: '#20c7d8', width: 3.55, depth: 2.2, height: 0.42 },
    { y: -0.31, color: '#f2c94c', width: 3.48, depth: 2.14, height: 0.42 },
    { y: -0.81, color: '#2857a4', width: 3.42, depth: 2.08, height: 0.42 },
  ];
  return <group ref={group} rotation={[-0.13, -0.32, -0.08]} position={[0, 0, 0]}>
    <Float speed={1.1} rotationIntensity={0.035} floatIntensity={0.12}>
      {layers.map((layer, i) => <group key={layer.color} position={[0, layer.y, 0]}>
        <RoundedBox args={[layer.width, layer.height, layer.depth]} radius={0.12} smoothness={5} castShadow receiveShadow>
          <meshStandardMaterial color={layer.color} roughness={i === 0 ? 0.78 : 0.55} metalness={0.02}/>
        </RoundedBox>
        {i === 0 && <mesh position={[0, layer.height / 2 + 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[layer.width * 0.94, layer.depth * 0.94, 28, 18]}/>
          <meshStandardMaterial color="#fffaf4" roughness={0.88} wireframe={false}/>
        </mesh>}
      </group>)}
    </Float>
  </group>;
}

export default function MaterialScene() {
  return <div className="three-scene" aria-label="Interactive 3D illustration of layered material samples" role="img">
    <Canvas camera={{ position: [4.6, 3.1, 5.9], fov: 34 }} dpr={[1, 1.5]} shadows>
      <ambientLight intensity={1.15}/>
      <directionalLight position={[4, 7, 5]} intensity={2.1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
      <pointLight position={[-4, 1, -3]} intensity={1.1} color="#c9a66b"/>
      <Layers/>
      <ContactShadows position={[0, -1.35, 0]} opacity={0.28} scale={7} blur={2.4} far={3}/>
      <Environment preset="studio"/>
    </Canvas>
    <div className="scene-label"><span>01 — MATERIAL STUDY</span><b>Layers of possibility.</b></div>
  </div>;
}