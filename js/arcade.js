(function newArcadeGames(){
"use strict";
const X=window.GoldenOSExtra;if(!X)return;
const {getBody:body,store,load,notify,frame,header}=X;
let tick=null,snakeControl=null;
window.addEventListener('keydown',e=>{if(document.querySelector('.window.active')?.dataset.app==='snake'&&snakeControl&&(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))){e.preventDefault();snakeControl(e.key)}});
function snake(){
clearInterval(tick);const n=21;let segments=[{x:7,y:10},{x:6,y:10},{x:5,y:10}],direction={x:1,y:0},next={x:1,y:0},food={x:13,y:10},score=0,best=load('snakeBest',0),running=false,paused=false,dead=false;
const randomFood=()=>{let f;do{f={x:Math.floor(Math.random()*n),y:Math.floor(Math.random()*n)}}while(segments.some(x=>x.x===f.x&&x.y===f.y));food=f};
function drawBoard(){
let b=body('snake');if(!b)return;const c=b.querySelector('#snake-canvas'),ctx=c?.getContext('2d');if(!ctx)return;let cell=420/n;ctx.fillStyle='#111829';ctx.fillRect(0,0,420,420);ctx.strokeStyle='#ffffff0a';ctx.lineWidth=1;for(let i=1;i<n;i++){ctx.beginPath();ctx.moveTo(cell*i,0);ctx.lineTo(cell*i,420);ctx.moveTo(0,cell*i);ctx.lineTo(420,cell*i);ctx.stroke()}
ctx.fillStyle='#ff9ab1';ctx.beginPath();ctx.arc((food.x+.5)*cell,(food.y+.5)*cell,7,0,Math.PI*2);ctx.fill();
segments.forEach((s,i)=>{ctx.fillStyle=i===0?'#b4f7d6':'#67d9b0';ctx.beginPath();ctx.roundRect(s.x*cell+2,s.y*cell+2,cell-4,cell-4,5);ctx.fill()});
b.querySelector('#snake-score').textContent=score;b.querySelector('#snake-best').textContent=best;
b.querySelector('#snake-main').textContent=dead?'Play again':!running?'Play game':paused?'Resume':'Pause';
b.querySelector('#snake-hint').textContent=dead?'Game over — try again':!running?'Press Play to start':paused?'Paused':'Follow the glowing orbs';
}
function step(){if(!running||paused||!body('snake'))return;direction=next;let head={x:segments[0].x+direction.x,y:segments[0].y+direction.y};const eat=head.x===food.x&&head.y===food.y,tail=eat?segments:segments.slice(0,-1);if(head.x<0||head.x>=n||head.y<0||head.y>=n||tail.some(t=>t.x===head.x&&t.y===head.y)){dead=true;running=false;clearInterval(tick);drawBoard();return}
segments.unshift(head);if(eat){score++;if(score>best){best=score;store('snakeBest',best)}randomFood()}else segments.pop();drawBoard()}
function start(){segments=[{x:7,y:10},{x:6,y:10},{x:5,y:10}];direction={x:1,y:0};next={x:1,y:0};score=0;dead=false;paused=false;running=true;randomFood();clearInterval(tick);tick=setInterval(step,135);drawBoard()}
function toggle(){if(!running)start();else{paused=!paused;drawBoard()}}
function steer(k){if(k===' '){toggle();return}let d={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[k];if(!d)return;if(d[0]===-direction.x&&d[1]===-direction.y)return;next={x:d[0],y:d[1]}}
frame('snake',`<div class="ex-snake-screen"><div class="ex-snake-side"><div class="ex-eyebrow">AN ARCADE CLASSIC</div><h1>Neon<br>Snake<span>.</span></h1><p>Collect the pink orbs. Avoid walls and your own tail.</p><div class="ex-score-boxes"><div><span>SCORE</span><strong id="snake-score">0</strong></div><div><span>BEST</span><strong id="snake-best">${best}</strong></div></div><button class="ex-btn ex-primary" id="snake-main">Play game</button><p id="snake-hint">Press Play to start</p><div class="ex-snake-controls">${[['ArrowUp','↑'],['ArrowLeft','←'],['ArrowDown','↓'],['ArrowRight','→']].map(([k,v])=>`<button data-direction="${k}">${v}</button>`).join('')}</div></div><canvas width="420" height="420" id="snake-canvas"></canvas></div>`);
let b=body('snake');b.querySelector('#snake-main').onclick=toggle;b.querySelectorAll('[data-direction]').forEach(el=>el.onclick=()=>steer(el.dataset.direction));snakeControl=steer;drawBoard();
}
function mines(){
const N=9,BOMBS=12;let cells=[],initialized=false,finished=false,won=false,flags=0,seen=0,best=load('minesBest',0),started=0,mode=false;
const around=i=>{const x=i%N,y=Math.floor(i/N),a=[];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(dx===0&&dy===0)continue;const xx=x+dx,yy=y+dy;if(xx>=0&&xx<N&&yy>=0&&yy<N)a.push(yy*N+xx)}return a};
function reset(){cells=Array.from({length:N*N},(_,i)=>({i,bomb:false,flag:false,visible:false,num:0}));initialized=false;finished=false;won=false;flags=0;seen=0;draw()}
function seed(i){let choices=cells.map(x=>x.i).filter(k=>k!==i&&!around(i).includes(k)).sort(()=>Math.random()-.5);choices.slice(0,BOMBS).forEach(k=>cells[k].bomb=true);cells.forEach(c=>c.num=around(c.i).filter(k=>cells[k].bomb).length);initialized=true;started=Date.now()}
function expand(i){let queue=[i];while(queue.length){let x=queue.pop(),c=cells[x];if(c.visible||c.flag||c.bomb)continue;c.visible=true;seen++;if(c.num===0)queue.push(...around(x).filter(k=>!cells[k].visible))}}
function reveal(i){if(finished||cells[i].flag||cells[i].visible)return;if(!initialized)seed(i);if(cells[i].bomb){finished=true;cells.forEach(c=>{if(c.bomb)c.visible=true})}else{expand(i);if(seen===N*N-BOMBS){finished=true;won=true;let s=Math.ceil((Date.now()-started)/1000);if(!best||s<best){best=s;store('minesBest',best)}notify('You cleared the field!')}}draw()}
function flag(i){if(finished||cells[i].visible)return;cells[i].flag=!cells[i].flag;flags+=cells[i].flag?1:-1;draw()}
function draw(){
frame('mines',`<div class="ex-game-screen ex-mines">${header('A CLASSIC LOGIC PUZZLE','Mines.','Uncover the safe squares. Flag the hidden mines.')}<div class="ex-game-stats"><span>Flags left <b>${BOMBS-flags}</b></span><span>Best <b>${best?best+'s':'—'}</b></span><button class="ex-btn" id="mine-reset">New game</button></div><div class="ex-mines-board">${cells.map(c=>`<button data-square="${c.i}" class="ex-mine ${c.visible?'seen':''} ${c.visible&&c.bomb?'bomb':''}" aria-label="Mines square ${c.i+1}">${c.flag?'⚑':c.visible?(c.bomb?'✸':c.num?`<span class="num${c.num}">${c.num}</span>`:''):''}</button>`).join('')}</div><p class="ex-game-message">${won?'All safe squares found! ✨':finished?'A mine was revealed. Try again!':'Tap to reveal · Right-click to flag · First move is safe'}</p><div class="ex-mines-foot">Touch users can toggle flag mode below.</div><button class="ex-btn" id="mine-mode">Mode: ${mode?'Place flags':'Reveal'}</button></div>`);
let b=body('mines');b.querySelector('#mine-reset').onclick=reset;b.querySelector('#mine-mode').onclick=e=>{mode=!mode;e.target.textContent=mode?'Mode: Place flags':'Mode: Reveal'};
b.querySelectorAll('[data-square]').forEach(x=>{x.onclick=()=>mode?flag(+x.dataset.square):reveal(+x.dataset.square);x.oncontextmenu=e=>{e.preventDefault();flag(+x.dataset.square)}})}
reset()}
X.register('snake',snake);X.register('mines',mines);
})();