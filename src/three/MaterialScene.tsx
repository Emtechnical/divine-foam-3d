import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, RoundedBox, Stars } from '@react-three/drei';
import * as THREE from 'three';
function MaterialLayers(){
 const assembly=useRef<THREE.Group>(null),progress=useRef(0),target=useRef(new THREE.Vector3(4.6,3.1,5.9));
 useEffect(()=>{const update=()=>{progress.current=THREE.MathUtils.clamp(window.scrollY/Math.max(1,innerHeight*1.2),0,1);};update();addEventListener('scroll',update,{passive:true});return()=>removeEventListener('scroll',update);},[]);
 useFrame((state,delta)=>{if(!assembly.current)return;const p=progress.current;
  assembly.current.position.y=THREE.MathUtils.damp(assembly.current.position.y,-p*.45,2.5,delta);
  assembly.current.rotation.y=THREE.MathUtils.damp(assembly.current.rotation.y,-.35+state.pointer.x*.22+p*.34,2.2,delta);
  assembly.current.rotation.x=THREE.MathUtils.damp(assembly.current.rotation.x,-.12+state.pointer.y*.08-p*.1,2.2,delta);
  target.current.set(4.6+state.pointer.x*.45+p*.35,3.1+state.pointer.y*.22+p*.55,5.9-p*.35);
  state.camera.position.lerp(target.current,1-Math.exp(-delta*1.6));state.camera.lookAt(0,-p*.18,0);
 });
 const layers=[{y:.68,color:'#f4eee8',width:3.65,depth:2.28,height:.34},{y:.22,color:'#20c7d8',width:3.55,depth:2.22,height:.4},{y:-.25,color:'#f2c94c',width:3.48,depth:2.16,height:.4},{y:-.72,color:'#2857a4',width:3.4,depth:2.1,height:.4}];
 return <group ref={assembly} rotation={[-.12,-.28,-.07]}><Float speed={.65} rotationIntensity={.035} floatIntensity={.12}>{layers.map((l,i)=><group key={l.color} position={[0,l.y,0]}><RoundedBox args={[l.width,l.height,l.depth]} radius={.11} smoothness={5} castShadow receiveShadow><meshStandardMaterial color={l.color} roughness={i===0?.82:.62} metalness={.015}/></RoundedBox></group>)}</Float></group>;
}
export default function MaterialScene(){return <div className="three-scene" role="img" aria-label="Interactive cinematic 3D stack of foam-like material layers"><Canvas camera={{position:[4.6,3.1,5.9],fov:34}} dpr={[1,1.35]} shadows><color attach="background" args={['#000000']}/><fog attach="fog" args={['#171322',7,17]}/><ambientLight intensity={.8}/><directionalLight position={[4,7,5]} intensity={2.1} castShadow/><pointLight position={[-4,1,-3]} intensity={1.25} color="#c9a66b"/><pointLight position={[3,2,-4]} intensity={1.2} color="#8a5bd2"/><Stars radius={80} depth={45} count={1100} factor={2.4} saturation={.18} fade speed={.35}/><MaterialLayers/><ContactShadows position={[0,-1.3,0]} opacity={.22} scale={7} blur={2.4} far={3}/><Environment preset="studio"/></Canvas><div className="scene-label"><span>01 — MATERIAL STUDY</span><b>Layers of possibility.</b></div></div>;}