(function buildGoldenCore(){
"use strict";
const O=window.GoldenOS;if(!O)return;
const {definitions,appOrder,icons,openApp,closeWindow,renderDock,body,store,load,notify,ic,esc,openExternal,navBrowser}=O;
Object.assign(icons,{
  store:'<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M7 7V5a5 5 0 0 1 10 0v2M9 13h6m-3-3v6"/>',
  gamepad:'<path d="M6 8h12a4 4 0 0 1 3.8 3l1 5a3 3 0 0 1-5 2.7l-2-1.7H8.2l-2 1.7a3 3 0 0 1-5-2.7l1-5A4 4 0 0 1 6 8Z"/><path d="M8 11v6M5 14h6m6-1h.01m2 2h.01"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  book:'<path d="M3 5a3 3 0 0 1 3-3h15v18H6a3 3 0 0 0-3 3zM3 5v15a3 3 0 0 1 3-3h15"/>',
  map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15m6-12v15"/>',
  code:'<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/>',
  focus:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  sparkles:'<path d="m12 2 2 7 7 3-7 2-2 8-2-8-7-2 7-3zM20 2v4m-2-2h4"/>',
  lightning:'<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
  trophy:'<path d="M7 3h10v6a5 5 0 0 1-10 0zM7 5H4v4a4 4 0 0 0 4 4m9-8h3v4a4 4 0 0 1-4 4M12 14v5m-5 2h10"/>'
});
const catalog=[
 ['tasks','Tasks','Productivity','Plan today, finish strong.','✓','tangerine','check'],
 ['focus','Focus','Productivity','A distraction-free timer for deep work.','◷','violet','focus'],
 ['journal','Journal','Productivity','A private space for your thoughts.','✎','rose','book'],
 ['codepad','Code Lab','Creativity','Write and preview real HTML, CSS and JS.','</>','navy','code'],
 ['atlas','Atlas','Discovery','Explore cities on an interactive map.','◎','teal','map'],
 ['discover','Discover','Discovery','Fascinating places, science and ideas.','✦','blue','sparkles'],
 ['pixel','Pixel Studio','Creativity','Make pixel art and export your creations.','▦','plum','paint'],
 ['synth','Sound Studio','Creativity','Compose with a 16-step synthesizer.','♫','pink','music'],
 ['snake','Neon Snake','Games','Chase a new high score.','〰','green','gamepad'],
 ['merge','2048','Games','A surprisingly addictive number puzzle.','²','orange','grid'],
 ['memory','Memory Match','Games','Flip cards. Find the pairs.','◇','lavender','heart'],
 ['mines','Mines','Games','A classic logic puzzle.','⚑','slate','grid'],
 ['habits','Habits','Productivity','Build little routines, one day at a time.','◎','green','check'],
 ['flashcards','Flashcards','Education','Make decks and test what you remember.','▤','yellow','book'],
 ['recipes','Kitchen','Lifestyle','Simple recipes and ideas worth making.','♨','coral','heart'],
 ['typing','Type Sprint','Games','Improve your typing with a speed challenge.','⌨','navy','terminal'],
 ['sketch','Idea Board','Creativity','Collect thoughts and organize your ideas.','✧','sky','note']
];
const meta=Object.fromEntries(catalog.map(([id,name,category,description,glyph,tone,icon])=>[id,{id,name,category,description,glyph,tone,icon}]));
const permanent=['launchpad','appstore','arcade'];
const initial=['tasks','focus','journal','codepad','atlas','discover','pixel','synth','snake','merge','memory','mines','habits','flashcards','recipes','typing','sketch'];
let installed=new Set(load('installedV3',initial));
let category='All';
let search='';
function reg(id){let a=meta[id];if(!a)return;definitions[id]={name:a.name,icon:a.icon,size:(['snake','merge','memory','mines','typing'].includes(id)?[780,650]:[930,660])}}
definitions.launchpad={name:'Launchpad',icon:'grid',size:[930,650]};
definitions.appstore={name:'App Store',icon:'store',size:[1020,700]};
definitions.arcade={name:'Arcade',icon:'gamepad',size:[930,665]};
for(let id of installed)reg(id);
for(let id of ['launchpad','appstore','arcade'])if(!appOrder.includes(id))appOrder.splice(id==='launchpad'?1:id==='appstore'?3:4,0,id);
for(let id of ['tasks','focus'])if(installed.has(id)&&!appOrder.includes(id))appOrder.splice(id==='tasks'?5:6,0,id);
renderDock();
const saveInstalled=()=>store('installedV3',[...installed]);
function install(id){if(!meta[id])return;installed.add(id);reg(id);saveInstalled();renderDock();notify(meta[id].name+' installed');if(body('appstore'))storeView();if(body('launchpad'))launchpadView()}
function uninstall(id){if(!meta[id])return;installed.delete(id);delete definitions[id];closeWindow(id);const pos=appOrder.indexOf(id);if(pos>=0)appOrder.splice(pos,1);saveInstalled();renderDock();notify(meta[id].name+' removed');if(body('appstore'))storeView();if(body('launchpad'))launchpadView()}
function launch(id){if(!installed.has(id)){install(id)}openApp(id)}
function badge(a,small=false){return `<span class="ex-app-icon tone-${a.tone}${small?' small':''}" aria-hidden="true">${esc(a.glyph)}</span>`}
const frame=(id,content)=>{const b=body(id);if(b)b.innerHTML=`<div class="ex-shell">${content}</div>`;return b};
const header=(eyebrow,title,subtitle)=>`<div class="ex-heading"><div class="ex-eyebrow">${eyebrow}</div><h1>${title}</h1><p>${subtitle}</p></div>`;
const empty=(title,sub)=>`<div class="ex-empty"><div>✧</div><strong>${title}</strong><p>${sub}</p></div>`;
const button=(label,attrs='',cls='ex-btn')=>`<button class="${cls}" ${attrs}>${label}</button>`;
const section=(title,right='')=>`<div class="ex-section-heading"><h2>${title}</h2>${right}</div>`;
function storeView(){
const b=body('appstore');if(!b)return;
const shown=catalog.map(x=>meta[x[0]]).filter(a=>(category==='All'||category===a.category)&&(`${a.name} ${a.description} ${a.category}`.toLowerCase().includes(search.toLowerCase())));
frame('appstore',`<div class="ex-store-head"><div><div class="ex-eyebrow">THE GOLDEN GATE APP STORE</div><h1>There's more to explore.</h1><p>Thoughtful tools, tiny adventures, and endless possibilities.</p></div><div class="ex-store-search">${ic('search')}<input id="store-search" value="${esc(search)}" placeholder="Search apps..." aria-label="Search apps"></div></div>
<div class="ex-feature-row"><div class="ex-feature-card feat-one"><div class="ex-eyebrow">EDITOR'S PICK · CREATE SOMETHING</div><h2>Make a little<br>magic.</h2><p>Turn ideas into art, music and code.</p><button class="ex-pill-light" data-open="pixel">Open Pixel Studio ${ic('chevronRight')}</button><span class="feature-figure">✷</span></div>
<div class="ex-feature-card feat-two"><div class="ex-eyebrow">PLAY MORE · GAME COLLECTION</div><h2>One more round.</h2><p>Four timeless games, reimagined.</p><button class="ex-pill-light" data-open="arcade">Explore Arcade ${ic('chevronRight')}</button><span class="feature-figure">◆</span></div></div>
<div class="ex-categories">${['All','Productivity','Games','Creativity','Discovery','Education','Lifestyle'].map(c=>`<button data-cat="${c}" class="${category===c?'active':''}">${c}</button>`).join('')}</div>
${section(category==='All'?'Made for your desktop':category+' apps',`<span class="ex-muted">${shown.length} apps</span>`)}
<div class="ex-app-grid">${shown.map(a=>`<article class="ex-store-item">${badge(a)}<div class="ex-store-text"><strong>${esc(a.name)}</strong><span>${esc(a.category)}</span><p>${esc(a.description)}</p></div><button class="ex-get ${installed.has(a.id)?'is-installed':''}" data-install="${a.id}">${installed.has(a.id)?'OPEN':'GET'}</button><button class="ex-more" data-info="${a.id}" title="App details">⋯</button></article>`).join('')}</div>${shown.length?'':empty('No apps found','Try a different search or category.')}
<div class="ex-store-footer">All apps run in your browser. Installs save locally on this device; nothing is downloaded from a third-party app store.</div>`);
b.querySelector('#store-search').oninput=e=>{search=e.target.value;const start=e.target.selectionStart;storeView();const i=body('appstore').querySelector('#store-search');i.focus();i.setSelectionRange(start,start)};
b.querySelectorAll('[data-cat]').forEach(el=>el.onclick=()=>{category=el.dataset.cat;storeView()});
b.querySelectorAll('[data-open]').forEach(el=>el.onclick=()=>el.dataset.open==='arcade'?openApp('arcade'):launch(el.dataset.open));
b.querySelectorAll('[data-install]').forEach(el=>el.onclick=()=>{let id=el.dataset.install;if(installed.has(id))openApp(id);else install(id)});
b.querySelectorAll('[data-info]').forEach(el=>el.onclick=()=>{let a=meta[el.dataset.info];detail(a)});
}
function detail(a){const b=body('appstore');if(!b)return;
frame('appstore',`<div class="ex-detail"><button class="ex-link" id="store-back">‹ Back to App Store</button><div class="ex-detail-head">${badge(a)}<div><div class="ex-eyebrow">${a.category}</div><h1>${a.name}</h1><p>${a.description}</p><button class="ex-btn ex-primary" id="detail-action">${installed.has(a.id)?'OPEN':'GET · FREE'}</button>${installed.has(a.id)?'<button class="ex-btn ex-danger" id="detail-remove">Remove app</button>':''}</div></div><div class="ex-details-art tone-${a.tone}"><span>${a.glyph}</span><div>${a.name}</div></div><h2>Made for Golden Gate OS.</h2><p class="ex-muted">A complete interactive mini-app with its own features, accessible from Launchpad and Spotlight. Your content is stored locally in your browser.</p></div>`);
b.querySelector('#store-back').onclick=storeView;
b.querySelector('#detail-action').onclick=()=>launch(a.id);
b.querySelector('#detail-remove')?.addEventListener('click',()=>{if(confirm('Remove '+a.name+' from your desktop? Saved app data will remain.'))uninstall(a.id)});
}
function launchpadView(){
const cards=[...permanent.map(id=>({id,name:definitions[id].name,glyph:id==='launchpad'?'▦':id==='appstore'?'◈':'✦',tone:'navy'})),...catalog.map(x=>meta[x[0]]).filter(a=>installed.has(a.id))];
frame('launchpad',`<div class="ex-launchpad"><div class="ex-eyebrow">YOUR PERSONAL DESKTOP</div><h1>Launchpad</h1><p>Everything you love, one click away.</p><div class="ex-launch-grid">${cards.map(a=>`<button class="ex-launch-app" data-open="${a.id}">${badge(a)}<span>${esc(a.name)}</span></button>`).join('')}</div><button class="ex-quiet" id="launch-browse">Discover more apps in the App Store ↗</button></div>`);
let b=body('launchpad');b.querySelectorAll('[data-open]').forEach(el=>el.onclick=()=>openApp(el.dataset.open));b.querySelector('#launch-browse').onclick=()=>openApp('appstore')}
function arcadeView(){
const games=['snake','merge','memory','mines','typing'].map(id=>meta[id]);
frame('arcade',`<div class="ex-arcade-hero"><div class="ex-eyebrow">GOLDEN GATE ARCADE</div><h1>Press play.</h1><p>Pick a game, get lost in the moment, and see how far you can go.</p><div class="ex-arcade-orbs"><span>✳</span><span>◈</span><span>✦</span></div></div><div class="ex-inset">${section('Your next adventure','No ads. No accounts. Just fun.')}<div class="ex-game-cards">${games.map(a=>`<button class="ex-game-card tone-${a.tone}" data-game="${a.id}"><span class="ex-game-glyph">${esc(a.glyph)}</span><strong>${a.name}</strong><span>${a.description}</span><div class="ex-game-foot">${installed.has(a.id)?'Play now':'Install & play'} ↗</div></button>`).join('')}</div><div class="ex-arcade-note"><span>🏆</span><div><strong>Make it your own</strong><p>High scores and game progress are stored privately in this browser.</p></div></div></div>`);
body('arcade').querySelectorAll('[data-game]').forEach(el=>el.onclick=()=>launch(el.dataset.game))}
function tasksView(){
let items=load('tasksV3',[{id:1,text:'Explore the new Golden Gate desktop',done:true},{id:2,text:'Try a game in Arcade',done:false},{id:3,text:'Create something in Pixel Studio',done:false}]);
const save=()=>store('tasksV3',items);
function draw(){
const done=items.filter(t=>t.done).length;
frame('tasks',`<div class="ex-inset">${header('MAKE IT HAPPEN','Today, in focus.','The smallest steps create the biggest progress.')}<div class="ex-task-banner"><div><span class="ex-eyebrow">YOUR PROGRESS</span><h2>${done} of ${items.length} complete</h2><p>${items.length?Math.round(done/items.length*100):0}% of your list is done.</p></div><div class="ex-progress-ring" style="--p:${items.length?done/items.length*100:0}%">${items.length?Math.round(done/items.length*100):0}%</div></div><form class="ex-inline-form" id="task-form"><input maxlength="140" id="task-text" required placeholder="Add a task to your day…"><button class="ex-btn ex-primary">+ Add task</button></form>${section('Your tasks',`<button class="ex-link" id="clear-done">Clear completed</button>`)}<div class="ex-tasks">${items.map(t=>`<div class="ex-task ${t.done?'done':''}"><label><input type="checkbox" data-check="${t.id}" ${t.done?'checked':''}><span>${esc(t.text)}</span></label><button data-del="${t.id}" aria-label="Delete task">×</button></div>`).join('')}</div>${!items.length?empty('All clear','Add a task to get started.'):''}</div>`);
let b=body('tasks');
b.querySelector('#task-form').onsubmit=e=>{e.preventDefault();const s=b.querySelector('#task-text').value.trim();if(!s)return;items.unshift({id:Date.now(),text:s,done:false});save();draw()};
b.querySelectorAll('[data-check]').forEach(el=>el.onchange=()=>{let i=items.find(t=>String(t.id)===el.dataset.check);if(i)i.done=el.checked;save();draw()});
b.querySelectorAll('[data-del]').forEach(el=>el.onclick=()=>{items=items.filter(t=>String(t.id)!==el.dataset.del);save();draw()});
b.querySelector('#clear-done').onclick=()=>{items=items.filter(t=>!t.done);save();draw()};
}draw()}
let focus={mode:'Focus',until:0,remaining:25*60,running:false,rounds:load('focusRounds',0)};
function focusView(){
let durations={Focus:25*60,Short:5*60,Long:15*60};
function draw(){
let b=frame('focus',`<div class="ex-focus-bg"><div class="ex-focus-content"><div class="ex-eyebrow">MAKE SPACE FOR WHAT MATTERS</div><h1>A moment to focus.</h1><div class="ex-mode-bar">${Object.keys(durations).map(m=>`<button data-mode="${m}" class="${focus.mode===m?'active':''}">${m==='Focus'?'Focus time':m==='Short'?'Short break':'Long break'}</button>`).join('')}</div><div class="ex-focus-clock" id="focus-clock">25:00</div><p class="ex-muted" id="focus-caption">${focus.running?'You’ve got this. One step at a time.':'Ready when you are.'}</p><div class="ex-focus-actions"><button class="ex-btn ex-primary" id="focus-toggle">${focus.running?'Pause':'Start focusing'}</button><button class="ex-btn" id="focus-reset">Reset</button></div><div class="ex-focus-stats">✦ ${focus.rounds} focus sessions completed</div></div></div>`);
b.querySelector('#focus-toggle').onclick=()=>{if(focus.running){focus.remaining=Math.max(0,Math.ceil((focus.until-Date.now())/1000));focus.running=false}else{focus.until=Date.now()+focus.remaining*1000;focus.running=true}draw()};
b.querySelector('#focus-reset').onclick=()=>{focus.running=false;focus.remaining=durations[focus.mode];draw()};
b.querySelectorAll('[data-mode]').forEach(x=>x.onclick=()=>{focus.mode=x.dataset.mode;focus.running=false;focus.remaining=durations[focus.mode];draw()});tick()}
function tick(){if(focus.running)focus.remaining=Math.max(0,Math.ceil((focus.until-Date.now())/1000));let el=body('focus')?.querySelector('#focus-clock');if(el)el.textContent=`${String(Math.floor(focus.remaining/60)).padStart(2,'0')}:${String(focus.remaining%60).padStart(2,'0')}`;if(focus.running&&focus.remaining===0){focus.running=false;if(focus.mode==='Focus'){focus.rounds++;store('focusRounds',focus.rounds)}notify('Your '+focus.mode.toLowerCase()+' session is complete');draw()}}
draw();clearInterval(window.ggFocusTicker);window.ggFocusTicker=setInterval(tick,250)}
function journalView(){
let entries=load('journalV3',{});
let date=new Date().toLocaleDateString('en-CA');
function draw(){
let keys=Object.keys(entries).sort().reverse();
frame('journal',`<div class="ex-journal"><aside><div class="ex-eyebrow">THE LITTLE THINGS</div><h2>Journal</h2><button id="journal-new" class="ex-btn ex-primary">+ Today's entry</button><div class="ex-journal-days">${keys.map(k=>`<button class="${k===date?'selected':''}" data-date="${k}"><strong>${esc(k)}</strong><span>${esc((entries[k]||'').slice(0,45)||'Empty entry')}</span></button>`).join('')}</div></aside><main><div class="ex-eyebrow">PRIVATE · SAVED TO YOUR BROWSER</div><h1>${date===new Date().toLocaleDateString('en-CA')?'Today':esc(date)}</h1><p>${new Date(date+'T12:00:00').toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</p><textarea id="journal-text" spellcheck="true" placeholder="What’s on your mind today? What went well? What would you like to remember?">${esc(entries[date]||'')}</textarea><div class="ex-journal-status" id="journal-status">Changes save automatically</div></main></div>`);
let b=body('journal');b.querySelector('#journal-text').oninput=e=>{entries[date]=e.target.value;store('journalV3',entries);b.querySelector('#journal-status').textContent='✓ Saved to this browser'};
b.querySelector('#journal-new').onclick=()=>{date=new Date().toLocaleDateString('en-CA');entries[date]??='';draw()};
b.querySelectorAll('[data-date]').forEach(e=>e.onclick=()=>{date=e.dataset.date;draw()})}
draw()}
function codeView(){
let files=load('codeV3',{html:'<main class="card"><h1>Hello, Golden Gate!</h1><p>Make something wonderful today.</p><button onclick="this.textContent=\'You did it!\'">Click me ✨</button></main>',css:'body{font-family:system-ui;background:linear-gradient(135deg,#fae1db,#ccd4ff);min-height:100vh;display:grid;place-items:center;margin:0}.card{background:white;padding:36px;border-radius:24px;box-shadow:0 20px 55px #40406022;text-align:center}button{background:#7659dc;color:white;border:0;border-radius:9px;padding:12px 18px;cursor:pointer}',js:'console.log("Welcome to Code Lab!");'});
let tab='html';const save=()=>store('codeV3',files);
function output(){
let iframe=body('codepad')?.querySelector('#code-output');if(!iframe)return;
const src='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+files.css.replaceAll('</style','<\\/style')+'</style></head><body>'+files.html+'<script>'+files.js.replaceAll('</script','<\\/script')+'<\/script></body></html>';
iframe.srcdoc=src;
}
function draw(){
frame('codepad',`<div class="ex-code"><div class="ex-code-head"><strong>Code Lab</strong><span>Build something from scratch</span><button class="ex-btn" id="code-download">↓ Export HTML</button><button class="ex-btn ex-primary" id="code-run">▶ Run</button></div><div class="ex-code-split"><section><div class="ex-code-tabs">${['html','css','js'].map(k=>`<button data-code-tab="${k}" class="${tab===k?'selected':''}">${k.toUpperCase()}</button>`).join('')}</div><textarea spellcheck="false" aria-label="${tab} source editor" id="code-input">${esc(files[tab])}</textarea></section><section><div class="ex-code-preview-title">LIVE PREVIEW <span>Sandboxed for safety</span></div><iframe id="code-output" title="HTML output" sandbox="allow-scripts"></iframe></section></div></div>`);
let b=body('codepad');
b.querySelectorAll('[data-code-tab]').forEach(el=>el.onclick=()=>{files[tab]=b.querySelector('#code-input').value;tab=el.dataset.codeTab;save();draw()});
b.querySelector('#code-input').oninput=e=>{files[tab]=e.target.value;save()};
b.querySelector('#code-run').onclick=()=>{files[tab]=b.querySelector('#code-input').value;save();output()};
b.querySelector('#code-download').onclick=()=>{const src='<!doctype html><html><head><meta charset="utf-8"><style>'+files.css+'</style></head><body>'+files.html+'<script>'+files.js+'<\/script></body></html>';O.downloadText('my-golden-gate-project.html',src,'text/html')};
output()}
draw()}
const places=[
 ['San Francisco','USA',37.8199,-122.4783,'Golden Gate Bridge, dramatic coastline and colorful neighborhoods.'],
 ['New York','USA',40.7128,-74.0060,'A city of skyscrapers, neighborhoods and iconic landmarks.'],
 ['Tokyo','Japan',35.6762,139.6503,'An extraordinary mix of old traditions and futuristic streets.'],
 ['Paris','France',48.8566,2.3522,'Boulevards, art museums, gardens and architecture.'],
 ['London','UK',51.5072,-0.1276,'History, culture, parks and the River Thames.'],
 ['Sydney','Australia',-33.8688,151.2093,'A world-famous harbor and spectacular ocean coastline.'],
 ['Reykjavík','Iceland',64.1466,-21.9426,'Nordic design, geothermal warmth and dramatic landscapes.'],
 ['Rio de Janeiro','Brazil',-22.9068,-43.1729,'Mountains, beaches and a vibrant cultural heritage.']
];
function atlasView(){
let selected=0;
function draw(){
const [city,country,lat,lon,desc]=places[selected];let delta=0.065;
let bbox=`${lon-delta}%2C${lat-delta/2}%2C${lon+delta}%2C${lat+delta/2}`;
frame('atlas',`<div class="ex-atlas"><aside>${header('DISCOVER THE WORLD','Atlas.','A window into remarkable places.')}<div class="ex-atlas-list">${places.map(([n,c],i)=>`<button data-place="${i}" class="${selected===i?'active':''}"><span>${n}</span><small>${c}</small></button>`).join('')}</div></aside><main><div class="ex-map-toolbar"><div><span class="ex-eyebrow">NOW EXPLORING</span><h2>${city}, ${country}</h2></div><button class="ex-btn" id="atlas-out">Open full map ↗</button></div><div class="ex-map-frame"><iframe title="Map of ${esc(city)}" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}" referrerpolicy="strict-origin-when-cross-origin"></iframe></div><p class="ex-map-desc">${desc} <span>Map data © OpenStreetMap contributors. Requires internet.</span></p></main></div>`);
let b=body('atlas');b.querySelectorAll('[data-place]').forEach(x=>x.onclick=()=>{selected=+x.dataset.place;draw()});b.querySelector('#atlas-out').onclick=()=>openExternal(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`)}
draw()}
const discoveries=[
 ['🌉','The Golden Gate Bridge','An engineering icon opened in 1937. Its signature orange-red color helps it stand out against San Francisco fog.','Golden Gate Bridge'],
 ['🪐','The rings of Saturn','Saturn’s rings are made mostly of countless pieces of ice, ranging from tiny grains to large chunks.','Rings of Saturn'],
 ['🌌','The Milky Way','Our galaxy contains hundreds of billions of stars, with our solar system tucked into one of its spiral arms.','Milky Way'],
 ['🐙','Octopus intelligence','Octopuses can solve puzzles, explore objects and demonstrate remarkable problem-solving abilities.','Octopus'],
 ['🧬','The code of life','DNA stores the instructions that help living organisms grow, function and reproduce.','DNA'],
 ['🌊','The deep ocean','The oceans cover most of Earth, but many deep-sea environments are still difficult to explore.','Deep sea'],
 ['🎨','Color and light','What we perceive as color depends on light wavelengths and how our eyes and brains interpret them.','Color vision'],
 ['🚀','The first Moon landing','Apollo 11 brought humans to the lunar surface in July 1969, changing our view of space exploration.','Apollo 11'],
 ['🌋','Iceland’s volcanic landscape','Iceland sits over a spreading boundary between tectonic plates, giving it remarkable geological activity.','Geology of Iceland'],
 ['🎼','Why music moves us','Rhythm, harmony and memory interact in complex ways that can shape our emotional response to music.','Music psychology'],
 ['🦋','The monarch butterfly','Monarchs are known for extraordinary migrations spanning thousands of kilometers across North America.','Monarch butterfly'],
 ['🌳','Redwood forests','Coast redwoods are among the tallest living trees and thrive in the misty climate of northern California.','Sequoia sempervirens']
];
function discoverView(){
frame('discover',`<div class="ex-inset">${header('CURIOUS MINDS WELCOME','Stay curious.','A gallery of fascinating things to discover, from the sea to the stars.')}<div class="ex-discover-hero"><div class="ex-eyebrow">FEATURED STORY · SAN FRANCISCO</div><h2>A bridge between<br>two worlds.</h2><p>Discover the engineering, history, and beauty behind a global icon.</p><button class="ex-pill-light" id="discover-feature">Explore the story ↗</button></div>${section('Twelve things worth knowing','Tap a card to learn more')}<div class="ex-discover-grid">${discoveries.map(([emoji,title,desc],i)=>`<button class="ex-discover-card" data-story="${i}"><div class="ex-discover-emoji">${emoji}</div><h3>${esc(title)}</h3><p>${esc(desc)}</p><span>Read more ↗</span></button>`).join('')}</div><p class="ex-muted">External articles open through Wikipedia using Horizon Browser.</p></div>`);
let b=body('discover');b.querySelector('#discover-feature').onclick=()=>{openApp('browser');navBrowser('wiki:Golden Gate Bridge')};b.querySelectorAll('[data-story]').forEach(el=>el.onclick=()=>{openApp('browser');navBrowser('wiki:'+discoveries[+el.dataset.story][3])})}
function habitsView(){
let h=load('habitsV3',[{id:1,name:'Read something interesting',days:[]},{id:2,name:'Practice a creative skill',days:[]}]);
let today=new Date().toLocaleDateString('en-CA');
let dateKeys=Array.from({length:7},(_,i)=>{let d=new Date();d.setDate(d.getDate()-6+i);return d.toLocaleDateString('en-CA')});
function draw(){
frame('habits',`<div class="ex-inset">${header('SMALL STEPS, BIG CHANGES','Build a rhythm.','Make room for a little more of what matters to you.')}<form class="ex-inline-form" id="habit-add"><input maxlength="70" required placeholder="Add a habit…" id="habit-name"><button class="ex-btn ex-primary">+ Add habit</button></form>${section('This week','Tap a day to mark it complete')}<div class="ex-habit-table"><div class="ex-habit-row ex-habit-head"><span>YOUR HABITS</span>${dateKeys.map(d=>`<span>${new Date(d+'T12:00:00').toLocaleDateString(undefined,{weekday:'short'})[0]}</span>`).join('')}<span></span></div>${h.map(t=>`<div class="ex-habit-row"><strong>${esc(t.name)}</strong>${dateKeys.map(d=>`<button class="ex-habit-dot ${t.days.includes(d)?'checked':''}" data-habit="${t.id}" data-day="${d}">${t.days.includes(d)?'✓':''}</button>`).join('')}<button class="ex-quiet" data-remove="${t.id}">×</button></div>`).join('')}</div>${!h.length?empty('Start a new habit','Add something you’d like to do more often.'):''}<p class="ex-muted" style="margin-top:22px">Tracking is for reflection, not perfection. Every day is a fresh start.</p></div>`);
let b=body('habits');b.querySelector('#habit-add').onsubmit=e=>{e.preventDefault();h.push({id:Date.now(),name:b.querySelector('#habit-name').value.trim(),days:[]});store('habitsV3',h);draw()};b.querySelectorAll('[data-habit]').forEach(el=>el.onclick=()=>{let x=h.find(v=>String(v.id)===el.dataset.habit);if(!x)return;const d=el.dataset.day;x.days=x.days.includes(d)?x.days.filter(k=>k!==d):[...x.days,d];store('habitsV3',h);draw()});b.querySelectorAll('[data-remove]').forEach(el=>el.onclick=()=>{h=h.filter(v=>String(v.id)!==el.dataset.remove);store('habitsV3',h);draw()})}
draw()}
function flashView(){
let cards=load('flashV3',[{q:'What does HTML stand for?',a:'HyperText Markup Language'},{q:'What does CSS control?',a:'The style and layout of a webpage'},{q:'Which planet is known for its rings?',a:'Saturn'},{q:'What is the capital of Japan?',a:'Tokyo'}]);let index=0;let flipped=false;
function draw(){
index=Math.min(Math.max(0,index),Math.max(0,cards.length-1));
frame('flashcards',`<div class="ex-inset ex-flash"><div class="ex-flash-head">${header('LEARN SOMETHING NEW','Flashcards.','Make a deck of things you want to remember.')}${button('+ Add card','id="flash-add"','ex-btn ex-primary')}</div>${cards.length?`<div class="ex-flash-count">CARD ${index+1} OF ${cards.length}</div><button id="flash-card" class="ex-flip-card ${flipped?'flipped':''}"><small>${flipped?'ANSWER':'QUESTION'}</small><strong>${esc(flipped?cards[index].a:cards[index].q)}</strong><span>Tap to ${flipped?'see question':'reveal answer'}</span></button><div class="ex-flash-nav"><button class="ex-btn" id="flash-prev">← Previous</button><button class="ex-btn" id="flash-remove">Delete card</button><button class="ex-btn ex-primary" id="flash-next">Next →</button></div>`:empty('An empty deck','Add your first card to start studying.')}</div>`);
let b=body('flashcards');b.querySelector('#flash-add').onclick=()=>{let q=prompt('Enter the question');if(!q?.trim())return;let a=prompt('Enter the answer');if(!a?.trim())return;cards.push({q:q.trim().slice(0,260),a:a.trim().slice(0,500)});store('flashV3',cards);index=cards.length-1;flipped=false;draw()};
b.querySelector('#flash-card')?.addEventListener('click',()=>{flipped=!flipped;draw()});b.querySelector('#flash-next')?.addEventListener('click',()=>{index=(index+1)%cards.length;flipped=false;draw()});b.querySelector('#flash-prev')?.addEventListener('click',()=>{index=(index-1+cards.length)%cards.length;flipped=false;draw()});b.querySelector('#flash-remove')?.addEventListener('click',()=>{cards.splice(index,1);store('flashV3',cards);flipped=false;draw()})}
draw()}
const recipes=[
 ['🥑','Avocado Toast','10 min','Quick & easy',['Bread','Ripe avocado','Lemon juice','Salt and pepper'],['Toast the bread.','Mash the avocado with a squeeze of lemon.','Spread on toast and season to taste.']],
 ['🍓','Berry Yogurt Bowl','5 min','No cooking',['Plain yogurt','Mixed berries','Granola','Honey (optional)'],['Spoon yogurt into a bowl.','Add clean berries and granola.','Finish with a drizzle of honey if desired.']],
 ['🍝','Easy Tomato Pasta','20 min','Comfort food',['Pasta','Crushed tomatoes','Olive oil','Garlic','Basil'],['Cook pasta following package instructions.','Warm oil and garlic; add tomatoes and simmer.','Toss pasta with sauce and basil.']],
 ['🥪','Grilled Cheese','10 min','Classic',['Bread','Cheese','Butter'],['Butter the outsides of two bread slices.','Add cheese between slices.','Cook over medium-low heat until golden and the cheese melts.']],
 ['🍌','Banana Oat Pancakes','15 min','Breakfast',['1 ripe banana','1 egg','½ cup oats'],['Blend or mash ingredients into a batter.','Heat a nonstick pan on medium.','Cook small pancakes until set on both sides.']]
];
function recipesView(){
let selected=0;
function draw(){frame('recipes',`<div class="ex-inset">${header('GOOD THINGS TAKE SHAPE','The little kitchen.','A handful of simple ideas for your next snack or meal.')}<div class="ex-recipe-grid">${recipes.map(([emoji,n,time,type],i)=>`<button class="ex-recipe-tile ${selected===i?'active':''}" data-recipe="${i}"><span>${emoji}</span><strong>${n}</strong><small>${time} · ${type}</small></button>`).join('')}</div><div class="ex-recipe-detail"><span class="ex-recipe-large">${recipes[selected][0]}</span><div><div class="ex-eyebrow">${recipes[selected][2]} · ${recipes[selected][3]}</div><h2>${recipes[selected][1]}</h2><h3>Ingredients</h3><ul>${recipes[selected][4].map(t=>`<li>${esc(t)}</li>`).join('')}</ul><h3>Directions</h3><ol>${recipes[selected][5].map(t=>`<li>${esc(t)}</li>`).join('')}</ol></div></div></div>`);body('recipes').querySelectorAll('[data-recipe]').forEach(x=>x.onclick=()=>{selected=+x.dataset.recipe;draw()})}
draw()}
function sketchView(){
let ideas=load('ideasV3',[{id:1,headline:'My next big idea',detail:'What would I build if anything were possible?',color:0}]);
const palette=['#fbd7c8','#d3d9fe','#c5efdd','#f5deac','#e1d0f5'];
function draw(){frame('sketch',`<div class="ex-inset">${header('LET THE IDEAS FLOW','Idea Board.','A home for sparks of inspiration.')}<form class="ex-idea-form" id="idea-add"><input id="idea-title" maxlength="80" placeholder="An idea worth remembering…" required><textarea id="idea-detail" placeholder="A little more detail…" rows="2"></textarea><button class="ex-btn ex-primary">+ Pin idea</button></form><div class="ex-idea-grid">${ideas.map(a=>`<article class="ex-sticky" style="--sticky:${palette[a.color%palette.length]}"><button data-remove="${a.id}" title="Remove idea">×</button><strong>${esc(a.headline)}</strong><p>${esc(a.detail)}</p></article>`).join('')}</div></div>`);let b=body('sketch');b.querySelector('#idea-add').onsubmit=e=>{e.preventDefault();ideas.unshift({id:Date.now(),headline:b.querySelector('#idea-title').value.trim(),detail:b.querySelector('#idea-detail').value.trim(),color:ideas.length%palette.length});store('ideasV3',ideas);draw()};b.querySelectorAll('[data-remove]').forEach(el=>el.onclick=()=>{ideas=ideas.filter(a=>String(a.id)!==el.dataset.remove);store('ideasV3',ideas);draw()})}
draw()}
const renderers={appstore:storeView,launchpad:launchpadView,arcade:arcadeView,tasks:tasksView,focus:focusView,journal:journalView,codepad:codeView,atlas:atlasView,discover:discoverView,habits:habitsView,flashcards:flashView,recipes:recipesView,sketch:sketchView};
const api=window.GoldenOSExtra={meta,catalog,installed,install,uninstall,launch,render(id){if(!renderers[id])return false;renderers[id]();return true},register(id,render){renderers[id]=render},getBody:body,store,load,notify,esc,ic,openApp,openExternal,frame,header,section,empty,button};
const desktopWidget=document.createElement('div');desktopWidget.id='ex-desktop-widgets';desktopWidget.innerHTML=`<div class="ex-widget-title">YOUR SPACE <span>✦</span></div><button id="ex-widget-clock"><strong id="ex-widget-time">9:41</strong><span id="ex-widget-day">Today</span></button><button id="ex-widget-arcade"><span>✦</span><strong>Take a play break.</strong><small>Your arcade is ready</small></button><button id="ex-widget-tasks"><span>✓</span><strong>Make today count.</strong><small>Open your task list</small></button>`;
document.querySelector('#desktop').appendChild(desktopWidget);
desktopWidget.querySelector('#ex-widget-arcade').onclick=()=>openApp('arcade');
desktopWidget.querySelector('#ex-widget-tasks').onclick=()=>launch('tasks');
desktopWidget.querySelector('#ex-widget-clock').onclick=()=>openApp('clock');
const tickClock=()=>{const d=new Date();const a=desktopWidget.querySelector('#ex-widget-time');if(a)a.textContent=d.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'});const b=desktopWidget.querySelector('#ex-widget-day');if(b)b.textContent=d.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})};tickClock();setInterval(tickClock,15000);
})();