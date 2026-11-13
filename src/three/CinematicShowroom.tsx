import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, RoundedBox } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import type { MutableRefObject } from 'react';
import * as THREE from 'three';

type Language = 'en' | 'gu';
const chapters = [
 {eyebrow:'01 / THE MATERIAL GALLERY', title:'A world built from comfort.', body:'Explore the textures and structures behind foam, bedding and furnishing materials.', guTitle:'આરામની દુનિયા, મટિરિયલ્સથી બનેલી.', guBody:'ફોમ, બેડિંગ અને ફર્નિશિંગ મટિરિયલ્સની રચના અને ટેક્સચર જુઓ.'},
 {eyebrow:'02 / FOAM STUDIES', title:'Layers with a purpose.', body:'PU, HR, bonded, soft, hard and memory foam — presented as a study of form and texture.', guTitle:'દરેક લેયરનો પોતાનો હેતુ.', guBody:'PU, HR, બોન્ડેડ, સોફ્ટ, હાર્ડ અને મેમરી ફોમ.'},
 {eyebrow:'03 / SLEEP SYSTEMS', title:'The anatomy of a mattress.', body:'A closer look at mattress and cushion materials, from the outer fabric to the inner layers.', guTitle:'ગાદલાની અંદરની રચના.', guBody:'બાહ્ય ફેબ્રિકથી અંદરના લેયર્સ સુધી ગાદલા અને કુશન મટિરિયલ્સ.'},
 {eyebrow:'04 / TEXTILE ATELIER', title:'Texture becomes character.', body:'Mattress and sofa fabrics, shown as tactile rolls, folds and woven surfaces.', guTitle:'ટેક્સચરથી બને છે ઓળખ.', guBody:'મેટ્રેસ અને સોફા ફેબ્રિકના રોલ, ફોલ્ડ અને વણાટ.'},
 {eyebrow:'05 / FILL & FORM', title:'Softness in every fibre.', body:'Recron padding and rebonded foam, explored through sculptural material forms.', guTitle:'દરેક ફાઇબરમાં નરમાઈ.', guBody:'રેક્રોન પેડિંગ અને રિબોન્ડેડ ફોમની રચના.'},
 {eyebrow:'06 / THE WORKSHOP', title:'Materials that bring it together.', body:'Adhesives and lining-work essentials for the people who build and finish furnishing products.', guTitle:'કામને પૂરું કરતા મટિરિયલ્સ.', guBody:'ફર્નિશિંગ કામ માટે એડહેસિવ અને લાઇનિંગ વર્કની જરૂરી વસ્તુઓ.'},
];

