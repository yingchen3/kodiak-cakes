const stack=document.querySelector('#stack'),label=document.querySelector('#label');let selected=null;
function hide(){selected=null;label.hidden=true}
function position(){if(!selected)return;const r=selected.getBoundingClientRect();let left=r.right+16;if(left+label.offsetWidth>innerWidth-12)left=r.left-label.offsetWidth-16;label.style.left=Math.max(12,Math.min(left,innerWidth-label.offsetWidth-12))+'px';label.style.top=Math.max(12,Math.min(r.top+20,innerHeight-label.offsetHeight-12))+'px'}
function show(entry,button){selected=button;const name=document.createElement('strong'),message=document.createElement('span');name.textContent=entry.name;message.textContent=entry.message;label.replaceChildren(name,message);label.hidden=false;position()}
for(const [index,entry] of window.PANCAKE_CATALOG.entries()){
 const button=document.createElement('button');button.className='stack-item';button.setAttribute('aria-label',(entry.displayName||entry.kind)+' pancake by '+entry.name);button.style.setProperty('--offset',((index*37%29)-14)+'px');button.style.setProperty('--turn',((index*11%9)-4)+'deg');
 const image=document.createElement('img');image.src=entry.image||'assets/'+entry.kind+'-flat.svg';image.alt='';image.loading=index>4?'lazy':'eager';image.draggable=false;button.append(image);
 button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')show(entry,button)});button.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')hide()});button.addEventListener('focus',()=>show(entry,button));button.addEventListener('blur',hide);button.addEventListener('click',()=>show(entry,button));stack.append(button);
}
window.addEventListener('scroll',hide,{passive:true});window.addEventListener('resize',position);document.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});document.addEventListener('pointerdown',e=>{if(!e.target.closest('.stack-item'))hide()});
