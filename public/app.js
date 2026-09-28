const app = document.getElementById("app");
const audioBar = document.getElementById("audioBar");
const audio = document.getElementById("siteAudio");
const today = new Date();
const YEAR = 2026, MONTH = 9; // October, zero-based
const currentDay = today.getFullYear() === YEAR && today.getMonth() === MONTH ? today.getDate() : 0;
const state = { name:"Khushi", day:1, mood:"", quiz:0 };

const days = {
1:["A Little Beginning","Good morning, Khushi 🌷"],
2:["The Little Things","Good morning, Kuchu 🌷"],
3:["A Memory","Good morning ❤️"],
4:["Khushi: User Manual","Good morning, troublemaker 😂❤️"],
5:["A Song For You","Good morning, Khushi 🎵"],
6:["How Well Do You Know Us?","Good morning ❤️"],
7:["Seven Things I Love About You","Good morning, Khushi ❤️"],
8:["The First Time I Noticed You","Good morning ❤️"],
9:["The Conversation","Good morning, Khushi 📚"],
10:["The Roasting Era","Good morning, troublemaker 😂"],
11:["8 January","Good morning ❤️"],
12:["The Letter","Good morning, Khushi 💌"],
13:["The First Ride","Good morning 🛵"],
14:["How We Became Us","Good morning ❤️"],
15:["What I See When I Look At You","Good morning, Khushi 🌷"],
16:["When You're Angry With Me","Good morning 😤❤️"],
17:["For The Girl Who Overthinks","Good morning ❤️"],
18:["When You Need Me","Good morning, Khushi 🫂"],
19:["Three Things I Want You To Remember","Good morning 🌷"],
20:["If You Ever Doubt Yourself…","Good morning ❤️"],
21:["I Just Need You","Good morning, Khushi 💌"],
22:["Khushi: Advanced User Manual","Good morning 😂"],
23:["Emergency: Khushi Is Hungry","Good morning 🍕"],
24:["The Art of Being Angry","Good morning 😤"],
25:["The Dress Approval Committee","Good morning 👗"],
26:["The Khushi + Nitin Game","Good morning 🎮"],
27:["Things Only Khushi Does","Good morning ❤️"],
28:["The Khushi Archive","Good morning 📁"],
29:["The Things I Never Want To Lose","Good morning 🌙"],
30:["Before October Ends","Good morning, Khushi 💌"],
31:["One Last Thing…","Good morning ❤️"]
};

