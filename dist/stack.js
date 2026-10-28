const stack=document.querySelector('#stack');

const pancakeStack=document.createElement('div');
pancakeStack.className='stack-art';
pancakeStack.setAttribute('role','img');
pancakeStack.setAttribute('aria-label','Tall stack of pancakes');
const layerTops=[0];
for(let i=1;i<10;i++)layerTops.push(layerTops[i-1]+(i%2?320:312));
const stackHeight=layerTops[layerTops.length-1]+408;
pancakeStack.style.aspectRatio=`295 / ${stackHeight}`;
for(const top of layerTops){
 const layer=document.createElement('img');
 layer.className='stack-layer';
 layer.src='assets/figma-pancake-stack-layer.png';
 layer.alt='';
 layer.style.top=top/stackHeight*100+'%';
 layer.style.height=408/stackHeight*100+'%';
 layer.width=295;
 layer.height=408;
 layer.draggable=false;
 pancakeStack.append(layer);
}
stack.append(pancakeStack);

const plate=document.createElement('img');
plate.className='stack-plate';
plate.src='assets/plate.png';
plate.alt='White plate beneath the pancake stack';
plate.width=4337;
plate.height=1931;
plate.loading='lazy';
plate.draggable=false;
stack.append(plate);

const bearColumn=document.querySelector('#bears');
const bears=[];
for(let i=0;i<3;i++){
 const bear=document.createElement('img');bear.src='assets/grizzly-bear.png';bear.className='grizzly-comparison';bear.alt='Grizzly bear '+(i+1)+' of 3';bear.width=6486;bear.height=4048;bear.loading='eager';bear.decoding='async';bear.draggable=false;bearColumn.append(bear);bears.push(bear);
}
function matchBearStackHeight(){
 const height=pancakeStack.getBoundingClientRect().height;
 bearColumn.style.height=height+'px';
 for(const bear of bears)bear.style.height=height/bears.length+'px';
}
new ResizeObserver(matchBearStackHeight).observe(pancakeStack);
matchBearStackHeight();
