// Generate cinematic scene images using pure Node.js — no external dependencies
// Each scene has: layered gradients, noise texture, silhouettes, atmospheric effects
// Run: node scripts/generate-placeholder-images.js

'use strict';
const fs   = require('fs');
const path = require('path');
const zlib = require('zlib');

const W = 1920;
const H = 1080;
const OUT = path.join(__dirname, '../public/images');

// ─── Deterministic noise (seeded) ───────────────────────────────────────────
const noiseP = new Uint8Array(512);
{ let s = 12345;
  const rng = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  const p = Array.from({length:256},(_,i)=>i).sort(()=>rng()-0.5);
  for (let i=0;i<256;i++) noiseP[i]=noiseP[i+256]=p[i];
}
function fade(t){ return t*t*t*(t*(t*6-15)+10); }
function lerp(a,b,t){ return a+(b-a)*t; }
function grad(h,x,y){
  const u=h<8?x:y, v=h<4?y:h===12||h===14?x:0;
  return ((h&1)?-u:u)+((h&2)?-v:v);
}
function pnoise(x,y){
  const X=Math.floor(x)&255, Y=Math.floor(y)&255;
  x-=Math.floor(x); y-=Math.floor(y);
  const u=fade(x),v=fade(y);
  const A=noiseP[X]+Y,B=noiseP[X+1]+Y;
  return lerp(lerp(grad(noiseP[A],x,y),grad(noiseP[B],x-1,y),u),
              lerp(grad(noiseP[A+1],x,y-1),grad(noiseP[B+1],x-1,y-1),u),v);
}
function fbm(x,y,oct=5){
  let v=0,a=0.5,f=1;
  for(let i=0;i<oct;i++){v+=pnoise(x*f,y*f)*a;a*=0.5;f*=2;}
  return (v+1)*0.5; // 0..1
}

// ─── Pixel buffer ────────────────────────────────────────────────────────────
function mkBuf(){ return new Uint8Array(W*H*3); }
function clamp(v){ return v<0?0:v>255?255:Math.round(v); }

function setRGB(b,x,y,r,g,c){
  if(x<0||x>=W||y<0||y>=H) return;
  const i=(y*W+x)*3; b[i]=r;b[i+1]=g;b[i+2]=c;
}
function blend(b,x,y,r,g,c,a){
  if(x<0||x>=W||y<0||y>=H||a<=0) return;
  if(a>=1){setRGB(b,x,y,r,g,c);return;}
  const i=(y*W+x)*3;
  b[i]  =clamp(b[i]  *(1-a)+r*a);
  b[i+1]=clamp(b[i+1]*(1-a)+g*a);
  b[i+2]=clamp(b[i+2]*(1-a)+c*a);
}

// ─── Gradient fill ───────────────────────────────────────────────────────────
function gradient(b,top,bot,y0,y1){
  if(y0===undefined) y0=0;
  if(y1===undefined) y1=H;
  for(let y=y0;y<y1;y++){
    const t=(y-y0)/(y1-y0-1||1);
    const r=clamp(top[0]+(bot[0]-top[0])*t);
    const g=clamp(top[1]+(bot[1]-top[1])*t);
    const c=clamp(top[2]+(bot[2]-top[2])*t);
    for(let x=0;x<W;x++) setRGB(b,x,y,r,g,c);
  }
}

// ─── Noise overlay ───────────────────────────────────────────────────────────
function noiseLayer(b,scaleX,scaleY,col,maxA,oct){
  if(oct===undefined) oct=4;
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){
    const n=fbm(x/scaleX,y/scaleY,oct);
    blend(b,x,y,col[0],col[1],col[2],n*maxA);
  }
}

// ─── Vignette ────────────────────────────────────────────────────────────────
function vignette(b,str){
  if(str===undefined) str=0.6;
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){
    const nx=(x/W-0.5)*2, ny=(y/H-0.5)*2;
    const d=Math.sqrt(nx*nx+ny*ny);
    const f=Math.max(0,1-d*str);
    const i=(y*W+x)*3;
    b[i]=clamp(b[i]*f); b[i+1]=clamp(b[i+1]*f); b[i+2]=clamp(b[i+2]*f);
  }
}

