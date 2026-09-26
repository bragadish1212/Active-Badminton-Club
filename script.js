/* ABC Frankfurt website scripts */

/* ---------- Language (EN/DE) ---------- */
var ABC = (function(){
  var root=document.documentElement;
  var META={
    en:{title:"ABC Frankfurt | International badminton club",desc:"ABC Frankfurt is the international badminton club in Frankfurt am Main. Halls and playing times, league teams, trial sessions and membership."},
    de:{title:"ABC Frankfurt | Internationaler Badmintonverein",desc:"ABC Frankfurt ist der internationale Badmintonverein in Frankfurt am Main. Hallen und Trainingszeiten, Ligamannschaften, Probetraining und Mitgliedschaft."}
  };
  var listeners=[];
  function lang(){ return root.getAttribute("data-lang")==="de"?"de":"en"; }
  function swap(el,attr,l){
    var key="data-orig-"+attr;
    if(!el.hasAttribute(key)) el.setAttribute(key,el.getAttribute(attr)||"");
    el.setAttribute(attr,l==="de"?el.getAttribute("data-"+(attr==="alt"?"alt":"aria")+"-de"):el.getAttribute(key));
  }
  function set(l){
    root.setAttribute("data-lang",l); root.lang=l;
    document.title=META[l].title;
    var m=document.querySelector('meta[name="description"]'); if(m) m.setAttribute("content",META[l].desc);
    document.querySelectorAll("[data-alt-de]").forEach(function(el){swap(el,"alt",l);});
    document.querySelectorAll("[data-aria-de]").forEach(function(el){swap(el,"aria-label",l);});
    document.querySelectorAll("option[data-de]").forEach(function(o){
      if(!o.hasAttribute("data-en")) o.setAttribute("data-en",o.textContent);
      o.textContent=o.getAttribute(l==="de"?"data-de":"data-en");
    });
    document.querySelectorAll(".lang-btn").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.set===l));});
    try{localStorage.setItem("abc-lang",l);}catch(e){}
    listeners.forEach(function(fn){fn(l);});
  }
  document.querySelectorAll(".lang-btn").forEach(function(b){b.addEventListener("click",function(){set(b.dataset.set);});});
  return {lang:lang,set:set,onChange:function(fn){listeners.push(fn);}, init:function(){set(lang());}};
})();

/* Current season: April–September is summer, October–March is winter (confirm with the club) */
function abcSeason(){ var m=new Date().getMonth(); return (m>=3&&m<=8)?"summer":"winter"; }

/* ---------- Court drawings in the schedule ---------- */
document.querySelectorAll(".courts[data-courts]").forEach(function(el){
  var n=+el.dataset.courts, m=document.createElement("div");
  m.className="mini"; m.setAttribute("aria-hidden","true");
  for(var i=0;i<n;i++) m.appendChild(document.createElement("i"));
  el.prepend(m);
});

/* ---------- Winter/summer schedule switch ---------- */
(function(){
  var btns=document.querySelectorAll(".toggle button");
  function show(season){
    btns.forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.season===season));});
    document.querySelectorAll(".fx li").forEach(function(li){var w=li.dataset.when;li.hidden=!(w==="all"||w===season);});
  }
  btns.forEach(function(b){b.addEventListener("click",function(){show(b.dataset.season);});});
  show(abcSeason());
})();

