import { useEffect, useRef } from 'react';
export default function Atmosphere() {
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas?.getContext('2d'); if(!canvas||!ctx)return;
  let w=0,h=0,raf=0; let stars:{x:number;y:number;r:number;p:number;z:number}[]=[];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const resize=()=>{const d=Math.min(devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;canvas.width=w*d;canvas.height=h*d;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(d,0,0,d,0,0);stars=Array.from({length:Math.min(115,Math.floor(w*h/10500))},()=>({x:Math.random()*w,y:Math.random()*h,r:.3+Math.random()*1.4,p:Math.random()*6.28,z:.2+Math.random()*.8}));};
  const draw=(t:number)=>{ctx.clearRect(0,0,w,h);const a=reduced?0:t*.00012;
   const glow=(x:number,y:number,r:number,c:string)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);};
   glow(w*.78+Math.sin(a)*w*.035,h*.18,Math.max(w,h)*.58,'rgba(112,67,143,.13)');
   glow(w*.14,h*.78+Math.cos(a)*35,Math.max(w,h)*.5,'rgba(24,150,165,.11)');
   glow(w*.53,h*.48,Math.max(w,h)*.4,'rgba(198,142,87,.06)');
   for(const s of stars){const pulse=.45+.55*Math.sin(a*8+s.p);ctx.beginPath();ctx.arc(s.x,s.y,s.r*(.7+pulse*.45),0,Math.PI*2);ctx.fillStyle='rgba(255,245,224,'+((.14+pulse*.48)*s.z)+')';ctx.fill();}
   if(!reduced)raf=requestAnimationFrame(draw);
  };
  resize();draw(0);addEventListener('resize',resize);if(!reduced)raf=requestAnimationFrame(draw);
  return()=>{cancelAnimationFrame(raf);removeEventListener('resize',resize);};
 },[]);
 return <canvas ref={ref} className="atmosphere-canvas" aria-hidden="true"/>;
}