// ─── Radial glow ─────────────────────────────────────────────────────────────
function glow(b,cx,cy,rad,col,peak){
  const x0=Math.max(0,cx-rad),x1=Math.min(W,cx+rad);
  const y0=Math.max(0,cy-rad),y1=Math.min(H,cy+rad);
  for(let y=y0;y<y1;y++) for(let x=x0;x<x1;x++){
    const d=Math.sqrt((x-cx)*(x-cx)+(y-cy)*(y-cy));
    if(d>rad) continue;
    blend(b,x,y,col[0],col[1],col[2],peak*(1-d/rad)*(1-d/rad));
  }
}

// ─── Filled rectangle ────────────────────────────────────────────────────────
function fillRect(b,x0,y0,x1,y1,r,g,c){
  for(let y=Math.max(0,y0);y<Math.min(H,y1);y++)
    for(let x=Math.max(0,x0);x<Math.min(W,x1);x++)
      setRGB(b,x,y,r,g,c);
}

// ─── Noise terrain line ──────────────────────────────────────────────────────
function terrain(b,baseY,amp,scaleX,col){
  const r=col[0],g=col[1],c=col[2];
  for(let x=0;x<W;x++){
    const ty=Math.round(baseY+(fbm(x/scaleX,7,4)-0.5)*amp*2);
    for(let y=ty;y<H;y++) setRGB(b,x,y,r,g,c);
  }
}

// ─── Building skyline ─────────────────────────────────────────────────────────
function skyline(b,col,seed){
  const r=col[0],g=col[1],c=col[2];
  for(let seg=0;seg<40;seg++){
    const nx=fbm(seg*0.31,seed*0.1,2);
    const nh=fbm(seg*0.47,seed*0.15+1,2);
    const nw=fbm(seg*0.53,seed*0.1+2,2);
    const bx=Math.round(nx*W*0.98);
    const bw=20+Math.round(nw*100);
    const bh=80+Math.round(nh*300);
    fillRect(b,bx,H-bh,bx+bw,H,r,g,c);
    if(fbm(seg*0.7,seed*0.2+3,2)>0.5){
      const tw=Math.max(4,Math.round(bw*0.25));
      const tx=bx+Math.round((bw-tw)/2);
      const th=Math.round(fbm(seg*0.9,seed*0.3+4,2)*120+40);
      fillRect(b,tx,H-bh-th,tx+tw,H-bh,r,g,c);
    }
  }
}

// ─── Ship silhouette ─────────────────────────────────────────────────────────
function ship(b,cx,wy,sc,col){
  const r=col[0],g=col[1],c=col[2];
  const hw=Math.round(110*sc), hh=Math.round(28*sc);
  for(let dy=0;dy<hh;dy++){
    const ww=Math.round(hw*(0.6+0.4*dy/hh));
    fillRect(b,cx-ww,wy+dy,cx+ww,wy+dy+1,r,g,c);
  }
  const mh=Math.round(200*sc);
  for(let dy=0;dy<mh;dy++){setRGB(b,cx,wy-dy,r,g,c);setRGB(b,cx+1,wy-dy,r,g,c);}
  const mh2=Math.round(150*sc);
  const mx2=cx-Math.round(60*sc);
  for(let dy=0;dy<mh2;dy++) setRGB(b,mx2,wy-dy,r,g,c);
  for(let dy=0;dy<Math.round(mh*0.75);dy++){
    const sw=Math.round(90*sc*(dy/(mh*0.75)));
    fillRect(b,cx,wy-mh+dy,cx+sw,wy-mh+dy+1,r,g,c);
  }
  for(let dy=0;dy<Math.round(mh2*0.7);dy++){
    const sw=Math.round(60*sc*(dy/(mh2*0.7)));
    fillRect(b,mx2-sw,wy-mh2+dy,mx2,wy-mh2+dy+1,r,g,c);
  }
  fillRect(b,cx-Math.round(10*sc),wy-Math.round(mh*0.5),cx+Math.round(80*sc),wy-Math.round(mh*0.5)+2,r,g,c);
}

// ─── Mountain ────────────────────────────────────────────────────────────────
function mountain(b,cx,peakY,width,col){
  const r=col[0],g=col[1],c=col[2];
  for(let x=0;x<W;x++){
    const t=Math.abs(x-cx)/(width/2);
    if(t>1) continue;
    const y=Math.round(peakY+(1-Math.sqrt(1-Math.min(1,t*t)))*(H-peakY));
    for(let py=y;py<H;py++) setRGB(b,x,py,r,g,c);
  }
}