/* ---------- Tonight at ABC ---------- */
(function(){
  var el=document.getElementById("tonight"); if(!el) return;
  var T={
    en:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],on:"On now",until:"until",at:"at",courts:"courts",tonight:"Tonight",today:"Today",next:"Next session",tomorrow:"tomorrow",kurabu:"Holiday changes on KURABU"},
    de:{days:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],on:"Jetzt",until:"bis",at:"in der",courts:"Felder",tonight:"Heute Abend",today:"Heute",next:"Nächstes Training",tomorrow:"morgen",kurabu:"Ferienänderungen in KURABU"}
  };
  var toMin=function(t){var p=t.trim().split(":");return +p[0]*60+ +p[1];};
  var season=abcSeason(), sessions=[];
  document.querySelectorAll(".fx li").forEach(function(li){
    var w=li.dataset.when; if(!(w==="all"||w===season)) return;
    var times=li.querySelector(".time").textContent.split(/[–-]/);
    li.dataset.days.split(",").forEach(function(d){
      sessions.push({day:+d,start:toMin(times[0]),end:toMin(times[1]),from:times[0].trim(),to:times[1].trim(),
        hall:li.querySelector(".hall strong").textContent,courts:li.querySelector(".courts").dataset.courts});
    });
  });
  function render(l){
    var t=T[l], now=new Date(), today=now.getDay(), mins=now.getHours()*60+now.getMinutes(), html="", live=false;
    var first=function(d,after){return sessions.filter(function(x){return x.day===d&&(after===undefined||after<x.end);}).sort(function(a,b){return a.start-b.start;})[0];};
    var s=first(today,mins);
    if(s&&mins>=s.start){ live=true; html="<b>"+t.on+"</b> "+t.until+" "+s.to+" "+t.at+" "+s.hall+", "+s.courts+" "+t.courts; }
    else if(s){ html="<b>"+(s.start>=17*60?t.tonight:t.today)+"</b> "+s.from+"–"+s.to+" "+t.at+" "+s.hall+", "+s.courts+" "+t.courts; }
    else{
      for(var i=1;i<=7&&!s;i++){ var d=(today+i)%7; s=first(d);
        if(s) html="<b>"+t.next+"</b> "+(i===1?t.tomorrow:t.days[d])+", "+s.from+"–"+s.to+" "+t.at+" "+s.hall; }
    }
    if(!html){ el.hidden=true; return; }
    el.innerHTML='<span class="dot" aria-hidden="true"></span><span>'+html+'</span><a href="https://abc-frankfurt.kurabu.com/">'+t.kurabu+'</a>';
    el.classList.toggle("live",live); el.hidden=false;
  }
  ABC.onChange(render);
})();

/* ---------- ABC Open countdown ---------- */
(function(){
  var box=document.getElementById("open-count"); if(!box) return;
  var line=document.getElementById("cd-line"), date=document.getElementById("cd-date");
  var p=function(s){var a=s.split("-");return new Date(+a[0],+a[1]-1,+a[2]);};
  var start=p(box.dataset.start), end=p(box.dataset.end);
  var T={
    en:{days:function(n){return "<b>"+n+" days</b>until the next ABC Open";},tomorrow:"<b>Tomorrow</b>the next ABC Open starts",on:"<b>On now</b>ABC Open is under way",soon:"Dates for the next ABC Open are coming soon."},
    de:{days:function(n){return "<b>"+n+" Tage</b>bis zum nächsten ABC Open";},tomorrow:"<b>Morgen</b>startet das nächste ABC Open",on:"<b>Jetzt</b>läuft das ABC Open",soon:"Die Termine für das nächste ABC Open folgen bald."}
  };
  function render(l){
    var now=new Date(), today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    var days=Math.round((start-today)/864e5), t=T[l];
    if(days>1) line.innerHTML=t.days(days);
    else if(days===1) line.innerHTML=t.tomorrow;
    else if(today<=end) line.innerHTML=t.on;
    else { line.textContent=t.soon; date.hidden=true; }
  }
  ABC.onChange(render);
})();