function esc(s){
 return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function layout(content, extra=""){
 return `<div class="screen"><div class="stars"></div><div class="wrap">${content}</div>${extra}</div>`;
}
function btn(text, action, cls="btn"){return `<button class="${cls}" onclick="${action}">${text}</button>`}
let audioTimeout;

function collapseAudio() {
  audioBar.classList.add("collapsed");
}

function expandAudio() {
  audioBar.classList.remove("collapsed");
  resetAudioTimeout();
}

function resetAudioTimeout() {
  clearTimeout(audioTimeout);
  audioTimeout = setTimeout(() => {
    if(!audio.paused && !audioBar.matches(':hover')) {
       collapseAudio();
    }
  }, 4000);
}

audioBar.addEventListener("click", (e) => {
  if (audioBar.classList.contains("collapsed")) {
    expandAudio();
  }
});
audioBar.addEventListener("mouseenter", expandAudio);
audioBar.addEventListener("mouseleave", () => {
  if(!audio.paused) resetAudioTimeout();
});
audio.addEventListener("play", resetAudioTimeout);
audio.addEventListener("pause", expandAudio);

function startAudio(){
  audioBar.classList.remove("hidden");
  expandAudio();
  audio.play().catch(()=>{});
}
function heartBurst(){
 for(let i=0;i<12;i++){
  const h=document.createElement("div"); h.className="float-heart"; h.textContent=["♥","♡","✦"][i%3];
  h.style.left=(15+Math.random()*70)+"%"; h.style.setProperty("--x",(Math.random()*180-90)+"px");
  document.body.appendChild(h); setTimeout(()=>h.remove(),5000);
 }
}
function enter(){
 startAudio(); renderCalendar();
}
function intro(){
 app.innerHTML=layout(`
  <section class="center" style="min-height:calc(100vh - 56px)">
   <div>
    <div class="moon"></div>
    <p class="kicker fade">For Khushi</p>
    <h2 class="fade">Hey, Khushi...</h2>
    <p class="lead fade">I didn't make this for an occasion.</p>
    <p class="lead fade">There isn't one today.</p>
    <p class="lead fade">I just wanted to make something that belongs to you.</p>
    <p class="lead fade" style="margin-top:35px"><strong>So I made you a month.</strong></p>
    <h1 class="fade">OCTOBER</h1>
    <p class="lead fade">31 days. 31 little pieces of you.</p>
    ${btn("✦ ENTER MY OCTOBER ✦","enter()","btn primary")}
   </div>
  </section>`);
}
function renderCalendar(){
 const progress = currentDay ? Math.min(currentDay,31) : 0;
 let cells="";
 ["SUN","MON","TUE","WED","THU","FRI","SAT"].forEach(d=>cells+=`<div class="weekday">${d}</div>`);
 const first = new Date(YEAR,MONTH,1).getDay();
 for(let i=0;i<first;i++) cells+=`<div></div>`;
 for(let d=1;d<=31;d++){
  const unlocked = currentDay===0 ? false : d<=currentDay;
  const past = currentDay>0 && d<currentDay;
  const cls=`day ${unlocked?"available":"locked"} ${past?"past":""} ${d===currentDay?"today":""}`;
  cells+=`<button class="${cls}" ${unlocked?`onclick="openDay(${d})"`:"onclick=\"lockedDay()\""}><span class="num">${d}</span><span class="status">${unlocked?(d===currentDay?"TODAY":"OPEN"):"LOCKED 🔒"}</span></button>`;
 }
 app.innerHTML=layout(`
  <header class="topbar"><div><div class="kicker">A little something for my favourite person</div><h2 style="margin-bottom:0">OCTOBER 2026</h2></div><button class="btn ghost" onclick="showPrivate()">🔐 Private</button></header>
  <div class="card" style="margin-bottom:18px"><div style="display:flex;justify-content:space-between;gap:10px"><span>OUR OCTOBER</span><span>${progress}/31</span></div><div class="progress" style="margin-top:9px"><span style="width:${progress/31*100}%"></span></div></div>
  <div class="calendar">${cells}</div>
  <p class="footer">31 days. Don't rush. Some things are meant to be discovered slowly. 🌙</p>
 `);
}
function lockedDay(){ alert("Not yet, Khushi 🤭 You’ll have to wait for this one."); }

function morning(day,title,body){
 return `<div class="dayhead"><div class="kicker">DAY ${day} · OCTOBER 2026</div><h2>${title}</h2><p class="lead">${body}</p></div>`;
}
function privateBox(day=0){
 return `<div class="card" style="margin-top:22px"><div class="kicker">Private Corner</div><h3>🔐 A little space that's only for you.</h3>
 <p class="small">Something you want to eat? Something happened today? Angry with me? Miss me? Tell me anything.</p>
 <div class="choice-row" id="moods">
 ${["Happy ❤️","Loved 🫂","Sleepy 😴","Angry 😤","Sad 🌙","Just okay","Hungry 🍕"].map(m=>`<button class="choice" onclick="pickMood(this,'${m}')">${m}</button>`).join("")}</div>
 <textarea class="blank" id="privateMessage" placeholder="Dear Nitin, write whatever you want here..."></textarea>
 <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:10px">${btn("SEND TO ME ❤️",`sendPrivate(${day})`,"btn primary")}</div>
 <div id="sendResult"></div></div>`;
}
function pickMood(el,m){ document.querySelectorAll("#moods .choice").forEach(x=>x.classList.remove("selected"));el.classList.add("selected");state.mood=m; }
async function sendPrivate(day){
 const msg=document.getElementById("privateMessage")?.value.trim();
 const out=document.getElementById("sendResult");
 if(!msg){out.innerHTML=`<div class="result" style="color:var(--accent)">Write something first, Khushi ❤️</div>`;return}
 const res=await fetch("/api/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:"Khushi",day,message:msg,mood:state.mood})});
 if(res.ok){out.innerHTML=`<div class="result">Delivered to your Cutie Nitin. ❤️ Now go eat something.</div>`;document.getElementById("privateMessage").value="";heartBurst();}
 else {
   const data = await res.json().catch(()=>({}));
   out.innerHTML=`<div class="result">${data.error || "Something went wrong. Please try again."}</div>`;
 }
}
function back(){renderCalendar()}

function openDay(day){
 state.day=day; startAudio();
 const [title,greet]=days[day];
 const renderer = dayRenderers[day] || genericDay;
 app.innerHTML=layout(renderer(day,title,greet));
 window.scrollTo({top:0,behavior:"smooth"});
}

function day3(){
 return morning(3,"A Memory",`<strong>“Do you remember this?”</strong>`) +
 `<div class="card"><img class="photo" src="/assets/day3-memory.jpg" alt="A memory of Nitin and Khushi"><p class="quote" style="margin-top:20px">I kept this one because some pictures don't need a reason.</p><textarea class="blank" id="memoryAnswer" placeholder="Do you remember? Tell Nitin what you remember..."></textarea><button class="btn primary" style="margin-top:10px" onclick="sendCustom(3,'memoryAnswer')">SEND TO NITIN ❤️</button><div id="customResult"></div></div>` + privateBox(3) + backButton();
}
async function sendCustom(day,id){
 const msg=document.getElementById(id)?.value.trim(); if(!msg){alert("Write your answer ❤️");return}
 const res=await fetch("/api/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:"Khushi",day,message:msg,mood:"Memory answer"})});
 document.getElementById("customResult").innerHTML=res.ok?`<div class="result">Your memory is safely sent to Nitin. ❤️</div>`:`<div class="result">Please try again.</div>`;
}
function backButton(){return `<div style="text-align:center;margin:28px 0">${btn("← BACK TO OCTOBER","back()","btn ghost")}</div>`}

function day1(){return morning(1,"A Little Beginning","Good morning, Khushi 🌷<br>I hope you woke up with a smile today.")+
 `<div class="paper letter"><p><strong>Dear Khushi,</strong></p>
 <p>Welcome to your little October. There isn't a special occasion today. I didn't need one. I just wanted to give you something that reminds you, little by little, of how special you are to me.</p>
 <p>You're beautiful. And yes, I know you probably already know that I'm going to tell you this again and again. 😂</p>
 <p>But what I love isn't only the way you look. I love your smile, that little dimple when you're genuinely happy, your childish side, and all those tiny things that make an ordinary day feel better.</p>
 <p>I don't need an anniversary, birthday, or any special reason to make something for you.</p>
 <p>Sometimes I just look at you and think… yeah, I'm really lucky this girl is a part of my life.</p>
 <p>So I made you October.<br><strong>31 days. 31 little pieces of you. ❤️</strong></p>
 <p>And this is only the beginning.</p></div>`+privateBox(1)+backButton();}

function day2(){return morning(2,"The Little Things","Today’s reminder: you don't have to do anything extraordinary to be special to me.")+
 `<div class="grid"><div class="card"><h3>The dimple</h3><p>You smile, and suddenly there’s that little dimple.</p></div><div class="card"><h3>Food</h3><p>Apparently Khushi is powered by pasta, pizza, chai, chowmein and rolls.</p></div><div class="card"><h3>Anger</h3><p>You can be angry at everyone… but somehow Nitin gets the special treatment.</p></div><div class="card"><h3>Shy</h3><p>Say something slightly naughty and suddenly the same girl becomes shy.</p></div><div class="card"><h3>Nakhre</h3><p>Whether you're right or wrong, Nitin still has to manao you. 😂</p></div></div>
 <div class="card" style="margin-top:15px"><h3>And yes… I still love all of it. ❤️</h3></div>`+privateBox(2)+backButton();}
function day4(){return morning(4,"Khushi — User Manual","Good morning, troublemaker. 😂❤️")+
 `<div class="card"><div class="kicker">KHUSHI — USER MANUAL</div><div class="grid">
 <div><h3>Height</h3><p>Cute. Classified as cute according to Nitin. 😂</p></div>
 <div><h3>Smile</h3><p>Dangerous.</p></div><div><h3>Nakhre</h3><p>Unlimited.</p></div><div><h3>Sleep mode</h3><p>Approximately 2 minutes.</p></div><div><h3>Food requirement</h3><p>CONSTANT.</p></div><div><h3>Favourite fuel</h3><p>Rolls, pasta, pizza, chai, chowmein.</p></div><div><h3>Anger mode</h3><p>Primarily targeted at Nitin.</p></div><div><h3>Conflict protocol</h3><p>Nitin must manao her. Whether Khushi is right or wrong. 😂</p></div></div>
 <p class="secret">Manufacturer’s warning: Do not underestimate her nakhre.</p><p><strong>Recommended treatment: Manao her. ❤️</strong></p></div>`+privateBox(4)+backButton();}

function day5(){return morning(5,"A Song For You","For the girl whose nakhre somehow became one of my favourite things. 🎵")+
 `<div class="card center"><div class="heart">♪</div><h3>Nakhre Tere — Nikk</h3><p class="small">Your uploaded song is playing in the background.</p>
 <p class="lead">The lyric panel below is ready for lyrics you have permission to use. I have not embedded the full copyrighted lyrics in the site.</p>
 <pre id="lyrics" style="white-space:pre-wrap;text-align:left;line-height:1.8;color:#e8dfcf"></pre>
 <div style="display:flex;gap:10px;justify-content:center">${btn("PLAY SONG","startAudio()","btn primary")}</div></div>`+privateBox(5)+backButton();}

function day6(){const qs=[
 ["Where did Nitin first notice Khushi?","In the classroom"],
 ["What was the first thing Nitin noticed?","She entered with full joy, jumping like a kangaroo 😂"],
 ["Who proposed first?","Nitin proposed first; later, on 11 January 2026, Khushi proposed with a letter and chocolate ❤️"],
 ["When did the relationship officially begin?","11 January 2026"],
 ["What was the first memorable ride?","Prateek’s scooty from college to the bus stand"]
]; return morning(6,"How Well Do You Know Us?","Let's see if you remember our story. ❤️")+`<div id="quiz" class="card"></div>`+privateBox(6)+backButton()+`<script>window.__quiz=${JSON.stringify(qs)}</script>`;}

function day7(){return morning(7,"Seven Things I Love About You","I love all the little versions of you.")+
 `<div class="card letter"><ol>
 <li>You're ridiculously attractive to me.</li><li>You're beautiful.</li><li>I love when you hug me.</li><li>I love how happy you become when I gift you something.</li><li>You're with me whenever I need you.</li><li>I don't like when you're angry with me.</li><li>I love the beautiful, angry, overthinking, childish, nakhre wali you — all of you. ❤️</li>
 </ol><p class="quote">“Somehow, you're my person.”</p></div>`+privateBox(7)+backButton();}

function genericDay(day,title,greet){return morning(day,title,greet)+`<div class="card"><p class="lead">This day is part of our October story. ❤️</p></div>`+privateBox(day)+backButton();}



function day8(){return morning(8,"The First Time I Noticed You","Good morning ❤️")+`<div class="paper letter"><p>I was sitting at my classroom desk.</p><p>Then you entered the class with so much joy.</p><p>I don't know why, but I really liked that about you.</p><p><strong>And that was the moment I noticed you.</strong></p><p>And yes… I thought you were beautiful too. ❤️</p></div>`+privateBox(8)+backButton();}
function day9(){return morning(9,"The Conversation","Good morning, Khushi 📚")+`<div class="card letter"><p>We properly talked in the library.</p><p>You told me about your family and your situation.</p><p>And somewhere in that conversation, I realised there was much more to you than the girl I had noticed in class.</p><p><strong>I wanted to know you.</strong></p></div>`+privateBox(9)+backButton();}
function day10(){return morning(10,"The Roasting Era","Good morning, troublemaker 😂")+`<div class="card"><p class="quote">Khushi: “Main pankhe pe latak jaungi.”</p><p class="quote">Nitin: “Rehne de, tut jaayega.” 😂</p><p class="lead">I roasted you way too much. I still don't know how you tolerated me.</p><p class="quote">“But somehow… you stayed.” ❤️</p></div>`+privateBox(10)+backButton();}
function day11(){return morning(11,"8 January","Good morning ❤️")+`<div class="card letter"><div class="big-date">08<br><span style="font-size:.35em">JANUARY</span></div><p>Three days before everything changed…</p><p>You went to a boy I didn't like. I was upset.</p><p>Then you said sorry.</p><p>Maybe it was a small moment, but it mattered to me.</p><p><strong>Because three days later…</strong></p><p class="big-date" style="font-size:3rem">11 JANUARY</p></div>`+privateBox(11)+backButton();}
function day12(){return morning(12,"The Letter","Good morning, Khushi 💌")+`<div class="paper letter"><p>11 January 2026.</p><p>You gave me a letter.</p><p>You gave me a chocolate.</p><p>And then… <strong>you proposed to me.</strong> ❤️</p><p>I had proposed before. You had said no. But this time you chose me.</p><p class="quote">“11 January 2026 — the day you became my girlfriend, and my favourite person.”</p></div>`+privateBox(12)+backButton();}
function day13(){return morning(13,"The First Ride","Good morning 🛵")+`<div class="card letter"><p>It wasn't even my scooty. 😂</p><p>It was Prateek’s scooty.</p><p>From college to the bus stand.</p><p>No fancy date. No big plan.</p><p>Just a night ride… and you.</p><p><strong>But I enjoyed it.</strong> ❤️</p></div>`+privateBox(13)+backButton();}
function day14(){return morning(14,"How We Became Us","Good morning ❤️")+`<div class="card"><div class="timeline letter"><p><strong>CLASSROOM</strong><br>I noticed you.</p><p>↓</p><p><strong>LIBRARY</strong><br>We actually talked.</p><p>↓</p><p><strong>FRIENDSHIP</strong><br>I roasted you way too much. 😂</p><p>↓</p><p><strong>8 JANUARY</strong><br>You said sorry.</p><p>↓</p><p><strong>11 JANUARY 2026 ❤️</strong><br>A letter. A chocolate. A proposal.</p><p>↓</p><p><strong>US</strong></p></div><p class="quote">“A girl walked into my classroom with a lot of happiness… and somehow became my favourite person.”</p></div>`+privateBox(14)+backButton();}

function day15(){return morning(15,"What I See When I Look At You","Good morning, Khushi 🌷")+`<div class="card letter"><p>Everyone sees different things in a person.</p><p>I see your childish nature.</p><p>Your pure soul.</p><p>The love you have for your family.</p><p>Your smile.</p><p>Your shy face.</p><p>And yes… your beauty too. 😂</p><p><strong>I don't just love how you look. I love who you are.</strong> ❤️</p></div>`+privateBox(15)+backButton();}
function day16(){return morning(16,"When You're Angry With Me","Good morning 😤❤️")+`<div class="card"><h3>KHUSHI ANGER MODE</h3><p>Scolding Nitin.</p><p>Not talking.</p><p>“Main naraz nahi hoon.”</p><p><strong>Translation: She is absolutely naraz. 😂</strong></p><hr style="border-color:var(--line)"><h3>Treatment Protocol</h3><p>🌷 Flower → 💌 Card → 🍕 Tasty food → 💻 Website → 🫂 Manao Khushi</p><p class="quote">“Mujhe tumhara gussa bilkul pasand nahi.”</p></div>`+privateBox(16)+backButton();}
function day17(){return morning(17,"For The Girl Who Overthinks","Good morning ❤️")+`<div class="paper letter"><p>I know you worry about your family.</p><p>And sometimes you worry that I will leave you.</p><p>Khushi, meri baat sun.</p><p><strong>“Chinta mat kar. Main hoon tere saath.”</strong></p><p>You are an amazing girl.</p><p>You don't have to solve everything alone.</p></div>`+privateBox(17)+backButton();}
function day18(){return morning(18,"When You Need Me","Good morning, Khushi 🫂")+`<div class="card letter"><p>When I have a health issue, you stay with me.</p><p>You talk to me softly.</p><p>You hug me.</p><p>You stay.</p><p>Sometimes I don't need a solution.</p><p class="quote"><strong>“Bas tum chahiye hoti ho.” ❤️</strong></p><p>And I want you to know: if you call me because you need me, I want to be the person who comes.</p></div>`+privateBox(18)+backButton();}
function day19(){return morning(19,"Three Things I Want You To Remember","Good morning 🌷")+`<div class="grid"><div class="card"><h3>01</h3><p>I will never leave you.</p></div><div class="card"><h3>02</h3><p>You are the most beautiful girl for me.</p></div><div class="card"><h3>03</h3><p>You chose me. ❤️</p></div></div>`+privateBox(19)+backButton();}
function day20(){return morning(20,"If You Ever Doubt Yourself…","Good morning ❤️")+`<div class="paper letter"><p>Sometimes you worry that I might talk about you with my friends or gossip about you.</p><p><strong>I don't do that. And I never will.</strong></p><p>You're not some red flag I need to run away from.</p><p>You're my slightly angry, slightly possessive, completely lovable girl. ❤️</p><p>Please don't doubt my feelings because of a fear that isn't true.</p></div>`+privateBox(20)+backButton();}
function day21(){return morning(21,"I Just Need You","Good morning, Khushi 💌")+`<div class="paper letter"><p>Khushi, I don't say this enough, but…</p><p class="quote"><strong>I just need you.</strong></p><p>Bas mere saath rehna.</p><p>Aur mujhpe zyada gussa mat kiya kar. 😂❤️</p><p>I want us to grow together.</p><p>Jo bhi problem hogi, jo bhi difficult time aayega — hum dono milkar sab theek kar lenge.</p><p><strong>You chose me. And I want to keep choosing you.</strong></p></div>`+privateBox(21)+backButton();}

function day22(){return morning(22,"Khushi: Advanced User Manual","Good morning 😂")+`<div class="card"><div class="grid"><div><h3>😤 Anger Mode</h3><p>“Main naraz nahi hoon.”<br>Definitely naraz.</p></div><div><h3>👑 Ordering Mode</h3><p>“Ye karo.” “Meri baat suno.”</p></div><div><h3>🥺 Self-Blame Mode</h3><p>“Haan, main hi toh bekaar hoon.”<br><strong>Do NOT agree.</strong></p></div><div><h3>👀 Attention Mode</h3><p>Complaint + anger + attention required.</p></div><div><h3>🧒 Child Mode</h3><p>Talks like a child. Nitin finds it cute.</p></div><div><h3>👗 Fashion Mode</h3><p>Video call + new dress + “Kaisi lag rahi hoon?”</p></div></div><p class="quote">“Congratulations. You now understand approximately 7% of Khushi.” 😂</p></div>`+privateBox(22)+backButton();}
function day23(){return morning(23,"Emergency: Khushi Is Hungry","Good morning 🍕")+`<div class="card center"><h2>🚨 KHUSHI HUNGER DETECTED</h2><p>Hunger level: CRITICAL</p><div class="choice-row" style="justify-content:center"><span class="choice">🌯 ROLL — FAVOURITE</span><span class="choice">🍕 Pizza</span><span class="choice">🍝 Pasta</span><span class="choice">☕ Chai</span><span class="choice">🍜 Chowmein</span></div><h3 style="margin-top:25px">🚫 NOT APPROVED</h3><p>🍍 Pineapple · 🌱 Sprouts · 🥗 Healthy food</p><p class="quote">“Healthy food detected. Khushi has left the chat.” 😂</p><p><strong>If you need anything or anything you want to eat… contact your Cutie Nitin. ❤️</strong></p></div>`+privateBox(23)+backButton();}
function day24(){return morning(24,"The Art of Being Angry","Good morning 😤")+`<div class="card"><p><strong>Scenario:</strong> Nitin did something that annoyed Khushi.</p><button class="choice quiz-option" onclick="angerResult('A')">A. Sorry.</button><button class="choice quiz-option" onclick="angerResult('B')">B. But meri galti nahi thi.</button><button class="choice quiz-option" onclick="angerResult('C')">C. Achha baba, sorry. 🥺</button><div id="angerResult"></div></div>`+privateBox(24)+backButton();}
function angerResult(x){document.getElementById("angerResult").innerHTML=x==="C"?`<div class="result">❤️ Correct. Manao Khushi mode activated.</div>`:`<div class="result">🚨 KHUSHI HAS ENTERED ANGER MODE. Try again. 😂</div>`;}
function day25(){return morning(25,"The Dress Approval Committee","Good morning 👗")+`<div class="card center"><div class="heart">👗</div><h3>INCOMING VIDEO CALL — KHUSHI ❤️</h3><p>“Dekho, ye dress kaisi lag rahi hai?”</p><button class="choice quiz-option" onclick="dressResult(false)">“Achhi hai.”</button><button class="choice quiz-option" onclick="dressResult(false)">“Theek hai.”</button><button class="choice quiz-option" onclick="dressResult(true)">“Bahut sundar lag rahi ho.” ❤️</button><div id="dressResult"></div></div>`+privateBox(25)+backButton();}
function dressResult(ok){document.getElementById("dressResult").innerHTML=ok?`<div class="result">APPROVED ❤️ Fashion consultant duty successfully completed.</div>`:`<div class="result">❌ FAIL. Detailed appreciation required. 😂</div>`;}
function day26(){return morning(26,"The Khushi + Nitin Game","Good morning 🎮")+`<div class="card center"><h3>🎮 SURVIVE KHUSHI'S NAKHRE</h3><p>Collect the food. Complete the night ride. Survive anger mode.</p><div style="font-size:4rem;margin:20px">🌯 🍕 🛵 ❤️ 😤</div><p class="small">Mini-game interface ready — use the three buttons below.</p><div class="grid"><button class="btn" onclick="gameScore(1)">🍕 Feed Khushi</button><button class="btn" onclick="gameScore(1)">🛵 Night Ride</button><button class="btn" onclick="gameScore(1)">😂 Survive Nakhre</button></div><div id="gameResult"></div></div>`+privateBox(26)+backButton();}
function gameScore(n){const el=document.getElementById("gameResult");el.dataset.s=(+el.dataset.s||0)+n;el.innerHTML=`<div class="result">Score: ${el.dataset.s}/3 ❤️</div>`;if(+el.dataset.s===3)el.innerHTML=`<div class="result"><strong>You survived.</strong> Unfortunately, you still have to deal with Khushi. 😂❤️</div>`;}
function day27(){return morning(27,"Things Only Khushi Does","Good morning ❤️")+`<div class="grid"><div class="card"><h3>🧒 Child mode</h3><p>Talks like a child sometimes.</p></div><div class="card"><h3>👗 Dress calls</h3><p>Video calls Nitin to show a new dress.</p></div><div class="card"><h3>👀 Approval</h3><p>“Kaisi lag rahi hoon?”</p></div><div class="card"><h3>😂 Doesn't listen</h3><p>Sometimes Nitin's advice simply doesn't exist.</p></div><div class="card"><h3>😤 Anger</h3><p>“Main naraz nahi hoon.”</p></div><div class="card"><h3>🥺 Self-blame</h3><p>“Haan, main hi toh bekaar hoon.”</p></div></div><p class="quote">“Basically, you're just… Khushi.” ❤️</p>`+privateBox(27)+backButton();}
function day28(){return morning(28,"The Khushi Archive","Good morning 📁")+`<div class="card"><div class="grid"><div><h3>FILE 001</h3><p>The girl who loves rolls 🌯</p></div><div><h3>FILE 002</h3><p>Enemy of pineapple 🍍</p></div><div><h3>FILE 003</h3><p>Professional child 🧒</p></div><div><h3>FILE 004</h3><p>Part-time fashion consultant seeker 👗</p></div><div><h3>FILE 005</h3><p>Full-time Nitin attention seeker 😂</p></div><div><h3>FILE 006</h3><p>Anger specialist 😤</p></div></div><div class="paper" style="margin-top:20px;text-align:center"><h2>KHUSHI ❤️</h2><p>This is my favourite file.</p><p>And I don't think I'm ever going to delete it.</p></div></div>`+privateBox(28)+backButton();}
function day29(){return morning(29,"The Things I Never Want To Lose","Good morning 🌙")+`<div class="grid"><div class="card"><h3>🍽️ Eating together</h3><p>Chahe kuch special ho ya normal sa meal.</p></div><div class="card"><h3>🌷 Little happiness</h3><p>Chhoti-chhoti baaton pe saath khush hona.</p></div><div class="card"><h3>🌙 Night rides</h3><p>Raat ko saath ghoomne jaana.</p></div><div class="card"><h3>🫂 Hugs</h3><p>Those hugs.</p></div></div><div class="paper" style="margin-top:18px"><p>Mujhe fancy relationship nahi chahiye.</p><p>Mujhe ye chhoti-chhoti cheezein chahiye.</p><p><strong>Bas tumhare saath.</strong></p><p>And I never want you to stop loving me.</p></div>`+privateBox(29)+backButton();}
function day30(){return morning(30,"Before October Ends","Good morning, Khushi 💌")+`<div class="paper letter"><p>Khushi, tu kabhi-kabhi bolti hai ki main worst hoon, ki shayad maine teri life kharab kar di…</p><p>But I want you to know something.</p><p>Maine kabhi nahi chaha ki meri wajah se tum hurt ho.</p><p>Main maanta hoon ki kabhi-kabhi main kam manata hoon, tumpe gussa kar deta hoon, kabhi chilla deta hoon.</p><p><strong>But none of that changes how much I love you.</strong></p><p>I love you with my full heart.</p><p>Main tera khayal rakhunga. Tere saath rahunga. Aur hum dono saath grow karenge.</p><p>Mujhe woh Nitin banna hai jo tujhe manata tha, gifts deta tha, aur teri overthinking dur karta tha — na ki khud teri overthinking ban jaata tha.</p><p><strong>I want to become that person again.</strong></p><p>Not because I want to go backwards. Because I want us to become even better than before. ❤️</p></div>`+privateBox(30)+backButton();}
function day31(){return morning(31,"One Last Thing…","Good morning ❤️")+`<div id="finale" class="card center"><p class="kicker">31 DAYS</p><h2>Thank you for spending October with me.</h2><p class="lead">A lot of memories. A lot of stupid jokes. A lot of Khushi. And a lot of Nitin. 😂</p><button class="btn primary" onclick="finalSurprise()">FINISH OCTOBER</button></div>`+privateBox(31)+backButton();}
function finalSurprise(){
 heartBurst();
 document.getElementById("finale").innerHTML=`<div class="moon" style="transform:scale(.55);margin-bottom:5px"></div><h2>WAIT.</h2><p class="lead">I lied. 😂</p><h2>ONE LAST THING.</h2><div class="paper letter" style="text-align:left"><p>Khushi…</p><p>I made this whole website without even knowing how to make websites.</p><p>I spent time thinking about what would make you happy, what would make you smile, what would surprise you.</p><p>Because honestly…</p><p class="quote"><strong>I just want to make you happy.</strong></p><p>You are the girl I always imagined myself being with. And I want to keep making you happy.</p><p>I want us to eat together, go out at night, hug each other, laugh at stupid things, fight sometimes 😂, and then come back to each other.</p><p><strong>I want all of it.</strong></p><p>Not just the perfect days. All of them.</p><p>I promise you I will try to make you feel loved. I will take care of you. I will stay beside you. And I want us to grow together.</p><p class="quote"><strong>Hum dono ko saath rehna hai.</strong></p><p>And if you ever forget how much I care… remember this: I made all of this without knowing anything about coding, just because I wanted to create one happy memory for us.</p></div><div style="margin-top:28px"><p class="kicker">THE QUESTION</p><h2 style="font-size:clamp(1.8rem,7vw,3.5rem)">You once told me…<br>“Nitin, tu change ho gaya hai.”</h2><p class="lead"><strong>Ab sach-sach bata…<br>kya main phir se pehle jaisa ho gaya hoon?</strong></p><div class="grid"><button class="btn primary" onclick="finalAnswer('YES ❤️')">YES ❤️</button><button class="btn" onclick="finalAnswer('NOT YET 🥺')">NOT YET 🥺</button></div><div id="finalAnswer"></div></div>`;
}
async function finalAnswer(answer){
 const msg=`Final October answer: ${answer}`;
 await fetch("/api/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:"Khushi",day:31,message:msg,mood:"Final answer"})});
 document.getElementById("finalAnswer").innerHTML=`<div class="result">Whatever your answer is…<br><strong>I love you.</strong><br>And I'm going to keep trying. ❤️</div><h2 style="margin-top:28px">Happy October, Khushi.</h2><p class="lead">From your Cutie Nitin. 🌙❤️</p>`;
 heartBurst();
}

const dayRenderers = {1:day1,2:day2,3:day3,4:day4,5:day5,6:day6,7:day7,8:day8,9:day9,10:day10,11:day11,12:day12,13:day13,14:day14,15:day15,16:day16,17:day17,18:day18,19:day19,20:day20,21:day21,22:day22,23:day23,24:day24,25:day25,26:day26,27:day27,28:day28,29:day29,30:day30,31:day31};

async function showPrivate(){
 app.innerHTML=layout(`
  <div class="center" style="min-height:50vh">
    <div class="card" style="width:min(400px, 100%)">
      <div class="kicker">RESTRICTED AREA</div>
      <h2 style="margin-bottom:10px">Private Space 🔐</h2>
      <p class="small" style="margin-bottom:20px;opacity:0.8">Enter the secret password to continue.</p>
      <input type="password" id="privAuthInput" class="input" placeholder="Password" onkeydown="if(event.key==='Enter') checkPrivAuth()">
      <div id="privAuthErr" style="color:var(--accent);display:none;margin-top:10px;font-size:0.9rem">Incorrect password.</div>
      <div style="display:flex;gap:10px;margin-top:20px">
        <button class="btn ghost" onclick="renderCalendar()">← BACK</button>
        <button class="btn secondary" onclick="checkPrivAuth()">ENTER</button>
      </div>
    </div>
  </div>
 `);
 window.scrollTo({top:0,behavior:"smooth"});
}

async function loadLyrics(){
 const el=document.getElementById("lyrics"); if(!el)return;
 try{el.textContent=await (await fetch("/lyrics.txt")).text();}catch{}
}

const oldOpenDay=openDay;
openDay=function(day){ oldOpenDay(day); setTimeout(()=>{loadLyrics(); if(day===6)buildQuiz();},0); };

function buildQuiz(){
 const box=document.getElementById("quiz"); if(!box)return;
 const qs=window.__quiz||[];
 let i=0;
 function show(){
  const [q,a]=qs[i];
  box.innerHTML=`<div class="kicker">QUESTION ${i+1}/${qs.length}</div><h3>${q}</h3><input class="input" id="quizAnswer" placeholder="Your answer..."><button class="btn primary" style="margin-top:10px" onclick="checkQuiz()">CHECK ❤️</button><div id="quizResult"></div>`;
 }
 window.checkQuiz=function(){
  const answer=document.getElementById("quizAnswer").value.trim();
  const target=qs[i][1];
  const ok=answer.toLowerCase().replace(/[^a-z0-9]/g,"").includes(target.toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,8));
  document.getElementById("quizResult").innerHTML=ok?`<div class="result">Of course you remember. ❤️</div>`:`<div class="result">Khushi… seriously? 😂 The answer was: <strong>${target}</strong></div>`;
  i=(i+1)%qs.length;
  setTimeout(show,1300);
 };
 show();
}

intro();

async function viewReplies() {
  app.innerHTML = layout(`<div class="center" style="min-height:50vh"><div class="heart" style="animation:pulse 1s infinite">♡</div><p>Checking for replies...</p></div>`);
  window.scrollTo({top:0,behavior:"smooth"});
  try {
    const res = await fetch("/api/replies");
    const replies = await res.json();
    if (!replies || replies.length === 0) {
      app.innerHTML = layout(
        `<header class="topbar"><div><div class="kicker">MESSAGES</div><h2 style="margin-bottom:0">Nitin's Replies</h2></div><button class="btn ghost" onclick="renderCalendar()">← BACK</button></header>` +
        `<div class="card center" style="margin-top:20px"><div class="heart">♡</div><h3>No replies yet.</h3><p class="small">When Nitin writes back, it will appear here.</p></div>`
      );
      return;
    }
    const html = replies.map(m => 
      `<div class="card" style="margin-bottom:15px">
        <p class="small" style="opacity:0.7">You wrote (Day ${m.day}):</p>
        <p style="white-space:pre-wrap;line-height:1.6;margin-bottom:15px">${m.message}</p>
        <div style="background:rgba(255,255,255,0.05);padding:15px;border-radius:8px;border-left:3px solid var(--accent)">
          <strong style="color:var(--accent)">Nitin replied:</strong>
          <p style="margin-top:8px;white-space:pre-wrap;line-height:1.6">${m.reply}</p>
        </div>
      </div>`
    ).join("");
    
    app.innerHTML = layout(
      `<header class="topbar"><div><div class="kicker">MESSAGES</div><h2 style="margin-bottom:0">Nitin's Replies</h2></div><button class="btn ghost" onclick="renderCalendar()">← BACK</button></header>` +
      `<div style="margin-top:20px">${html}</div>`
    );
  } catch(e) {
    app.innerHTML = layout(`<div class="card center">Error loading replies.</div>` + backButton());
  }
}

window.checkPrivAuth = function() {
  const p = document.getElementById("privAuthInput").value;
  if(p !== "Nishi@11/01") {
    document.getElementById("privAuthErr").style.display = "block";
    return;
  }
  app.innerHTML=layout(`<div class="dayhead"><div class="kicker">Private Space</div><h2>Write to Nitin 🔐</h2><p class="lead">This is always available, even after October.</p></div>${privateBox(0)}<div class="center" style="margin: 30px 0;"><button class="btn secondary" onclick="viewReplies()">💌 See Nitin's Replies</button></div>${backButton()}`);
  window.scrollTo({top:0,behavior:"smooth"});
};