// ─── God rays ────────────────────────────────────────────────────────────────
function godRays(b,cx,topY,col,a){
  const r=col[0],g=col[1],c=col[2];
  for(let i=0;i<12;i++){
    const angle=((i/12)-0.5)*1.2+Math.PI/2;
    const wBase=0.04;
    for(let d=0;d<H*1.8;d+=1){
      const x=Math.round(cx+Math.cos(angle)*d);
      const y=Math.round(topY+Math.sin(angle)*d);
      const fa=a*(1-d/(H*1.8))*(1-Math.abs((i/12)-0.5)*1.5);
      if(fa<=0) continue;
      const hw=Math.round(d*wBase)+1;
      for(let dx=-hw;dx<=hw;dx++) blend(b,x+dx,y,r,g,c,fa*0.5);
    }
  }
}

// ─── Crowd silhouettes ───────────────────────────────────────────────────────
function crowd(b,baseY,n,col){
  const r=col[0],g=col[1],c=col[2];
  for(let i=0;i<n;i++){
    const bx=Math.round((i/n)*W*0.8+W*0.1+(fbm(i*0.3,0,2)-0.5)*60);
    const ph=18+Math.round(fbm(i*0.7,1,2)*18);
    const pw=7+Math.round(fbm(i*1.1,2,2)*6);
    const hr=Math.round(pw*0.55);
    for(let dy=-hr;dy<=hr;dy++) for(let dx=-hr;dx<=hr;dx++)
      if(dx*dx+dy*dy<=hr*hr) setRGB(b,bx+dx,baseY-ph-dy,r,g,c);
    fillRect(b,bx-Math.round(pw/2),baseY-ph,bx+Math.round(pw/2),baseY,r,g,c);
  }
}

// ─── Palm tree ───────────────────────────────────────────────────────────────
function palm(b,bx,by,h,col){
  const r=col[0],g=col[1],c=col[2];
  for(let dy=0;dy<h;dy++){
    const curve=Math.round(Math.sin(dy/h*Math.PI*0.6)*15);
    for(let dx=-2;dx<=2;dx++) setRGB(b,bx+curve+dx,by-dy,r,g,c);
  }
  const tx=bx+Math.round(Math.sin(Math.PI*0.6)*15), ty=by-h;
  for(let f=0;f<8;f++){
    const ang=(f/8)*Math.PI*2-Math.PI*0.25;
    const fl=Math.round(h*0.45);
    for(let d=0;d<fl;d++){
      const fx=Math.round(tx+Math.cos(ang)*d);
      const fy=Math.round(ty+Math.sin(ang)*d+d*0.4);
      for(let dx=-1;dx<=1;dx++) setRGB(b,fx+dx,fy,r,g,c);
    }
  }
}

// ─── Water surface ───────────────────────────────────────────────────────────
function water(b,wy,dark,light){
  for(let y=wy;y<H;y++){
    const t=(y-wy)/(H-wy||1);
    for(let x=0;x<W;x++){
      const wave=(Math.sin(x*0.04+y*0.15)*0.5+0.5)*0.12;
      const n=fbm(x/180,y/30,2)*0.15;
      const f=Math.min(1,t*0.7+wave+n);
      setRGB(b,x,y,clamp(dark[0]+(light[0]-dark[0])*f),clamp(dark[1]+(light[1]-dark[1])*f),clamp(dark[2]+(light[2]-dark[2])*f));
    }
  }
}

// ─── Parchment texture ───────────────────────────────────────────────────────
function parchment(b){
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){
    const crease=fbm(x/500,y/500,3);
    const fine=fbm(x/25,y/25,2)*0.4;
    const stain=fbm(x/120,y/120,3)*0.3;
    const dark=(crease*0.35+fine*0.1+stain*0.15);
    const i=(y*W+x)*3;
    b[i]  =clamp(b[i]  *(1-dark*0.5));
    b[i+1]=clamp(b[i+1]*(1-dark*0.45));
    b[i+2]=clamp(b[i+2]*(1-dark*0.6));
  }
}

