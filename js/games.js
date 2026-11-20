(function goldenGateGames(){
'use strict';
const X=window.GoldenOSExtra;if(!X)return;
const {getBody:body,store,load,notify,frame,header}=X;
const rand=n=>Math.floor(Math.random()*n), keys={};
window.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||''))return;const id=document.querySelector('.window.active')?.dataset.app;if(keys[id]?.[e.key]){e.preventDefault();keys[id][e.key]()}});
function merge(){
 let b=load('mergeBoard',Array(16).fill(0)),points=load('mergePoints',0),best=load('mergeHigh',0);if(!Array.isArray(b)||b.length!==16)b=Array(16).fill(0);
 const spawn=()=>{let empty=b.map((v,i)=>v?-1:i).filter(i=>i>=0);if(empty.length)b[empty[rand(empty.length)]]=Math.random()<.9?2:4};
 const persist=()=>{store('mergeBoard',b);store('mergePoints',points);store('mergeHigh',best)};
 if(!b.some(Boolean)){spawn();spawn();persist()}
 function move(dir){
  const old=b.slice(),g=[0,1,2,3].map(i=>b.slice(4*i,4*i+4));
  function mergeLine(line){let vals=line.filter(Boolean);for(let i=0;i<vals.length-1;i++)if(vals[i]===vals[i+1]){vals[i]*=2;points+=vals[i];vals.splice(i+1,1)};return vals.concat(Array(4-vals.length).fill(0))}
  for(let r=0;r<4;r++){let v=dir==='ArrowLeft'||dir==='ArrowRight'?g[r].slice():g.map(row=>row[r]);if(dir==='ArrowRight'||dir==='ArrowDown')v.reverse();v=mergeLine(v);if(dir==='ArrowRight'||dir==='ArrowDown')v.reverse();for(let k=0;k<4;k++){if(dir==='ArrowLeft'||dir==='ArrowRight')g[r][k]=v[k];else g[k][r]=v[k]}}
  b=g.flat();if(b.some((v,i)=>v!==old[i])){spawn();best=Math.max(best,points);persist();draw()}
 }
 function draw(){
 frame('merge',`<div class="ex-game-screen ex-merge"><div class="ex-game-header"><div><div class="ex-eyebrow">PLAY THE NUMBERS</div><h1>2048<span>.</span></h1><p>Merge matching tiles. Can you reach 2048?</p></div><div class="ex-score-boxes"><div><span>SCORE</span><strong>${points}</strong></div><div><span>BEST</span><strong>${best}</strong></div></div></div><div class="ex-game-bar"><span>Arrow keys or swipe to move</span><button class="ex-btn" id="merge-new">New game</button></div><div class="ex-2048-board" id="merge-board">${b.map(v=>`<div class="ex-2048-cell v${Math.min(v,2048)}">${v||''}</div>`).join('')}</div><div class="ex-arrow-pad">${[['ArrowLeft','←'],['ArrowUp','↑'],['ArrowDown','↓'],['ArrowRight','→']].map(([k,t])=>`<button data-dir="${k}">${t}</button>`).join('')}</div></div>`);
 const el=body('merge');el.querySelector('#merge-new').onclick=()=>{b=Array(16).fill(0);points=0;spawn();spawn();persist();draw()};el.querySelectorAll('[data-dir]').forEach(e=>e.onclick=()=>move(e.dataset.dir));
 let touch;el.querySelector('#merge-board').addEventListener('touchstart',e=>touch=[e.touches[0].clientX,e.touches[0].clientY],{passive:true});el.querySelector('#merge-board').addEventListener('touchend',e=>{if(!touch)return;let dx=e.changedTouches[0].clientX-touch[0],dy=e.changedTouches[0].clientY-touch[1];if(Math.max(Math.abs(dx),Math.abs(dy))>25)move(Math.abs(dx)>Math.abs(dy)?dx>0?'ArrowRight':'ArrowLeft':dy>0?'ArrowDown':'ArrowUp')},{passive:true})
 }
 keys.merge=Object.fromEntries(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].map(k=>[k,()=>move(k)]));draw()
}
function snake(){
 let bodyParts=[[9,10],[8,10],[7,10]],direction=[1,0],next=[1,0],food=[15,10],score=0,best=load('snakeHigh',0),playing=false,ended=false,timer=0;
 function setFood(){let p=[];for(let y=0;y<20;y++)for(let x=0;x<20;x++)if(!bodyParts.some(t=>t[0]===x&&t[1]===y))p.push([x,y]);food=p.length?p[rand(p.length)]:[-1,-1]}
 function turn(k){let d={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[k];if(d&&!(d[0]===-direction[0]&&d[1]===-direction[1]))next=d}
 function update(){if(!playing||!body('snake')){clearInterval(timer);return}direction=next;let h=[bodyParts[0][0]+direction[0],bodyParts[0][1]+direction[1]],ate=h[0]===food[0]&&h[1]===food[1];
 if(h.some(v=>v<0||v>=20)||bodyParts.slice(0,ate?undefined:-1).some(p=>p[0]===h[0]&&p[1]===h[1])){ended=true;playing=false;clearInterval(timer);paint();return}
 bodyParts.unshift(h);if(ate){score++;best=Math.max(best,score);store('snakeHigh',best);setFood()}else bodyParts.pop();paint()}
 function play(){if(ended){bodyParts=[[9,10],[8,10],[7,10]];direction=[1,0];next=[1,0];score=0;ended=false;setFood()}playing=!playing;clearInterval(timer);if(playing)timer=setInterval(update,125);paint()}
 function paint(){let el=body('snake');if(!el)return;let ctx=el.querySelector('canvas').getContext('2d');ctx.fillStyle='#111a2e';ctx.fillRect(0,0,400,400);ctx.strokeStyle='#ffffff0e';for(let i=0;i<=20;i++){ctx.beginPath();ctx.moveTo(i*20,0);ctx.lineTo(i*20,400);ctx.moveTo(0,i*20);ctx.lineTo(400,i*20);ctx.stroke()}ctx.fillStyle='#fa7e9c';ctx.beginPath();ctx.arc(food[0]*20+10,food[1]*20+10,7,0,2*Math.PI);ctx.fill();bodyParts.forEach((p,i)=>{ctx.fillStyle=i?'#71e5b5':'#dcffec';ctx.beginPath();ctx.roundRect(p[0]*20+2,p[1]*20+2,16,16,5);ctx.fill()});el.querySelector('#snake-score').textContent=score;el.querySelector('#snake-best').textContent=best;el.querySelector('#snake-play').textContent=ended?'Restart':playing?'Pause':'Play';el.querySelector('#snake-tip').textContent=ended?'Game over — try again!':playing?'Collect the glowing dots':'Press Play to begin'}
 frame('snake',`<div class="ex-snake-screen"><div class="ex-snake-side"><div class="ex-eyebrow">ARCADE EXCLUSIVE</div><h1>Neon<br>Snake<span>.</span></h1><p>Catch the glowing pink dots, but avoid walls and your own tail.</p><div class="ex-score-boxes"><div><span>SCORE</span><strong id="snake-score">0</strong></div><div><span>BEST</span><strong id="snake-best">${best}</strong></div></div><button class="ex-btn ex-primary" id="snake-play">Play</button><p id="snake-tip">Press Play to begin</p><div class="ex-snake-controls">${[['ArrowLeft','←'],['ArrowUp','↑'],['ArrowDown','↓'],['ArrowRight','→']].map(([k,t])=>`<button data-dir="${k}">${t}</button>`).join('')}</div></div><canvas width="400" height="400"></canvas></div>`);
 let el=body('snake');el.querySelector('#snake-play').onclick=play;el.querySelectorAll('[data-dir]').forEach(e=>e.onclick=()=>turn(e.dataset.dir));keys.snake=Object.fromEntries(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].map(k=>[k,()=>turn(k)]));keys.snake[' ']=play;paint()
}
function memory(){
 const symbols=['🦋','🍀','🌙','⭐','🎧','🎨','🪐','🌈'];let cards=[],visible=[],matched=new Set(),moves=0,best=load('memoryHigh',null),locked=false,resetTimer=0;
 function restart(){clearTimeout(resetTimer);cards=[...symbols,...symbols].map((v,i)=>({v,i})).sort(()=>Math.random()-.5);visible=[];matched=new Set();moves=0;locked=false;draw()}
 function flip(i){if(locked||visible.includes(i)||matched.has(i))return;visible.push(i);if(visible.length===2){moves++;if(cards[visible[0]].v===cards[visible[1]].v){visible.forEach(k=>matched.add(k));visible=[];if(matched.size===16){if(best===null||moves<best){best=moves;store('memoryHigh',best)}notify('You found all pairs!')}}else{locked=true;resetTimer=setTimeout(()=>{visible=[];locked=false;draw()},850)}}draw()}
 function draw(){frame('memory',`<div class="ex-game-screen ex-memory">${header('TEST YOUR MEMORY','Memory Match.','Find all eight pairs in as few moves as possible.')}<div class="ex-game-stats"><span>Moves: <b>${moves}</b></span><span>Pairs: <b>${matched.size/2}/8</b></span><span>Best: <b>${best??'—'}</b></span><button class="ex-btn" id="memory-new">New game</button></div><div class="ex-memory-grid">${cards.map((o,i)=>`<button class="ex-memory-card ${visible.includes(i)||matched.has(i)?'flipped':''} ${matched.has(i)?'matched':''}" data-flip="${i}">${visible.includes(i)||matched.has(i)?o.v:'✧'}</button>`).join('')}</div>${matched.size===16?'<div class="ex-game-message">Perfect match! ✨</div>':''}</div>`);const el=body('memory');el.querySelector('#memory-new').onclick=restart;el.querySelectorAll('[data-flip]').forEach(e=>e.onclick=()=>flip(+e.dataset.flip))}
 restart()
}
function mines(){
 const N=9,MINES=12;let cells=[],first=true,over=false,winner=false,flags=0;
 function neighbors(i){let x=i%N,y=Math.floor(i/N),a=[];for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){let xx=x+dx,yy=y+dy;if((dx||dy)&&xx>=0&&xx<N&&yy>=0&&yy<N)a.push(yy*N+xx)}return a}
 function reset(){cells=Array.from({length:81},(_,i)=>({i,mine:false,seen:false,flag:false,n:0}));first=true;over=winner=false;flags=0;draw()}
 function seed(safe){const p=cells.map((_,i)=>i).filter(i=>i!==safe&&!neighbors(safe).includes(i)).sort(()=>Math.random()-.5);p.slice(0,MINES).forEach(i=>cells[i].mine=true);cells.forEach(t=>t.n=neighbors(t.i).filter(i=>cells[i].mine).length);first=false}
 function show(i){const todo=[i];while(todo.length){const t=cells[todo.pop()];if(t.seen||t.flag||t.mine)continue;t.seen=true;if(t.n===0)todo.push(...neighbors(t.i).filter(j=>!cells[j].seen))}}
 function action(i,flag=false){const c=cells[i];if(!c||over||c.seen)return;if(flag){c.flag=!c.flag;flags+=c.flag?1:-1;draw();return}if(c.flag)return;if(first)seed(i);if(c.mine){over=true;cells.filter(t=>t.mine).forEach(t=>t.seen=true)}else{show(i);if(cells.filter(t=>t.seen).length===81-MINES){over=true;winner=true;notify('All mines avoided!')}}draw()}
 function draw(){frame('mines',`<div class="ex-game-screen ex-mines">${header('A TIMELESS PUZZLE','Mines.','Find the safe cells. Flag the hidden mines.')}<div class="ex-game-stats"><span>Flags: <b>${flags}/${MINES}</b></span><button class="ex-btn" id="mines-new">New field</button></div><div class="ex-mines-board" style="--mine-size:9">${cells.map(t=>`<button class="ex-mine ${t.seen?'seen':''} ${t.seen&&t.mine?'bomb':''}" data-cell="${t.i}">${t.flag?'⚑':t.seen?(t.mine?'✸':t.n?`<span class="num${t.n}">${t.n}</span>`:''):''}</button>`).join('')}</div><div class="ex-game-message">${over?(winner?'You won! ✨':'Game over!'):'Tap to reveal · Right click to flag'}</div><label class="ex-mines-foot">Flag mode for touch <input type="checkbox" id="mines-flag"></label></div>`);const el=body('mines');el.querySelector('#mines-new').onclick=reset;el.querySelectorAll('[data-cell]').forEach(e=>{e.onclick=()=>action(+e.dataset.cell,!!body('mines')?.querySelector('#mines-flag')?.checked);e.oncontextmenu=ev=>{ev.preventDefault();action(+e.dataset.cell,true)}})}
 reset()
}
X.register('merge',merge);X.register('snake',snake);X.register('memory',memory);X.register('mines',mines)
})();