
(function(){
 var mb=document.querySelector('.menu-btn'),nv=document.getElementById('mainnav');
 if(mb&&nv){mb.addEventListener('click',function(){var o=nv.classList.toggle('open');mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Close menu':'Open menu');});
  nv.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nv.classList.remove('open');mb.setAttribute('aria-expanded','false');});});}
 var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.1}):null;
 document.querySelectorAll('.rise').forEach(function(el){io?io.observe(el):el.classList.add('in');});
 // auto table of contents
 var toc=document.querySelector('.toc-links');
 if(toc){document.querySelectorAll('.doc article > h2').forEach(function(h,i){if(!h.id)h.id='s'+(i+1);var a=document.createElement('a');a.href='#'+h.id;a.textContent=h.textContent;toc.appendChild(a);});}
 // timeline funnel
 var nodes=document.querySelectorAll('.tl-node'),fill=document.querySelector('.tl-fill'),tt=document.querySelector('[data-tltime]');
 if(nodes.length){var i=0,T=['11:48 PM','11:49 PM','11:51 PM','11:53 PM','Next week'];
  function step(){nodes.forEach(function(n,k){n.classList.toggle('on',k===i);n.classList.toggle('past',k<i);});if(fill)fill.style.width=(i/(nodes.length-1)*84)+'%';if(tt)tt.textContent=T[i];i=(i+1)%nodes.length;}
  step();setInterval(step,2300);}
 // constellation canvas
 var c=document.querySelector('.hx canvas');
 if(c&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var x=c.getContext('2d'),W,H,D=Math.min(2,devicePixelRatio||1),N=[];
  function rs(){W=c.clientWidth;H=c.clientHeight;c.width=W*D;c.height=H*D;x.setTransform(D,0,0,D,0,0);}rs();addEventListener('resize',rs);
  var n=Math.min(60,Math.round(innerWidth/22));for(var k=0;k<n;k++)N.push({x:Math.random()*innerWidth,y:Math.random()*600,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25});
  (function f(){x.clearRect(0,0,W,H);for(var a=0;a<N.length;a++){var p=N[a];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
    for(var b=a+1;b<N.length;b++){var q=N[b],dx=p.x-q.x,dy=p.y-q.y,d=dx*dx+dy*dy;if(d<15000){x.strokeStyle='rgba(37,99,255,'+(0.16*(1-d/15000))+')';x.lineWidth=1;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke();}}
    x.fillStyle=a%5?'rgba(37,99,255,.35)':'rgba(147,207,18,.8)';x.beginPath();x.arc(p.x,p.y,a%5?2:3,0,6.283);x.fill();}requestAnimationFrame(f);})();}
 // deadlines (federal; weekend roll-forward; holidays not modeled)
 function roll(d){var w=d.getDay();if(w===6)d.setDate(d.getDate()+2);if(w===0)d.setDate(d.getDate()+1);return d;}
 function list(now){var y=now.getFullYear(),out=[];[y,y+1].forEach(function(Y){
   out.push([new Date(Y,0,15),'Q4 estimated tax payment (prior year)']);out.push([new Date(Y,2,15),'S-corp & partnership returns (1120-S, 1065)']);
   out.push([new Date(Y,3,15),'Individual & C-corp returns + Q1 estimate (tax due even if you extend)']);out.push([new Date(Y,5,15),'Q2 estimated tax payment']);
   out.push([new Date(Y,8,15),'Q3 estimate + extended S-corp & partnership returns']);out.push([new Date(Y,9,15),'Extended individual & C-corp returns']);});
  return out.map(function(r){return [roll(r[0]),r[1]];}).filter(function(r){return r[0]>=new Date(now.getFullYear(),now.getMonth(),now.getDate());}).sort(function(a,b){return a[0]-b[0];});}
 var now=new Date(),L=list(now),fmt={month:'short',day:'numeric',year:'numeric',weekday:'short'};
 var cd=document.querySelector('[data-next-deadline]');
 if(cd&&L.length){var d0=L[0],days=Math.ceil((d0[0]-now)/864e5);cd.querySelector('.num').textContent=days+(days===1?' day':' days');cd.querySelector('.what').textContent=d0[1]+' · '+d0[0].toLocaleDateString('en-US',fmt);}
 var dl=document.getElementById('deadlines');
 if(dl){L.slice(0,8).forEach(function(r,k){var days=Math.ceil((r[0]-now)/864e5);var row=document.createElement('div');row.className='dl-row'+(k===0?' next':'');
   row.innerHTML='<span class="d">'+r[0].toLocaleDateString('en-US',fmt)+'</span><span>'+r[1]+'</span><span class="left">'+(days<=0?'Today':days+' days')+'</span>';dl.appendChild(row);});}
 // automation hours estimator
 var est=document.getElementById('hoursest');
 if(est){function run(){var tot=0;est.querySelectorAll('input[type=range]').forEach(function(r){est.querySelector('[data-for='+r.id+']').textContent=r.value+(r.id==='pct'?'%':' hrs');if(r.id!=='pct')tot+=+r.value;});
   var pct=+est.querySelector('#pct').value/100,yr=Math.round(tot*pct*50);est.querySelector('.res').innerHTML='Hours your team could get back each year: <b>'+yr.toLocaleString()+'</b><br><small>'+tot+' admin hrs/week × '+Math.round(pct*100)+'% automated × 50 weeks. Your inputs only.</small>';}
  est.querySelectorAll('input').forEach(function(r){r.addEventListener('input',run);});run();}
})();