// ─── Map lines ───────────────────────────────────────────────────────────────
function mapLines(b){
  for(let row=1;row<9;row++){
    const y=Math.round(row*H/9);
    for(let x=0;x<W;x++) blend(b,x,y,50,35,15,0.35);
    for(let x=0;x<W;x++) blend(b,x,y+1,50,35,15,0.2);
  }
  for(let col=1;col<13;col++){
    const x=Math.round(col*W/13);
    for(let y=0;y<H;y++) blend(b,x,y,50,35,15,0.3);
  }
  for(let x=0;x<W;x++){
    const n1=fbm(x/220,3,4), n2=fbm(x/180,5,4);
    const y1=Math.round(H*0.28+n1*H*0.28);
    const y2=Math.round(H*0.52+n2*H*0.22);
    for(let dy=-1;dy<=1;dy++){
      blend(b,x,y1+dy,35,22,8,0.7);
      blend(b,x,y2+dy,35,22,8,0.6);
    }
  }
}

// ─── Chain silhouette ────────────────────────────────────────────────────────
function chains(b,y0){
  const r=22,g=18,c=14;
  const linkW=36,linkH=18,gap=6;
  const links=Math.round(W/(linkW+gap))+2;
  for(let i=0;i<links;i++){
    const lx=i*(linkW+gap)-linkW/2;
    const ly=y0+Math.round((fbm(i*0.4,0,2)-0.5)*30);
    for(let a=0;a<360;a+=2){
      const rad=a*Math.PI/180;
      const ex=Math.round(lx+linkW/2+Math.cos(rad)*linkW/2);
      const ey=Math.round(ly+Math.sin(rad)*linkH/2);
      for(let t=-2;t<=2;t++) setRGB(b,ex,ey+t,r,g,c);
    }
  }
}

// ─── Fire fill ───────────────────────────────────────────────────────────────
function fire(b,fy){
  for(let y=fy;y<H;y++){
    const prog=(y-fy)/(H-fy||1);
    for(let x=0;x<W;x++){
      const n=fbm(x/90,y/45+2,3);
      const col_n=fbm(x/60,(H-y)/60,3);
      const heat=(1-prog)*(0.4+n*0.6);
      if(heat>0.05) blend(b,x,y,clamp(heat*255),clamp(heat*heat*100+col_n*30),clamp(heat*heat*5),Math.min(1,heat*1.8));
    }
  }
}

// ─── Smoke ───────────────────────────────────────────────────────────────────
function smoke(b,fy){
  for(let y=Math.max(0,fy-Math.round(H*0.5));y<fy;y++){
    for(let x=0;x<W;x++){
      const n=fbm(x/200,(fy-y)/150+1,3);
      const dist=(fy-y)/(H*0.5);
      blend(b,x,y,35,30,28,n*(1-dist)*0.5);
    }
  }
}

