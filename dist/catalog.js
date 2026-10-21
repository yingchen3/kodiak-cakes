// Shared by the canvas, stack, and label editor. Approved entries live in submissions.js.
(() => {
 let seed=52021;
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const entries=window.SUBMISSIONS.map(entry=>({...entry}));
 const sizes={bear:[230,222],fish:[285,125],flower:[141,139]};
 // Sample positions over the entire world, without rows or columns.
 for(let attempt=0;entries.length<35&&attempt<3000;attempt++){
  const x=400+random()*9000,y=350+random()*7000;
  if(entries.some(e=>Math.hypot(e.x-x,e.y-y)<690))continue;
  const kind=['bear','fish','flower'][Math.floor(random()*3)];
  const [width,height]=sizes[kind];
  entries.push({id:'sample-'+entries.length,kind,x,y,width,height,name:'Sample creation',message:'Contributor details coming soon',sample:true});
 }
 // Every new Figma design gets a stable, irregular placement. Exported edits
 // retain these IDs, so reloading a saved catalog does not create duplicates.
 const preferred=[[4750, 4150], [6050, 3800], [4000, 4100], [5600, 3300], [4800, 3000], [5700, 4700], [4000, 3100], [4900, 4900]];
 for(const [index,art] of (window.NEW_PANCAKES||[]).entries()){
  const id='figma-'+art.figmaNode.replace(':','-');
  if(entries.some(entry=>entry.id===id))continue;
  let position=null;
  for(let attempt=0;attempt<10000;attempt++){
   const proposed=attempt===0&&preferred[index]?preferred[index]:[400+random()*9000,350+random()*7000];
   if(entries.every(e=>Math.hypot(e.x-proposed[0],e.y-proposed[1])>=530)){position=proposed;break}
  }
  if(!position)throw new Error('Could not place '+art.displayName);
  entries.push({...art,id,x:position[0],y:position[1],name:'Sample creation',message:'Contributor details coming soon',sample:true});
 }
 // Fictional demo names are derived from the entry ID, so they stay consistent.
 const firstNames=['Avery','Maya','Oliver','Sofia','Ethan','Nora','Liam','Chloe','Noah','Isla','Amelia','Leo','Zoe','Felix','Ella','Miles','Ruby','Owen','Ivy','Theo','Luna','Caleb','Aria','Jasper','Ada','Finn','Elena','Eli','Hazel','Lucas','Naomi','Rowan','Clara','Oscar','Grace','Silas','Nina','Julian','Alice','Kai','Leah','Emmett','Violet','Ezra','Lucy','Gabriel','Mila','Sebastian','Rose','Isaac'];
 const lastNames=['Bennett','Reed','Parker','Hayes','Brooks','Morgan','Sullivan','Chen','Rivera','Patel','Kim','Ellis','Walker','Stone','Carter','Nguyen','Turner','Bell','Cooper','Bailey','Foster','Wells','Santos','Allen','Gray','Wilson','Cole','Hart','Flores','Young','Miller','Shah','Scott','Green','Davis','Clark','Lewis','Price','Adams','Baker'];
 function demoName(id){let hash=2166136261;for(const char of id)hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;const first=firstNames[hash%firstNames.length];return hash%4===0?first:first+' '+lastNames[Math.floor(hash/firstNames.length)%lastNames.length]}
 const placeholder=name=>typeof name==='string'&&name.trim().toLowerCase()==='sample creation';
 for(const entry of entries)if(placeholder(entry.name)){entry.name=demoName(entry.id);entry.sample=true}
 // Remove the retired dolphin after placement so all other positions stay fixed.
 for(let i=entries.length-1;i>=0;i--)if(entries[i].kind==='new-dolphin'||entries[i].figmaNode==='8:464')entries.splice(i,1);
 // Match the contribution frame by artwork name, rather than scenery habitat.
 const normalize=value=>String(value||'').toLowerCase().replace(/\?/g,'').replace(/\s+pancake$/,'').trim();
 const messagePlaceholder=value=>typeof value==='string'&&value.trim().toLowerCase()==='contributor details coming soon';
 const contributionById=new Map();
 function statementHash(id){let h=2166136261;for(const char of id)h=Math.imul(h^char.charCodeAt(0),16777619)>>>0;return h}
 for(const group of window.CONTRIBUTION_GROUPS||[]){
  const names=new Set(group.pancakes.map(normalize));
  const members=entries.filter(entry=>names.has(normalize(entry.displayName||entry.kind.replace(/^new-/, '').replace(/-/g,' '))));
  // A deterministic shuffle followed by round robin uses every location while
  // keeping assignments consistent across reloads and label exports.
  members.sort((a,b)=>statementHash(a.id)-statementHash(b.id)||a.id.localeCompare(b.id));
  members.forEach((entry,index)=>contributionById.set(entry.id,group.statements[(index+statementHash(group.name))%group.statements.length]));
 }
 for(const entry of entries)if(messagePlaceholder(entry.message)&&contributionById.has(entry.id))entry.message=contributionById.get(entry.id);
 window.PANCAKE_SOURCE=entries;
 let overrides={};try{overrides=JSON.parse(localStorage.getItem('kodiak-labels-v1')||'{}')}catch{}
 window.PANCAKE_CATALOG=entries.map(entry=>{const merged={...entry,...(overrides[entry.id]||{})};if(placeholder(merged.name))merged.name=entry.name;if(messagePlaceholder(merged.message)&&contributionById.has(entry.id))merged.message=contributionById.get(entry.id);return merged});
})();
