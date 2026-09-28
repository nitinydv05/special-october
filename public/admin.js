const root=document.getElementById("adminApp");
let token=localStorage.getItem("nitinAdminToken")||"";
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function login(){
 root.innerHTML=`<div class="center" style="min-height:80vh"><div class="card" style="width:min(520px,100%)"><div class="kicker">PRIVATE ADMIN</div><h2>Nitin Inbox</h2><p class="small">Only Nitin should use this page.</p><input id="pw" type="password" class="input" placeholder="Admin password"><button class="btn primary" style="margin-top:12px" onclick="doLogin()">UNLOCK INBOX</button><div id="err"></div></div></div>`;
}
async function doLogin(){
 const pw=document.getElementById("pw").value;
 const r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pw})});
 if(!r.ok){document.getElementById("err").innerHTML=`<div class="result">Wrong password.</div>`;return}
 const j=await r.json();token=j.token;localStorage.setItem("nitinAdminToken",token);loadInbox();
}
async function loadInbox(){
 const r=await fetch("/api/admin/messages",{headers:{"x-admin-token":token}});
 if(r.status===401){localStorage.removeItem("nitinAdminToken");token="";return login();}
 const msgs=await r.json();
 root.innerHTML=`<div class="topbar"><div><div class="kicker">PRIVATE ADMIN</div><h2 style="margin-bottom:0">Nitin Inbox</h2></div><button class="btn ghost" onclick="logout()">LOG OUT</button></div>
 <div class="card"><strong>${msgs.filter(x=>!x.read).length}</strong> unread · ${msgs.length} total</div>
 <div style="margin-top:15px">${msgs.length?msgs.map(m=>`<article class="admin-msg ${m.read?"":"unread"}"><div style="display:flex;justify-content:space-between;gap:10px"><strong>Khushi</strong><span class="small">Day ${m.day||"—"} · ${new Date(m.createdAt).toLocaleString()}</span></div><p class="small">Mood: ${esc(m.mood||"—")}</p><p style="white-space:pre-wrap;line-height:1.7">${esc(m.message)}</p><div style="display:flex;gap:8px">${!m.read?`<button class="btn" onclick="markRead('${m.id}')">Mark read</button>`:""}<button class="btn" onclick="deleteMsg('${m.id}')">Delete</button></div></article>`).join(""):`<div class="card center"><div class="heart">♡</div><h3>No messages yet.</h3><p class="small">Khushi's private notes will appear here.</p></div>`}</div>`;
}
async function markRead(id){await fetch("/api/admin/messages/"+id+"/read",{method:"POST",headers:{"x-admin-token":token}});loadInbox();}
async function deleteMsg(id){if(!confirm("Delete this message?"))return;await fetch("/api/admin/messages/"+id,{method:"DELETE",headers:{"x-admin-token":token}});loadInbox();}
async function logout(){await fetch("/api/admin/logout",{method:"POST",headers:{"x-admin-token":token}});localStorage.removeItem("nitinAdminToken");token="";login();}
if(token)loadInbox();else login();