// ─── Write PNG ───────────────────────────────────────────────────────────────
const crcT=new Uint32Array(256);
for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);crcT[i]=c;}
function crc32(buf){let c=0xFFFFFFFF;for(let i=0;i<buf.length;i++)c=crcT[(c^buf[i])&0xFF]^(c>>>8);return(c^0xFFFFFFFF)>>>0;}
function chunk(type,data){
  const len=Buffer.alloc(4); len.writeUInt32BE(data.length);
  const tb=Buffer.from(type);
  const cc=Buffer.concat([tb,data]);
  const co=Buffer.alloc(4); co.writeUInt32BE(crc32(cc));
  return Buffer.concat([len,tb,data,co]);
}
function writePNG(fp,pixels){
  const rowSz=W*3;
  const raw=Buffer.alloc((rowSz+1)*H);
  for(let y=0;y<H;y++){
    raw[y*(rowSz+1)]=0;
    for(let x=0;x<W;x++){
      const s=(y*W+x)*3, d=y*(rowSz+1)+1+x*3;
      raw[d]=pixels[s];raw[d+1]=pixels[s+1];raw[d+2]=pixels[s+2];
    }
  }
  const comp=zlib.deflateSync(raw,{level:1});
  const ihdr=Buffer.alloc(13);
  ihdr.writeUInt32BE(W,0);ihdr.writeUInt32BE(H,4);
  ihdr[8]=8;ihdr[9]=2;
  const sig=Buffer.from([137,80,78,71,13,10,26,10]);
  fs.writeFileSync(fp,Buffer.concat([sig,chunk('IHDR',ihdr),chunk('IDAT',comp),chunk('IEND',Buffer.alloc(0))]));
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE BUILDERS
// ════════════════════════════════════════════════════════════════════════════

function scene01_scroll(){
  const b=mkBuf();
  gradient(b,[215,185,128],[178,148,92]);
  parchment(b);
  for(let y=0;y<80;y++){
    const f=1-(y/80);
    for(let x=0;x<W;x++){const i=(y*W+x)*3;b[i]=clamp(b[i]*(1-f*0.55));b[i+1]=clamp(b[i+1]*(1-f*0.5));b[i+2]=clamp(b[i+2]*(1-f*0.65));}
  }
  for(let y=H-80;y<H;y++){
    const f=1-((H-1-y)/80);
    for(let x=0;x<W;x++){const i=(y*W+x)*3;b[i]=clamp(b[i]*(1-f*0.55));b[i+1]=clamp(b[i+1]*(1-f*0.5));b[i+2]=clamp(b[i+2]*(1-f*0.65));}
  }
  for(let row=0;row<22;row++){
    const ly=Math.round(H*0.12+row*(H*0.76/22));
    const lw=Math.round(W*(0.35+fbm(row*0.4,0,2)*0.3));
    const lx=Math.round(W*0.1+fbm(row*0.6,1,2)*W*0.05);
    for(let x=lx;x<lx+lw;x++) blend(b,x,ly,45,25,8,0.28+fbm(x/40,row*0.2,2)*0.12);
  }
  for(let gi=0;gi<60;gi++){
    const gx=Math.round(W*0.12+fbm(gi*0.3,10,2)*W*0.76);
    const gy=Math.round(H*0.15+fbm(gi*0.7,11,2)*H*0.7);
    const gh=8+Math.round(fbm(gi*1.1,12,2)*20);
    for(let dy=0;dy<gh;dy++) blend(b,gx,gy+dy,40,22,6,0.5);
    if(fbm(gi*0.5,13,2)>0.5) for(let dx=0;dx<8;dx++) blend(b,gx+dx,gy,40,22,6,0.5);
  }
  for(let x=0;x<W;x++){
    const f=Math.max(0,0.7-Math.abs(x/W-0.35));
    for(let y=0;y<H;y++) blend(b,x,y,255,200,100,f*0.08);
  }
  vignette(b,0.75);
  return b;
}

function scene02_jerusalem(){
  const b=mkBuf();
  gradient(b,[8,4,18],[55,12,4]);
  smoke(b,Math.round(H*0.58));
  fire(b,Math.round(H*0.58));
  glow(b,Math.round(W*0.5),H,Math.round(W*0.6),[255,90,10],0.45);
  glow(b,Math.round(W*0.25),H,Math.round(W*0.35),[255,60,5],0.35);
  glow(b,Math.round(W*0.75),H,Math.round(W*0.35),[255,70,5],0.3);
  skyline(b,[12,7,4],42);
  fillRect(b,Math.round(W*0.35),Math.round(H*0.42),Math.round(W*0.65),Math.round(H*0.58),10,6,3);
  fillRect(b,Math.round(W*0.42),Math.round(H*0.28),Math.round(W*0.58),Math.round(H*0.42),10,6,3);
  fillRect(b,Math.round(W*0.47),Math.round(H*0.15),Math.round(W*0.53),Math.round(H*0.28),8,5,2);
  noiseLayer(b,220,120,[180,60,10],0.12,3);
  vignette(b,0.55);
  return b;
}

function scene03_spain(){
  const b=mkBuf();
  gradient(b,[18,25,80],[220,120,30],0,Math.round(H*0.55));
  for(let y=Math.round(H*0.45);y<Math.round(H*0.6);y++){
    const t=1-Math.abs(y-H*0.52)/(H*0.07);
    for(let x=0;x<W;x++) blend(b,x,y,255,180,60,Math.max(0,t)*0.4);
  }
  water(b,Math.round(H*0.55),[10,20,55],[40,70,110]);
  fillRect(b,0,Math.round(H*0.7),W,Math.round(H*0.78),20,16,12);
  noiseLayer(b,80,30,[10,8,5],0.3,3);
  ship(b,Math.round(W*0.3),Math.round(H*0.54),0.55,[8,6,4]);
  ship(b,Math.round(W*0.6),Math.round(H*0.545),0.45,[7,5,3]);
  ship(b,Math.round(W*0.8),Math.round(H*0.538),0.38,[8,6,4]);
  skyline(b,[15,12,10],77);
  crowd(b,Math.round(H*0.72),80,[12,10,8]);
  glow(b,Math.round(W*0.52),Math.round(H*0.52),120,[255,210,80],0.7);
  noiseLayer(b,300,200,[255,160,40],0.06,2);
  vignette(b,0.5);
  return b;
}

function scene04_westafrica(){
  const b=mkBuf();
  gradient(b,[15,30,55],[230,140,20],0,Math.round(H*0.5));
  glow(b,Math.round(W*0.5),Math.round(H*0.5),Math.round(W*0.55),[255,180,40],0.3);
  terrain(b,Math.round(H*0.52),H*0.06,320,[18,32,10]);
  for(let t=0;t<9;t++){
    const tx=Math.round(W*0.04+t*(W*0.12)+fbm(t*0.5,20,2)*80);
    const th=120+Math.round(fbm(t*0.8,21,2)*120);
    const tw=40+Math.round(fbm(t*1.2,22,2)*50);
    fillRect(b,tx-10,Math.round(H*0.52)-th,tx+10,Math.round(H*0.52),[12,20,7]);
    const twf=Math.round(tw*1.4);
    for(let dy=-tw;dy<=tw;dy++) for(let dx=-twf;dx<=twf;dx++){
      if(dx*dx/(twf*twf)+dy*dy/(tw*tw)<=1)
        setRGB(b,tx+dx,Math.round(H*0.52)-th+dy,8,16,5);
    }
  }
  fillRect(b,Math.round(W*0.55),Math.round(H*0.3),Math.round(W*0.92),Math.round(H*0.52),[16,12,6]);
  fillRect(b,Math.round(W*0.6),Math.round(H*0.15),Math.round(W*0.7),Math.round(H*0.3),[14,10,5]);
  fillRect(b,Math.round(W*0.73),Math.round(H*0.1),Math.round(W*0.79),Math.round(H*0.3),[12,9,4]);
  crowd(b,Math.round(H*0.5),100,[10,15,6]);
  noiseLayer(b,250,180,[200,120,20],0.07,2);
  vignette(b,0.5);
  return b;
}

function scene05_maps(){
  const b=mkBuf();
  gradient(b,[210,180,125],[175,145,88]);
  parchment(b);
  mapLines(b);
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){
    const ex=Math.min(x,W-1-x)/W, ey=Math.min(y,H-1-y)/H;
    const edge=1-Math.sqrt(ex*ey)*4;
    if(edge>0){const i=(y*W+x)*3;b[i]=clamp(b[i]*(1-edge*0.6));b[i+1]=clamp(b[i+1]*(1-edge*0.55));b[i+2]=clamp(b[i+2]*(1-edge*0.7));}
  }
  noiseLayer(b,300,250,[80,50,20],0.18,3);
  glow(b,Math.round(W*0.15),Math.round(H*0.5),Math.round(H*0.8),[255,210,150],0.12);
  vignette(b,0.6);
  return b;
}

