const stack=document.querySelector('#stack');

const pancakeStack=document.createElement('div');
pancakeStack.className='stack-art';
pancakeStack.setAttribute('role','img');
pancakeStack.setAttribute('aria-label','Tall stack of pancakes');
for(const top of [0,320,632]){
 const layer=document.createElement('img');
 layer.className='stack-layer';
 layer.src='assets/figma-pancake-stack-layer.png';
 layer.alt='';
 layer.style.top=top/1040*100+'%';
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

const statueColumn=document.querySelector('#statues');
for(let i=0;i<9;i++){
 const bear=document.createElement('img');bear.src='assets/grizzly-bear.png';bear.className='grizzly-comparison';bear.alt='Grizzly bear '+(i+1)+' of 9';bear.width=6486;bear.height=4048;bear.loading='lazy';bear.decoding='async';bear.draggable=false;statueColumn.append(bear);
}
for(let i=0;i<4;i++){
 const statue=document.createElement('img');statue.src='assets/statue-of-liberty.png';statue.className='liberty-statue';statue.alt='Statue of Liberty '+(i+1)+' of 4';statue.width=1322;statue.height=3575;statue.loading='lazy';statue.decoding='async';statue.draggable=false;statueColumn.append(statue);
}