function FoamModel(){
 const tones=['#f2e9df','#b47d70','#d6b56f','#657d9e'];
 return <group>
  {tones.map((c,i)=><group key={c} position={[0,.72-i*.47,0]}><RoundedBox args={[3.15-i*.12,.38,2.1-i*.1]} radius={.13} smoothness={6} castShadow receiveShadow><meshPhysicalMaterial color={c} roughness={.72} clearcoat={.12}/></RoundedBox><mesh position={[0,.195,0]}><planeGeometry args={[2.85-i*.12,1.8-i*.1]}/><meshBasicMaterial color="#fff0d9" transparent opacity={.08}/></mesh></group>)}
 </group>;
}
function MattressModel(){
 return <group>
  <RoundedBox args={[3.5,.46,2.2]} radius={.18} smoothness={8} position={[0,.15,0]} castShadow receiveShadow><meshPhysicalMaterial color="#e8ded2" roughness={.8}/></RoundedBox>
  <RoundedBox args={[3.36,.18,2.06]} radius={.14} smoothness={8} position={[0,.47,0]} castShadow><meshPhysicalMaterial color="#b68a76" roughness={.92}/></RoundedBox>
  {Array.from({length:7},(_,i)=><group key={i} position={[-1.35+i*.45,.58,0]}><mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[.13,.025,8,24]}/><meshStandardMaterial color="#f7eee3" metalness={.15} roughness={.55}/></mesh></group>)}
  <mesh position={[0,.6,0]}><boxGeometry args={[3.1,.025,1.86]}/><meshStandardMaterial color="#f4eadd" roughness={.8}/></mesh>
 </group>;
}
function FabricModel(){
 return <group rotation={[0,0,-.16]}>
  {['#9e6571','#c6a47c','#596b70','#d7c7b7'].map((c,i)=><group key={c} position={[-1.2+i*.8,.05,(i%2)*.12]} rotation={[Math.PI/2,0,0]}>
   <mesh castShadow><cylinderGeometry args={[.37,.37,1.85,48,1,true]}/><meshPhysicalMaterial color={c} roughness={.86} side={THREE.DoubleSide}/></mesh>
   <mesh><cylinderGeometry args={[.12,.12,1.88,32]}/><meshStandardMaterial color="#c8b69e" roughness={.5}/></mesh>
  </group>)}
 </group>;
}
function RecronModel(){
 return <group>
  {Array.from({length:42},(_,i)=>{const a=i*2.399;const r=.22+Math.sqrt(i/42)*1.25;return <mesh key={i} position={[Math.cos(a)*r,.05+Math.sin(i*1.7)*.32,Math.sin(a)*r]} rotation={[a*.4,a,.7]} scale={[.18+((i*7)%5)*.025,.12,.13]} castShadow><icosahedronGeometry args={[1,1]}/><meshPhysicalMaterial color={i%3===0?'#f7eee4':'#d9d2c8'} roughness={1}/></mesh>})}
 </group>;
}
function RebondModel(){
 return <group>
  {Array.from({length:90},(_,i)=>{const x=((i*37)%97)/97*2.8-1.4;const z=((i*61)%89)/89*1.8-.9;const y=.12+((i*19)%13)/13*.85;return <mesh key={i} position={[x,y,z]} rotation={[i*.7,i*1.13,i*.31]} scale={[.12+((i*3)%7)*.025,.1+((i*5)%6)*.025,.11+((i*2)%5)*.02]} castShadow><dodecahedronGeometry args={[1,0]}/><meshStandardMaterial color={['#b9a995','#8f8172','#d0c2ae','#a79a89'][i%4]} roughness={1}/></mesh>})}
 </group>;
}
function AdhesiveModel(){
 return <group>
  {['#d7c7b5','#c9a66b','#eee7dc'].map((c,i)=><group key={i} position={[-.9+i*.9,0,0]}>
   <mesh position={[0,.62,0]} castShadow><cylinderGeometry args={[.27,.31,1.15,48]}/><meshPhysicalMaterial color={c} roughness={.35} metalness={.08}/></mesh>
   <mesh position={[0,1.25,0]}><cylinderGeometry args={[.13,.13,.13,32]}/><meshStandardMaterial color="#28222a" roughness={.35}/></mesh>
   <mesh position={[0,.65,.276]}><planeGeometry args={[.38,.42]}/><meshBasicMaterial color="#3d293d"/></mesh>
  </group>)}
 </group>;
}
function ArchitecturalStage(){
 return <group>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.05,0]} receiveShadow><circleGeometry args={[18,96]}/><meshStandardMaterial color="#17131e" roughness={.34} metalness={.42}/></mesh>
  <mesh position={[0,-.88,0]}><cylinderGeometry args={[2.5,2.8,.22,96]}/><meshStandardMaterial color="#3a2a3b" metalness={.72} roughness={.28}/></mesh>
  <mesh position={[0,-.74,0]}><torusGeometry args={[2.38,.018,12,100]}/><meshStandardMaterial color="#d5b27a" emissive="#6c4a24" emissiveIntensity={.65} metalness={.8}/></mesh>
  {[ -4.8,4.8 ].map(x=><group key={x} position={[x,1,-3]}><mesh><boxGeometry args={[.12,5,.2]}/><meshStandardMaterial color="#443447" metalness={.4} roughness={.35}/></mesh><mesh position={[0,2.52,0]}><boxGeometry args={[.2,.035,.24]}/><meshBasicMaterial color="#f4d8a2"/></mesh></group>)}
  <mesh position={[0,4,-5]}><torusGeometry args={[3.3,.045,12,96,Math.PI]}/><meshStandardMaterial color="#b99667" metalness={.75} roughness={.3}/></mesh>
 </group>;
}
function Scene({progress}:{progress:MutableRefObject<number>}){
 const groups=useRef<(THREE.Group|null)[]>([]), cameraTarget=useRef(new THREE.Vector3());
 const camera=useThree(s=>s.camera);
 const models=[FoamModel,MattressModel,FabricModel,RecronModel,RebondModel,AdhesiveModel];
 useFrame((state,delta)=>{
  const p=progress.current*5; const active=Math.floor(p); const mix=THREE.MathUtils.smoothstep(p-active,0,1);
  const cameraPoints=[
   [5.4,3.2,8.6,0,0,0],[4.6,2.1,7.2,0,.1,0],[3.8,2.7,6.1,0,.25,0],[5.7,2.4,6.8,0,.1,0],[3.4,1.7,5.6,0,.2,0],[4.9,2.8,7.1,0,.1,0]
  ];
  const a=cameraPoints[Math.min(active,5)],b=cameraPoints[Math.min(active+1,5)];
  cameraTarget.current.set(THREE.MathUtils.lerp(a[0],b[0],mix),THREE.MathUtils.lerp(a[1],b[1],mix),THREE.MathUtils.lerp(a[2],b[2],mix));
  camera.position.lerp(cameraTarget.current,1-Math.exp(-delta*1.35));
  camera.lookAt(THREE.MathUtils.lerp(a[3],b[3],mix),THREE.MathUtils.lerp(a[4],b[4],mix),THREE.MathUtils.lerp(a[5],b[5],mix));
  groups.current.forEach((g,i)=>{if(!g)return;const d=Math.abs(p-i);const s=THREE.MathUtils.clamp(1-d*.9,.001,1);g.scale.lerp(new THREE.Vector3(s,s,s),1-Math.exp(-delta*4));g.rotation.y=THREE.MathUtils.damp(g.rotation.y,(i===active?-.12:0)+state.pointer.x*.08,2,delta);g.position.y=THREE.MathUtils.damp(g.position.y,-.2+Math.sin(state.clock.elapsedTime*.55+i)*.035,2,delta);});
 });
 return <><color attach="background" args={['#100d16']}/><fog attach="fog" args={['#100d16',8,24]}/>
  <ambientLight intensity={.25}/><spotLight position={[1,8,3]} angle={.55} penumbra={.8} intensity={95} color="#ffe0ad" castShadow distance={24}/><spotLight position={[-6,5,-3]} angle={.7} penumbra={.9} intensity={65} color="#9b6dbb" distance={22}/><pointLight position={[5,2,4]} intensity={18} color="#d0a66c"/><pointLight position={[-4,1,1]} intensity={10} color="#47a8b3"/>
  <ArchitecturalStage/>
  {models.map((Model,i)=><group key={i} ref={el=>{groups.current[i]=el}} position={[0,-.2,0]} scale={i===0?1:.001}><Float speed={.5} rotationIntensity={.025} floatIntensity={.06}><Model/></Float></group>)}
  <ContactShadows position={[0,-.82,0]} opacity={.48} scale={11} blur={2.7} far={5}/>
  <Environment preset="warehouse" environmentIntensity={.38}/>
 </>;
}
export default function CinematicShowroom({language}:{language:Language}){
 const root=useRef<HTMLElement>(null),progress=useRef(0);
 const [active,setActive]=useState(0);
 useEffect(()=>{
  const update=()=>{if(!root.current)return;const r=root.current.getBoundingClientRect();const span=Math.max(1,root.current.offsetHeight-innerHeight);const p=THREE.MathUtils.clamp(-r.top/span,0,1);progress.current=p;setActive(Math.min(5,Math.floor(p*6)));};
  update();addEventListener('scroll',update,{passive:true});addEventListener('resize',update);return()=>{removeEventListener('scroll',update);removeEventListener('resize',update);};
 },[]);
 return <section className="cinematic-showroom" ref={root} aria-label="Divine immersive material showroom">
  <div className="showroom-sticky"><Canvas shadows dpr={[1,1.5]} camera={{position:[5.4,3.2,8.6],fov:37}} gl={{antialias:true,alpha:false}}><Scene progress={progress}/></Canvas>
   <div className="showroom-vignette"/>
   <div className="showroom-topline"><span>DIVINE / MATERIAL WORLDS</span><span>SCROLL TO MOVE THROUGH THE GALLERY</span></div>
   <div className="showroom-copy">
    <div className="showroom-index">{chapters[active].eyebrow}</div>
    <h2 key={active}>{language==='gu'?chapters[active].guTitle:chapters[active].title}</h2>
    <p key={'p'+active}>{language==='gu'?chapters[active].guBody:chapters[active].body}</p>
    <div className="showroom-progress">{chapters.map((c,i)=><span key={c.eyebrow} className={i===active?'is-active':''}/>)}</div>
    <a href="#contact">{language==='gu'?'પૂછપરછ કરો':'ENQUIRE ABOUT MATERIALS'} ↗</a>
   </div>
   <div className="showroom-side">NADIAD · GUJARAT <i/> COMFORT, MADE DIVINE</div>
  </div>
  <div className="showroom-track" aria-hidden="true">{chapters.map(c=><div key={c.eyebrow}/>)}</div>
 </section>;
}