function scene06_slavery(){
  const b=mkBuf();
  gradient(b,[12,14,18],[28,22,18],0,Math.round(H*0.6));
  noiseLayer(b,350,220,[40,38,35],0.5,5);
  noiseLayer(b,150,100,[5,5,5],0.4,4);
  water(b,Math.round(H*0.6),[8,10,14],[20,22,28]);
  glow(b,Math.round(W*0.5),Math.round(H*0.62),Math.round(W*0.4),[40,50,60],0.2);
  ship(b,Math.round(W*0.55),Math.round(H*0.59),1.0,[6,5,4]);
  ship(b,Math.round(W*0.25),Math.round(H*0.605),0.7,[5,4,3]);
  fillRect(b,0,Math.round(H*0.68),Math.round(W*0.4),Math.round(H*0.75),[14,11,9]);
  fillRect(b,0,Math.round(H*0.75),Math.round(W*0.45),H,[18,14,11]);
  chains(b,Math.round(H*0.8));
  chains(b,Math.round(H*0.85));
  noiseLayer(b,200,120,[5,5,5],0.25,3);
  vignette(b,0.75);
  for(let y=Math.round(H*0.85);y<H;y++){
    const f=(y-H*0.85)/(H*0.15);
    for(let x=0;x<W;x++){const i=(y*W+x)*3;b[i]=clamp(b[i]*(1-f*0.6));b[i+1]=clamp(b[i+1]*(1-f*0.6));b[i+2]=clamp(b[i+2]*(1-f*0.6));}
  }
  return b;
}

