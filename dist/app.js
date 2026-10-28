const viewport=document.querySelector('#viewport'),world=document.querySelector('#world'),label=document.querySelector('#label');
// The heading sits in the clear strip between the upper artwork and the starting-view pancakes.
const W=10000,H=8000,HEADING_TOP=3420;let scale=1,x=0,y=0,dragged=false,active=null,frame=null,inertia=0;
const asset=(name)=>'assets/'+name;
for(let r=0;r<8;r++)for(let c=0;c<7;c++){const tile=document.createElement('div');tile.className='paper-tile';tile.style.left=c*1536+'px';tile.style.top=r*1024+'px';tile.style.transform=`scale(${c%2?-1:1},${r%2?-1:1})`;world.append(tile)}
// Keep the sample layout heading anchored to the landscape as it pans and zooms.
const heading=document.createElement('header');heading.className='canvas-heading';heading.innerHTML='<h1>Your Pancakes protect the wild</h1><p>Every pancake art you share, Kodiak donates $1 to protecting wild ecosystems</p>';world.append(heading);
function decoration(name,left,top,width,height,rotation=0){const img=document.createElement('img');img.src=asset(name+'.svg');img.alt='';img.className='decoration';img.draggable=false;Object.assign(img.style,{left:left+'px',top:top+'px',width:width+'px',height:height+'px',transform:`rotate(${rotation}deg)`});world.append(img)}
// Preserve the original Figma composition around the starting view.
const ox=4300,oy=3488;
[[61,118],[114,204],[167,68],[371,340]].forEach(([a,b])=>decoration('tree',ox+a,oy+b,110,148,-.61));
function water(a,b){decoration('water1',a,b,398,31);decoration('water2',a+260,b+34,139,23);decoration('water3',a+81,b+75,372,27)}
water(ox+808,oy+264);decoration('grass1',ox+935,oy+859,105,81);decoration('grass2',ox+832,oy+842,65,43);
function stem(a,b){decoration('stem',a+83,b+101,23,154);decoration('leaf',a+34,b+180,52,41)}
stem(5396,4191);
// Deterministic groups keep the landscape varied and leave breathing room.
let seed=42;function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
const entries=window.PANCAKE_CATALOG;
// Landscape elements have their own spacing, independent of pancake placement.
const scenery=[];
function sceneryPoint(radius){
 for(let attempt=0;attempt<500;attempt++){
  const a=220+random()*9300,b=220+random()*7300;
  if(a>4200&&a<5700&&b>3450&&b<4550)continue;
  if(entries.some(e=>Math.hypot(e.x-a,e.y-b)<330))continue;
  if(scenery.some(p=>Math.hypot(p[0]-a,p[1]-b)<radius))continue;
  scenery.push([a,b]);return[a,b];
 }return null;
}
for(let i=0;i<28;i++){const p=sceneryPoint(320);if(!p)continue;decoration('tree',p[0],p[1],110,148,-.61);if(random()<.3)decoration('tree',p[0]+62,p[1]+47,110,148,-.61)}
for(let i=0;i<5;i++){const p=sceneryPoint(480);if(p)water(p[0],p[1])}
for(let i=0;i<32;i++){const p=sceneryPoint(240);if(p){const large=random()<.5;decoration(large?'grass1':'grass2',p[0],p[1],large?105:65,large?81:43)}}
// Tie animals to their habitats while preserving irregular landscape placement.
for(const [index,e] of entries.entries()){
 if((e.kind==='fish'||e.habitat==='water')&&e.id!=='fish-original')water(e.x-145,e.y+Math.min(e.height-25,110));
 if((e.kind==='bear'||e.habitat==='woodland')&&e.id!=='bear-original'){
  const shift=(index%3)*21;
  decoration('tree',e.x-100-shift,e.y-62+shift,110,148,-.61);
  decoration('tree',e.x+e.width-30,e.y+e.height-92-shift,110,148,-.61);
  if(index%2===0)decoration('tree',e.x-28,e.y-156,110,148,-.61);
 }
 if(e.kind==='flower'&&e.id!=='flower-original')stem(e.x,e.y);
}
// New grass patches and mushroom drawings stay sparse, including small accents
// near meadow pancakes as in the sample layout.
for(const [index,e] of entries.entries()){
 if(e.habitat==='meadow'&&index%3===0)decoration('new/grass-patch',e.x+e.width*.45,e.y+e.height-20,104,116);
 if(e.habitat==='woodland'&&index%4===0){decoration('new/mushroom-1',e.x+e.width+95,e.y+e.height-35,66,77);decoration('new/mushroom-2',e.x+e.width+171,e.y+e.height+10,67,69)}
}
for(let i=0;i<9;i++){const p=sceneryPoint(350);if(p){decoration('new/mushroom-1',p[0],p[1],66,77);if(i%2===0)decoration('new/mushroom-2',p[0]+75,p[1]+40,67,69)}}
for(let i=0;i<10;i++){const p=sceneryPoint(300);if(p)decoration('new/grass-patch',p[0],p[1],104,116)}
function show(entry,button){active={entry,button};const title=document.createElement('strong'),copy=document.createElement('span');title.textContent=entry.name;copy.textContent=entry.message;label.replaceChildren(title,copy);label.hidden=false;positionLabel()}
function hide(){active=null;label.hidden=true}
function positionLabel(){if(!active)return;const r=active.button.getBoundingClientRect();let left=r.right+14,top=r.top-35;const lw=label.offsetWidth,lh=label.offsetHeight;if(left+lw>innerWidth-16)left=r.left-lw-14;left=Math.max(12,Math.min(left,innerWidth-lw-12));top=Math.max(12,Math.min(top,innerHeight-lh-12));label.style.left=left+'px';label.style.top=top+'px'}
for(const entry of entries){const button=document.createElement('button');button.className='pancake';button.dataset.id=entry.id;button.setAttribute('aria-label',(entry.displayName||entry.kind)+' pancake by '+entry.name);Object.assign(button.style,{left:(entry.x-9)+'px',top:(entry.y-9)+'px',width:(entry.width+18)+'px',height:(entry.height+18)+'px'});const img=document.createElement('img');img.src=entry.image||asset(entry.kind+'-flat.svg');img.alt='';img.draggable=false;img.loading='lazy';img.decoding='async';button.append(img);button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&!pointers.size)show(entry,button)});button.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')hide()});button.addEventListener('focus',()=>show(entry,button));button.addEventListener('blur',hide);button.addEventListener('click',e=>{if(e.detail!==0||dragged)return;if(active?.button===button)hide();else show(entry,button)});world.append(button)}
function paint(){x=Math.min(0,Math.max(innerWidth-W*scale,x));y=Math.min(0,Math.max(innerHeight-H*scale,y));world.style.transform=`translate(${x}px,${y}px) scale(${scale})`;positionLabel()}
function home(){cancelAnimationFrame(inertia);scale=innerWidth<600?.65:Math.min(1,innerWidth/1440);const naturalCenterY=4000-Math.max(0,1024-innerHeight)*.8;const centerY=Math.min(naturalCenterY,HEADING_TOP+(innerHeight/2-50)/scale);x=innerWidth/2-5020*scale;y=innerHeight/2-centerY*scale;hide();paint()}
function zoom(factor,cx=innerWidth/2,cy=innerHeight/2){const next=Math.max(.35,Math.min(1.8,scale*factor));x=cx-(cx-x)*next/scale;y=cy-(cy-y)*next/scale;scale=next;paint()}
const pointers=new Map();let startX=0,startY=0,lastX=0,lastY=0,vx=0,vy=0,previousDistance=0;
viewport.addEventListener('pointerdown',e=>{cancelAnimationFrame(inertia);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});startX=lastX=e.clientX;startY=lastY=e.clientY;dragged=false;vx=vy=0;previousDistance=0;viewport.setPointerCapture(e.pointerId);viewport.classList.add('dragging')});
viewport.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const[a,b]=[...pointers.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(previousDistance)zoom(d/previousDistance,(a.x+b.x)/2,(a.y+b.y)/2);previousDistance=d;dragged=true;hide();return}const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.hypot(e.clientX-startX,e.clientY-startY)>5){dragged=true;hide();document.querySelector('#hint').classList.add('faded')}x+=dx;y+=dy;vx=dx;vy=dy;lastX=e.clientX;lastY=e.clientY;paint()});
function end(e){pointers.delete(e.pointerId);previousDistance=0;if(pointers.size){const p=[...pointers.values()][0];lastX=p.x;lastY=p.y;return}viewport.classList.remove('dragging');if(!dragged){const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.pancake');if(target){const entry=entries.find(i=>i.id===target.dataset.id);active?.button===target?hide():show(entry,target)}else hide()}else if(!matchMedia('(prefers-reduced-motion: reduce)').matches){function coast(){vx*=.91;vy*=.91;x+=vx;y+=vy;paint();if(Math.abs(vx)+Math.abs(vy)>.3)inertia=requestAnimationFrame(coast)}inertia=requestAnimationFrame(coast)}}
viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);viewport.classList.remove('dragging');hide()});
viewport.addEventListener('wheel',e=>{e.preventDefault();hide();if(e.ctrlKey||e.metaKey)zoom(Math.exp(-e.deltaY*.008),e.clientX,e.clientY);else{x-=e.deltaX;y-=e.deltaY;paint()}document.querySelector('#hint').classList.add('faded')},{passive:false});
viewport.addEventListener('keydown',e=>{const moves={ArrowLeft:[100,0],ArrowRight:[-100,0],ArrowUp:[0,100],ArrowDown:[0,-100]};if(moves[e.key]){e.preventDefault();[x,y]=[x+moves[e.key][0],y+moves[e.key][1]];hide();paint()}else if(e.key==='+'||e.key==='=')zoom(1.2);else if(e.key==='-')zoom(1/1.2);else if(e.key==='Home')home();else if(e.key==='Escape')hide()});
document.querySelector('#in').onclick=()=>zoom(1.2);document.querySelector('#out').onclick=()=>zoom(1/1.2);document.querySelector('#home').onclick=home;window.addEventListener('resize',paint);home();
