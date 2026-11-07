
(function(){
  var forms=document.querySelectorAll('form[data-claim]');
  forms.forEach(function(f){
    var t0=Date.now(), touched=false;
    ['keydown','pointerdown','touchstart'].forEach(function(ev){f.addEventListener(ev,function(){touched=true;},{passive:true});});
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var st=f.querySelector('.form-status');
      function say(m,c){if(st){st.textContent=m;st.className='form-status '+(c||'');}}
      if(f.querySelector('[name=_honey]').value){say('Thanks!','ok');return;}
      if(!touched||Date.now()-t0<4000){say('Please take a moment to fill out the form.','warn');return;}
      if(!f.checkValidity()){f.reportValidity();return;}
      var u=atob(f.dataset.a), d=atob(f.dataset.b);
      var addr=u+String.fromCharCode(64)+d;
      var data={};new FormData(f).forEach(function(v,k){if(k!=='_honey')data[k]=v;});
      data._subject='Site claim request: bestdenveraccountant.com';
      data._template='table';data._captcha='false';
      var btn=f.querySelector('button[type=submit]');if(btn){btn.disabled=true;}
      say('Sending…','');
      fetch('https://formsubmit.co/ajax/'+addr,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(function(r){return r.json().catch(function(){return {};}).then(function(j){return {ok:r.ok,j:j};});})
        .then(function(res){
          if(res.ok&&(res.j.success===true||res.j.success==='true')){say('Received. We’ll reach out within one business day.','ok');f.reset();}
          else{say('Sent, but delivery is not confirmed yet. If you don’t hear back in a day, please try again.','warn');}
          if(btn)btn.disabled=false;
        })
        .catch(function(){say('That didn’t go through. Check your connection and try again.','err');if(btn)btn.disabled=false;});
    });
  });
})();