function scene07_deuteronomy(){
  const b=mkBuf();
  gradient(b,[5,8,22],[20,15,8],0,Math.round(H*0.65));
  noiseLayer(b,400,250,[30,25,15],0.45,5);
  terrain(b,Math.round(H*0.65),H*0.04,600,[10,9,7]);
  mountain(b,Math.round(W*0.5),Math.round(H*0.12),Math.round(W*0.85),[8,7,5]);
  mountain(b,Math.round(W*0.2),Math.round(H*0.35),Math.round(W*0.45),[10,9,7]);
  mountain(b,Math.round(W*0.8),Math.round(H*0.3),Math.round(W*0.4),[10,9,7]);
  godRays(b,Math.round(W*0.5),Math.round(H*0.12),[255,220,120],0.25);
  glow(b,Math.round(W*0.5),Math.round(H*0.12),Math.round(W*0.3),[255,220,100],0.35);
  for(let y=0;y<Math.round(H*0.25);y++){
    const f=Math.max(0,1-y/(H*0.25));
    for(let x=Math.round(W*0.3);x<Math.round(W*0.7);x++) blend(b,x,y,220,180,80,f*0.15);
  }
  const px=Math.round(W*0.5), py=Math.round(H*0.12);
  fillRect(b,px-5,py,px+5,py+55,[230,200,130]);
  fillRect(b,px-12,py+20,px+12,py+55,[200,170,110]);
  fillRect(b,px-30,py+15,px-12,py+22,[200,170,110]);
  fillRect(b,px+12,py+15,px+30,py+22,[200,170,110]);
  crowd(b,Math.round(H*0.64),200,[7,6,5]);
  noiseLayer(b,200,150,[10,8,5],0.15,3);
  vignette(b,0.6);
  return b;
}

function scene08_americas(){
  const b=mkBuf();
  gradient(b,[25,15,45],[210,130,30],0,Math.round(H*0.52));
  for(let y=Math.round(H*0.44);y<Math.round(H*0.58);y++){
    const t=1-Math.abs(y-H*0.51)/(H*0.07);
    for(let x=0;x<W;x++) blend(b,x,y,255,170,50,Math.max(0,t)*0.45);
  }
  water(b,Math.round(H*0.52),[12,55,70],[30,100,120]);
  terrain(b,Math.round(H*0.68),H*0.04,400,[12,30,10]);
  ship(b,Math.round(W*0.45),Math.round(H*0.52),0.85,[6,5,4]);
  ship(b,Math.round(W*0.62),Math.round(H*0.53),0.7,[5,4,3]);
  ship(b,Math.round(W*0.28),Math.round(H*0.535),0.6,[6,5,4]);
  for(let h=0;h<5;h++){
    terrain(b,Math.round(H*0.5+fbm(h*0.4,30,2)*H*0.1),H*0.06,200,[8+h*2,20+h*3,7+h]);
  }
  for(let p=0;p<8;p++){
    palm(b,Math.round(W*0.72+p*65+fbm(p*0.3,40,2)*30),Math.round(H*0.67),120+Math.round(fbm(p*0.7,41,2)*80),[7,18,5]);
  }
  for(let p=0;p<4;p++){
    palm(b,Math.round(W*0.02+p*55),Math.round(H*0.68),100+Math.round(fbm(p*0.5,42,2)*70),[7,18,5]);
  }
  glow(b,Math.round(W*0.5),Math.round(H*0.51),180,[255,200,80],0.5);
  noiseLayer(b,300,200,[200,130,30],0.05,2);
  vignette(b,0.45);
  return b;
}

// ════════════════════════════════════════════════════════════════════════════
const SCENES = [
  { file:'scene-01-scroll.png',     build:scene01_scroll      },
  { file:'scene-02-jerusalem.png',  build:scene02_jerusalem   },
  { file:'scene-03-spain.png',      build:scene03_spain       },
  { file:'scene-04-westafrica.png', build:scene04_westafrica  },
  { file:'scene-05-maps.png',       build:scene05_maps        },
  { file:'scene-06-slavery.png',    build:scene06_slavery     },
  { file:'scene-07-deuteronomy.png',build:scene07_deuteronomy },
  { file:'scene-08-americas.png',   build:scene08_americas    },
];

fs.mkdirSync(OUT,{recursive:true});
console.log('Generating cinematic scene images...\n');
for(const sc of SCENES){
  process.stdout.write('  Building '+sc.file+'...');
  const buf=sc.build();
  writePNG(path.join(OUT,sc.file),buf);
  console.log(' done');
}
console.log('\nAll 8 images generated in public/images/');
