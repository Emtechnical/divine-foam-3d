import { useMemo, useRef } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { ContactShadows, Environment, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

type Toy = { x:number; y:number; z:number; scale:number; kind:number; color:string; radius:number };
const palette=['#d2a66e','#eee7dd','#28232d','#a88fc0','#c77e69'];
const count=34;

function Toybox(){
 const groupRefs=useRef<(THREE.Group|null)[]>([]);
 const velocities=useRef<THREE.Vector3[]>([]);
 const burst=useRef<{x:number;y:number;time:number}|null>(null);
 const flash=useRef(0);
 const raycaster=useMemo(()=>new THREE.Raycaster(),[]);
 const plane=useMemo(()=>new THREE.Plane(new THREE.Vector3(0,0,1),0),[]);
 const pointerWorld=useRef(new THREE.Vector3(100,100,0));
 const toys=useMemo<Toy[]>(()=>Array.from({length:count},(_,i)=>{
  const angle=i*2.399963;
  const ring=.45+Math.sqrt(i/count)*2.65;
  return {x:Math.cos(angle)*ring,y:Math.sin(angle)*ring*.66,z:((i%5)-2)*.12,scale:.48+(i%4)*.13,kind:i%4,color:palette[(i*7+i%3)%palette.length],radius:.32+(i%4)*.055};
 }),[]);
 if(velocities.current.length!==count) velocities.current=toys.map(()=>new THREE.Vector3());

 useFrame((state,delta)=>{
  const dt=Math.min(delta,.033);
  raycaster.setFromCamera(state.pointer,state.camera);
  raycaster.ray.intersectPlane(plane,pointerWorld.current);
  const pointer=pointerWorld.current;
  const active=state.pointer.x>-1.1&&state.pointer.x<1.1&&state.pointer.y>-1.1&&state.pointer.y<1.1;
  if(burst.current){
   const elapsed=state.clock.elapsedTime-burst.current.time;
   if(elapsed>.72){burst.current=null;flash.current=0}else flash.current=1-elapsed/.72;
  }
  for(let i=0;i<count;i++){
   const g=groupRefs.current[i];if(!g)continue;
   const v=velocities.current[i],toy=toys[i];
   const anchor=new THREE.Vector3(toy.x,toy.y,toy.z);
   v.add(anchor.sub(g.position).multiplyScalar(2.7*dt));
   v.multiplyScalar(Math.pow(.91,dt*60));
   if(active){
    const dx=g.position.x-pointer.x,dy=g.position.y-pointer.y;
    const d=Math.sqrt(dx*dx+dy*dy)+.001;
    const reach=1.1+toy.radius;
    if(d<reach){const force=(reach-d)*9;v.x+=(dx/d)*force*dt;v.y+=(dy/d)*force*dt;v.z+=.8*dt;}
   }
   if(burst.current){
    const dx=g.position.x-burst.current.x,dy=g.position.y-burst.current.y;
    const d=Math.sqrt(dx*dx+dy*dy)+.001;
    const force=13*Math.max(0,1-d/5)*flash.current;
    v.x+=(dx/d)*force*dt;v.y+=(dy/d)*force*dt;v.z+=force*.13*dt;
   }
   g.position.addScaledVector(v,dt);
   g.position.x=THREE.MathUtils.clamp(g.position.x,-4.1,4.1);
   g.position.y=THREE.MathUtils.clamp(g.position.y,-2.55,2.55);
   g.position.z=THREE.MathUtils.damp(g.position.z,toy.z,.9,dt);
   g.rotation.x=THREE.MathUtils.damp(g.rotation.x,v.y*.16,.9,dt);
   g.rotation.y+=dt*(.08+v.x*.08);
   g.rotation.z=THREE.MathUtils.damp(g.rotation.z,-v.x*.13,.8,dt);
  }
  // Lightweight sphere contacts keep the pile tactile without a heavyweight physics dependency.
  for(let i=0;i<count;i++)for(let j=i+1;j<count;j++){
   const a=groupRefs.current[i],b=groupRefs.current[j];if(!a||!b)continue;
   const dx=b.position.x-a.position.x,dy=b.position.y-a.position.y;
   const d=Math.sqrt(dx*dx+dy*dy)||.001,minimum=toys[i].radius+toys[j].radius;
   if(d<minimum){const push=(minimum-d)*.5;const nx=dx/d,ny=dy/d;a.position.x-=nx*push;b.position.x+=nx*push;a.position.y-=ny*push;b.position.y+=ny*push;}
  }
 });

 const scatter=(event:ThreeEvent<PointerEvent>)=>{
  event.stopPropagation();
  burst.current={x:event.point.x,y:event.point.y,time:0};
  // Clock time is supplied on the next frame; the immediate flash is deliberate.
  flash.current=1;
 };
 useFrame((state)=>{if(burst.current&&burst.current.time===0)burst.current.time=state.clock.elapsedTime;});
 return <group>
  {toys.map((toy,i)=><group key={i} ref={el=>{groupRefs.current[i]=el}} position={[toy.x,toy.y,toy.z]} scale={toy.scale} onPointerDown={scatter}>
   {toy.kind===0?<RoundedBox args={[.92,.72,.52]} radius={.13} smoothness={5} castShadow receiveShadow><meshPhysicalMaterial color={toy.color} roughness={.24} metalness={.12} clearcoat={.9} clearcoatRoughness={.12}/></RoundedBox>
    :toy.kind===1?<mesh castShadow receiveShadow><torusGeometry args={[.39,.16,18,40]}/><meshPhysicalMaterial color={toy.color} roughness={.2} metalness={.18} clearcoat={1}/></mesh>
    :toy.kind===2?<mesh castShadow receiveShadow><capsuleGeometry args={[.25,.58,6,12]}/><meshPhysicalMaterial color={toy.color} roughness={.3} metalness={.08} clearcoat={.8}/></mesh>
    :<RoundedBox args={[.62,.62,.62]} radius={.29} smoothness={8} castShadow receiveShadow><meshPhysicalMaterial color={toy.color} roughness={.3} metalness={.06} clearcoat={.85}/></RoundedBox>}
  </group>)}
  <ContactShadows position={[0,-2.55,-.4]} opacity={.42} scale={10} blur={2.8} far={4}/>
 </group>;
}

export default function MaterialScene(){
 return <div className="three-scene toybox-scene" aria-label="Interactive 3D material toybox. Move your cursor to push the pieces; click to scatter them.">
  <Canvas camera={{position:[0,0,11.5],fov:38}} dpr={[1,1.5]} shadows gl={{antialias:true,alpha:true}}>
   <color attach="background" args={['#111016']}/>
   <fog attach="fog" args={['#111016',10,20]}/>
   <ambientLight intensity={1.05}/>
   <directionalLight position={[2,7,7]} intensity={3.2} castShadow shadow-mapSize={[1024,1024]}/>
   <pointLight position={[-5,1,4]} intensity={45} color="#a88fc0"/>
   <pointLight position={[5,-2,3]} intensity={32} color="#d2a66e"/>
   <Environment preset="studio"/>
   <Toybox/>
  </Canvas>
  <div className="toybox-caption"><span>FIG. 00 — DIVINE MATERIAL PLAYGROUND</span><b>Touch the materials.</b><small>MOVE TO PUSH · CLICK TO SCATTER</small></div>
 </div>;
}
