(()=>{
'use strict';
const VERSION='3.0.0';
const FEATURED=[
 ['✦','Liquid Glass','A refined desktop with luminous materials, smoother windows, and a responsive dock.'],
 ['◈','App Store & Launchpad','Discover and install productivity, creativity, learning, and game apps.'],
 ['◉','Golden Gate Arcade','Play 2048, Neon Snake, Memory Match, Mines and Type Sprint.'],
 ['♫','Create & Explore','Make pixel art, compose your own melodies, discover places and learn new things.']
];
const storageKey='ggo:last-shown-version';
const read=()=>{try{return localStorage.getItem(storageKey)}catch{return null}};
function showUpdate(){
 if(read()===VERSION)return;
 if(document.getElementById('ggo-release-overlay'))return;
 const root=document.createElement('div');
 root.id='ggo-release-overlay';
 root.setAttribute('role','presentation');
 root.innerHTML='<div class="ggo-release-backdrop"></div><section class="ggo-release-panel" role="dialog" aria-modal="true" aria-labelledby="ggo-release-title"><div class="ggo-release-hero"><span class="ggo-release-sparkle">✦</span><div class="ggo-release-overline">THE GOLDEN GATE EXPERIENCE</div><h2 id="ggo-release-title">You have successfully updated to<br><span>version '+VERSION+'</span></h2><p>Welcome to an entirely new world of possibilities.</p></div><div class="ggo-release-content"><div class="ggo-release-subheading">WHAT\'S NEW IN THIS UPDATE</div><div class="ggo-release-features">'+FEATURED.map(([symbol,title,description])=>'<div class="ggo-release-feature"><span class="ggo-release-icon">'+symbol+'</span><div><strong>'+title+'</strong><p>'+description+'</p></div></div>').join('')+'</div><div class="ggo-release-actions"><button class="ggo-release-dismiss" type="button">Explore the desktop</button><button class="ggo-release-open-store" type="button">Browse App Store ↗</button></div><span class="ggo-release-note">You will see this announcement once for each new version.</span></div></section>';
 document.body.append(root);
 const primary=root.querySelector('.ggo-release-dismiss');
 let acknowledged=false;
 function close(openStore){if(acknowledged)return;acknowledged=true;try{localStorage.setItem(storageKey,VERSION)}catch{}root.classList.add('ggo-release-closing');setTimeout(()=>root.remove(),260);document.removeEventListener('keydown',onKey);if(openStore)window.GoldenOS?.openApp('appstore')}
 function onKey(e){if(e.key==='Escape'||e.key==='Enter'){e.preventDefault();close(false)}}
 primary.addEventListener('click',()=>close(false));
 root.querySelector('.ggo-release-open-store').addEventListener('click',()=>close(true));
 document.addEventListener('keydown',onKey);
 primary.focus();
}
window.GoldenGateVersion=VERSION;
if(document.readyState==='complete')setTimeout(showUpdate,1500);
else window.addEventListener('load',()=>setTimeout(showUpdate,1500),{once:true});
})();