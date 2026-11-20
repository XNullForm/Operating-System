(function newPuzzleGames(){
"use strict";
const X=window.GoldenOSExtra;if(!X)return;
const {getBody:body,store,load,notify,esc,frame,header}=X;
const r=n=>Math.floor(Math.random()*n);
let mergeMove=null;
window.addEventListener('keydown',e=>{if(document.querySelector('.window.active')?.dataset.app==='merge'&&mergeMove&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();mergeMove(e.key)}});
function merge(){
let s=load('mergeV4',null);if(!s||!Array.isArray(s.board)||s.board.length!==16)s={board:Array(16).fill(0),score:0,best:0,won:false};
const save=()=>store('mergeV4',s);
function spawn(){let avail=s.board.map((v,i)=>v?null:i).filter(x=>x!==null);if(avail.length)s.board[avail[r(avail.length)]]=Math.random()<.9?2:4}
if(!s.board.some(Boolean)){spawn();spawn();save()}
function move(dir){
let prior=s.board.slice(),m=Array.from({length:4},(_,i)=>prior.slice(i*4,i*4+4));
for(let i=0;i<4;i++){
let a=(dir==='ArrowLeft'||dir==='ArrowRight')?m[i].slice():m.map(row=>row[i]);
if(dir==='ArrowRight'||dir==='ArrowDown')a.reverse();
a=a.filter(Boolean);
for(let j=0;j<a.length-1;j++)if(a[j]===a[j+1]){a[j]*=2;s.score+=a[j];a.splice(j+1,1);if(a[j]>=2048)s.won=true}
while(a.length<4)a.push(0);
if(dir==='ArrowRight'||dir==='ArrowDown')a.reverse();
for(let j=0;j<4;j++){if(dir==='ArrowLeft'||dir==='ArrowRight')m[i][j]=a[j];else m[j][i]=a[j]}
}
s.board=m.flat();if(s.board.some((n,i)=>n!==prior[i])){spawn();s.best=Math.max(s.best,s.score);save();draw()}
}
function draw(){
const over=s.board.every(Boolean)&&!s.board.some((v,i)=>i%4<3&&v===s.board[i+1]||i<12&&v===s.board[i+4]);
frame('merge',`<div class="ex-game-screen ex-merge">${header('THE NUMBER PUZZLE','2048.','Join the tiles. Reach 2048. Keep going.')}<div class="ex-game-stats"><span>Score <b>${s.score}</b></span><span>Best <b>${s.best}</b></span><button class="ex-btn" id="merge-reset">New game</button></div><div class="ex-2048-board" id="merge-board">${s.board.map(v=>`<div class="ex-2048-cell v${Math.min(2048,v)}">${v||''}</div>`).join('')}</div><p class="ex-game-message">${over?'No moves left. Start a new game!':s.won?'2048 reached! You can keep going.':'Use arrow keys, swipe, or the controls.'}</p><div class="ex-arrow-pad">${[['ArrowLeft','←'],['ArrowUp','↑'],['ArrowDown','↓'],['ArrowRight','→']].map(([k,v])=>`<button data-dir="${k}">${v}</button>`).join('')}</div></div>`);
let b=body('merge');b.querySelector('#merge-reset').onclick=()=>{s={board:Array(16).fill(0),score:0,best:s.best,won:false};spawn();spawn();save();draw()};
b.querySelectorAll('[data-dir]').forEach(x=>x.onclick=()=>move(x.dataset.dir));
let touch=null;const board=b.querySelector('#merge-board');board.ontouchstart=e=>{touch=[e.touches[0].clientX,e.touches[0].clientY]};board.ontouchend=e=>{if(!touch)return;let dx=e.changedTouches[0].clientX-touch[0],dy=e.changedTouches[0].clientY-touch[1];if(Math.max(Math.abs(dx),Math.abs(dy))>25)move(Math.abs(dx)>Math.abs(dy)?(dx>0?'ArrowRight':'ArrowLeft'):(dy>0?'ArrowDown':'ArrowUp'));touch=null};
}
mergeMove=move;draw()}
function memory(){
const symbols=['🌈','🌙','⭐','🐋','🍓','🦋','🎨','🍀'];let deck=[],open=[],matched=[],moves=0,locked=false,best=load('memoryBest',null),timer;
function restart(){deck=[...symbols,...symbols].map((value,i)=>({i,value})).sort(()=>Math.random()-.5);open=[];matched=[];moves=0;locked=false;clearTimeout(timer);draw()}
function flip(i){if(locked||open.includes(i)||matched.includes(i))return;open.push(i);if(open.length===2){moves++;if(deck[open[0]].value===deck[open[1]].value){matched.push(...open);open=[];if(matched.length===16){if(!best||moves<best){best=moves;store('memoryBest',best)}notify(`Memory Match complete in ${moves} moves!`)}}else{locked=true;timer=setTimeout(()=>{open=[];locked=false;draw()},850)}}draw()}
function draw(){frame('memory',`<div class="ex-game-screen ex-memory">${header('A LITTLE BRAIN BOOST','Memory Match.','Turn over cards and find all eight pairs.')}<div class="ex-game-stats"><span>Moves <b>${moves}</b></span><span>Pairs <b>${matched.length/2} / 8</b></span><span>Best <b>${best||'—'}</b></span><button class="ex-btn" id="memory-new">New game</button></div><div class="ex-memory-grid">${deck.map((c,i)=>`<button class="ex-memory-card ${open.includes(i)||matched.includes(i)?'flipped':''} ${matched.includes(i)?'matched':''}" data-flip="${i}">${open.includes(i)||matched.includes(i)?c.value:'✧'}</button>`).join('')}</div>${matched.length===16?'<div class="ex-game-message">All pairs found. Great work! ✨</div>':''}</div>`);let b=body('memory');b.querySelector('#memory-new').onclick=restart;b.querySelectorAll('[data-flip]').forEach(x=>x.onclick=()=>flip(+x.dataset.flip))}
restart()}
X.register('merge',merge);X.register('memory',memory);
})();