/* ---------- Trial request form ---------- */
(function(){
  // Paste your form service address here, e.g. "https://formspree.io/f/abcdwxyz".
  // While it is empty, the form opens the visitor's email app with the answers filled in.
  var FORM_ENDPOINT="";
  var JOIN_EMAIL="joinabc@abc-frankfurt.de";

  var f=document.getElementById("trial-form"); if(!f) return;
  var E=f.elements, status=f.querySelector(".status");
  var T={
    en:{fix:"Some answers need fixing before you can send.",sending:"Sending…",send:"Send request",
        fail:"Your request wasn’t sent. Check your connection and try again, or email "+JOIN_EMAIL+".",
        mail:"Your email app should now open with your request filled in. Press send there to finish.",
        sentH:"Request sent",sent:function(e){return "Thanks. We’ll reply by email to "+e+" once we can offer you a trial place.";}},
    de:{fix:"Bitte korrigiere die markierten Angaben, bevor du sendest.",sending:"Wird gesendet…",send:"Anfrage senden",
        fail:"Deine Anfrage wurde nicht gesendet. Prüfe deine Verbindung und versuche es erneut, oder schreib an "+JOIN_EMAIL+".",
        mail:"Dein E-Mail-Programm sollte sich jetzt mit deiner Anfrage öffnen. Drück dort auf Senden, um sie abzuschicken.",
        sentH:"Anfrage gesendet",sent:function(e){return "Danke. Wir antworten per E-Mail an "+e+", sobald wir dir ein Probetraining anbieten können.";}}
  };
  var t=function(){return T[ABC.lang()];};
  var level=E.level, note=document.getElementById("tf-beginner");
  level.addEventListener("change",function(){note.hidden=level.value!=="Beginner";});

  var checks=[
    ["tf-name",function(v){return v.trim().length>1;}],
    ["tf-email",function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());}],
    ["tf-level",function(v){return !!v;}],
    ["tf-exp",function(v){return v.trim().length>2;}],
    ["tf-consent",function(v,el){return el.checked;}]
  ];
  function check(id,test){
    var el=document.getElementById(id), ok=test(el.value,el), err=document.getElementById(id+"-err");
    el.setAttribute("aria-invalid",String(!ok));
    if(ok) el.removeAttribute("aria-describedby"); else el.setAttribute("aria-describedby",id+"-err");
    err.classList.toggle("on",!ok);
    return ok;
  }
  checks.forEach(function(c){
    var el=document.getElementById(c[0]);
    el.addEventListener(el.type==="checkbox"||el.tagName==="SELECT"?"change":"blur",function(){
      if(el.getAttribute("aria-invalid")!==null||el.value) check(c[0],c[1]);
    });
  });
  var lastMsg=null;
  function say(kind,key){ lastMsg=[kind,key]; status.className="status full "+kind; status.textContent=t()[key]; status.hidden=false; }
  ABC.onChange(function(){ if(lastMsg&&!status.hidden) say(lastMsg[0],lastMsg[1]); });

  f.addEventListener("submit",function(e){
    e.preventDefault();
    var bad=checks.filter(function(c){return !check(c[0],c[1]);});
    if(bad.length){ say("bad","fix"); document.getElementById(bad[0][0]).focus(); return; }
    if(E.website.value){ done(); return; } // a spam bot filled the hidden field

    var nights=[].map.call(f.querySelectorAll("[name=nights]:checked"),function(x){return x.value;}).join(", ");
    var data={name:E.name.value.trim(),email:E.email.value.trim(),level:E.level.value,membership:E.membership.value||"Not sure yet",
      experience:E.experience.value.trim(),nights:nights||"Any",gender:E.gender.value||"Not given",phone:E.phone.value.trim()||"Not given",
      message:E.message.value.trim(),language:ABC.lang()==="de"?"German":"English"};

    if(FORM_ENDPOINT){
      var btn=f.querySelector("[type=submit]"); btn.disabled=true; btn.textContent=t().sending;
      fetch(FORM_ENDPOINT,{method:"POST",headers:{"Accept":"application/json","Content-Type":"application/json"},
        body:JSON.stringify(Object.assign({_subject:"Trial session request: "+data.name,_replyto:data.email},data))})
      .then(function(r){ if(!r.ok) throw 0; done(); })
      .catch(function(){ btn.disabled=false; btn.textContent=t().send; say("bad","fail"); });
    }else{
      var body=["Name: "+data.name,"Email: "+data.email,"Phone: "+data.phone,"Level: "+data.level,"Membership: "+data.membership,
        "Nights: "+data.nights,"Gender: "+data.gender,"Language: "+data.language,"","Experience:",data.experience,"","Message:",data.message||"-"].join("\n");
      location.href="mailto:"+JOIN_EMAIL+"?subject="+encodeURIComponent("Trial session request: "+data.name)+"&body="+encodeURIComponent(body);
      say("info","mail");
    }
  });
  function done(){
    var d=document.createElement("div"); d.className="sent"; d.setAttribute("role","status"); d.tabIndex=-1;
    var h=document.createElement("h3"), p=document.createElement("p");
    h.textContent=t().sentH; p.textContent=t().sent(E.email.value.trim());
    d.appendChild(h); d.appendChild(p); f.replaceWith(d); d.focus();
  }
})();

ABC.init();
