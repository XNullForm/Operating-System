(function newCreativeApps(){
"use strict";
const X=window.GoldenOSExtra;if(!X)return;
const {getBody:body,store,load,notify,esc,frame,header}=X;
function pixel(){
const N=20,CELL=30;let data=load('pixelV3',Array(400).fill('#ffffff'));if(!Array.isArray(data)||data.length!==400)data=Array(400).fill('#ffffff');let color='#7566ed',tool='pen',painting=false;
const colors=['#1e2035','#ffffff','#ff756d','#feb85b','#f1e26e','#6fd8a3','#75bdf4','#735df1','#db82ed','#b88559','#ffb9d7','#3b6e8a'];
function draw(){
frame('pixel',`<div class="ex-pixel-shell"><aside>${header('LITTLE SQUARES, BIG IDEAS','Pixel Studio.','Your tiny canvas for big creativity.')}<div class="ex-eyebrow">COLORS</div><div class="ex-palette">${colors.map(c=>`<button data-color="${c}" style="--swatch:${c}" class="${color===c?'active':''}" aria-label="Color ${c}"></button>`).join('')}</div><div class="ex-pixel-tools"><label>Custom color <input id="pixel-custom" type="color" value="${color}"></label>${['pen','erase','fill'].map(t=>`<button class="ex-btn ${tool===t?'ex-primary':''}" data-tool="${t}">${t==='pen'?'✎ Draw':t==='erase'?'⌫ Erase':'▦ Fill'}</button>`).join('')}</div><button class="ex-btn" id="pixel-clear">Clear canvas</button><button class="ex-btn ex-primary" id="pixel-save">↓ Export PNG</button><p class="ex-muted">Your artwork saves automatically to this browser.</p></aside><main><canvas id="pixel-canvas" width="600" height="600"></canvas></main></div>`);
let b=body('pixel'),c=b.querySelector('#pixel-canvas'),ctx=c.getContext('2d');
function repaint(){data.forEach((color,i)=>{ctx.fillStyle=color;ctx.fillRect(i%N*CELL,Math.floor(i/N)*CELL,CELL,CELL)});ctx.strokeStyle='#40506718';ctx.lineWidth=.6;for(let k=0;k<=N;k++){ctx.beginPath();ctx.moveTo(k*CELL,0);ctx.lineTo(k*CELL,600);ctx.moveTo(0,k*CELL);ctx.lineTo(600,k*CELL);ctx.stroke()}}
function apply(e){let box=c.getBoundingClientRect(),x=Math.floor((e.clientX-box.left)/box.width*N),y=Math.floor((e.clientY-box.top)/box.height*N);if(x<0||x>=N||y<0||y>=N)return;let i=y*N+x,value=tool==='erase'?'#ffffff':color,prev=data[i];if(tool==='fill'&&prev!==value){let todo=[i];while(todo.length){let j=todo.pop();if(data[j]!==prev)continue;data[j]=value;const xx=j%N,yy=Math.floor(j/N);if(xx>0)todo.push(j-1);if(xx<19)todo.push(j+1);if(yy>0)todo.push(j-N);if(yy<19)todo.push(j+N)}}else if(tool!=='fill')data[i]=value;store('pixelV3',data);repaint()}
c.onpointerdown=e=>{painting=true;c.setPointerCapture(e.pointerId);apply(e)};
c.onpointermove=e=>{if(painting&&tool!=='fill')apply(e)};c.onpointerup=()=>painting=false;c.onpointercancel=()=>painting=false;
b.querySelectorAll('[data-color]').forEach(x=>x.onclick=()=>{color=x.dataset.color;draw()});
b.querySelector('#pixel-custom').oninput=e=>color=e.target.value;
b.querySelectorAll('[data-tool]').forEach(x=>x.onclick=()=>{tool=x.dataset.tool;draw()});
b.querySelector('#pixel-clear').onclick=()=>{if(confirm('Clear all artwork?')){data.fill('#ffffff');store('pixelV3',data);repaint()}};
b.querySelector('#pixel-save').onclick=()=>c.toBlob(blob=>{if(!blob)return;let a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='pixel-studio.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)},'image/png');
repaint()}
draw()}
function synth(){
const notes=['C5','B4','A4','G4','F4','E4','D4','C4'],freq=[523.25,493.88,440,392,349.23,329.63,293.66,261.63];
let p=load('synthV3',Array.from({length:8},()=>Array(16).fill(false)));if(!Array.isArray(p)||p.length!==8)p=Array.from({length:8},()=>Array(16).fill(false));
let bpm=Number(load('synthTempo',110)),wave='sine',ctx=null,playing=false,step=0,timer=null;
function sound(i){try{ctx??=new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();const osc=ctx.createOscillator(),vol=ctx.createGain(),now=ctx.currentTime;osc.type=wave;osc.frequency.value=freq[i];vol.gain.setValueAtTime(.0001,now);vol.gain.exponentialRampToValueAtTime(.12,now+.014);vol.gain.exponentialRampToValueAtTime(.0001,now+.25);osc.connect(vol).connect(ctx.destination);osc.start(now);osc.stop(now+.26)}catch{notify('Audio is not available on this device')}}
function stop(){playing=false;clearInterval(timer);timer=null;const b=body('synth');if(b){b.querySelector('#synth-play').textContent='▶ Play';b.querySelectorAll('.step-playing').forEach(x=>x.classList.remove('step-playing'))}}
function playStep(){if(!body('synth')){stop();return}for(let i=0;i<8;i++)if(p[i][step])sound(i);body('synth').querySelectorAll('[data-step]').forEach(x=>x.classList.toggle('step-playing',+x.dataset.step===step));step=(step+1)%16}
function start(){if(playing)return;playing=true;step=0;playStep();timer=setInterval(playStep,60000/bpm/4);body('synth').querySelector('#synth-play').textContent='■ Stop'}
function draw(){
frame('synth',`<div class="ex-inset ex-synth">${header('YOUR OWN SOUNDTRACK','Sound Studio.','Create an original tune, one note at a time.')}<div class="ex-synth-toolbar"><button class="ex-btn ex-primary" id="synth-play">▶ Play</button><button class="ex-btn" id="synth-clear">Clear</button><button class="ex-btn" id="synth-example">Make a pattern</button><label>Tempo <input id="synth-bpm" type="range" min="60" max="180" value="${bpm}"><span id="synth-tempo">${bpm}</span> BPM</label><select id="synth-wave"><option value="sine">Soft</option><option value="triangle">Warm</option><option value="square">Retro</option></select></div><div class="ex-sequencer"><div class="ex-seq-head"><span></span>${Array.from({length:16},(_,i)=>`<span>${i+1}</span>`).join('')}</div>${p.map((row,i)=>`<div class="ex-seq-row"><button data-note="${i}">${notes[i]}</button>${row.map((v,j)=>`<button data-cell="${i}-${j}" data-step="${j}" class="${v?'enabled':''}"></button>`).join('')}</div>`).join('')}</div><div class="ex-synth-bottom">Tap a note to preview it. Tap squares to arrange a repeating melody. The sounds are created right on your device.</div></div>`);
const b=body('synth');b.querySelector('#synth-play').onclick=()=>playing?stop():start();b.querySelector('#synth-clear').onclick=()=>{stop();p=Array.from({length:8},()=>Array(16).fill(false));store('synthV3',p);draw()};
b.querySelector('#synth-example').onclick=()=>{stop();p=Array.from({length:8},(_,i)=>Array.from({length:16},(_,j)=>i===(j*3)%8&&j%2===0||i===7&&j%4===0));store('synthV3',p);draw()};
b.querySelectorAll('[data-cell]').forEach(x=>x.onclick=()=>{const [i,j]=x.dataset.cell.split('-').map(Number);p[i][j]=!p[i][j];store('synthV3',p);x.classList.toggle('enabled',p[i][j]);if(p[i][j])sound(i)});
b.querySelectorAll('[data-note]').forEach(x=>x.onclick=()=>sound(+x.dataset.note));
b.querySelector('#synth-bpm').oninput=e=>{bpm=+e.target.value;b.querySelector('#synth-tempo').textContent=bpm;store('synthTempo',bpm);if(playing){stop();start()}};
b.querySelector('#synth-wave').onchange=e=>wave=e.target.value;
}draw()}
function typing(){
const prompts=[
'Creative ideas grow when you give them room to breathe. A little curiosity can turn an ordinary afternoon into an exciting discovery.',
'Across the bay, the city lights shimmer while the bridge stretches gracefully over the water. Every window holds another story.',
'Learning to build something new is like exploring a map. Each small experiment helps you find another path forward.',
'The best adventures sometimes begin with a single question. Follow the details and enjoy the process.',
'A great piece of music can make a quiet moment unforgettable. Experiment with your favorite sounds and create something original.'
];
let quote=prompts[Math.floor(Math.random()*prompts.length)],started=0,best=load('typingBest',0),finished=false;
function draw(){frame('typing',`<div class="ex-inset ex-typing">${header('FINGERS AT THE READY','Type Sprint.','How accurate and fast can you type?')}<div class="ex-typing-stats"><div><small>TIME</small><strong id="type-time">0s</strong></div><div><small>SPEED</small><strong id="type-wpm">0 WPM</strong></div><div><small>ACCURACY</small><strong id="type-acc">100%</strong></div><div><small>BEST</small><strong>${best} WPM</strong></div></div><div class="ex-typing-prompt" id="type-prompt">${esc(quote)}</div><textarea id="type-input" rows="4" spellcheck="false" autocomplete="off" placeholder="Start typing here…"></textarea><div class="ex-typing-actions"><span id="type-result">Focus on accuracy first.</span><button class="ex-btn" id="type-reset">New challenge ↻</button></div></div>`);
let b=body('typing');b.querySelector('#type-reset').onclick=()=>{quote=prompts[Math.floor(Math.random()*prompts.length)];started=0;finished=false;draw()};
b.querySelector('#type-input').oninput=e=>{if(finished)return;if(!started)started=Date.now();let s=e.target.value,sec=Math.max(1,(Date.now()-started)/1000),correct=[...s].reduce((n,c,i)=>n+(quote[i]===c?1:0),0),wpm=Math.round(correct/5/(sec/60)),accuracy=Math.round(correct/Math.max(1,s.length)*100);b.querySelector('#type-time').textContent=Math.floor(sec)+'s';b.querySelector('#type-wpm').textContent=wpm+' WPM';b.querySelector('#type-acc').textContent=accuracy+'%';b.querySelector('#type-prompt').innerHTML=[...quote].map((c,i)=>i<s.length?`<span class="${s[i]===c?'correct':'incorrect'}">${esc(c)}</span>`:esc(c)).join('');if(s===quote){finished=true;best=Math.max(best,wpm);store('typingBest',best);e.target.disabled=true;b.querySelector('#type-result').textContent='✨ Complete! '+wpm+' WPM with '+accuracy+'% accuracy.'}}}
draw()}
X.register('pixel',pixel);X.register('synth',synth);X.register('typing',typing);
})();