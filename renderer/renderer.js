const $ = (id) => document.getElementById(id);

function pad2(n){ return String(n).padStart(2, "0"); }

function createFlip(el, initialValue){
  el.innerHTML = `
    <div class="card">
      <div class="half upper"><span class="val">${initialValue}</span></div>
      <div class="half lower"><span class="val">${initialValue}</span></div>
    </div>
  `;
  el.dataset.value = initialValue;
}

function setDigit(el, v){
  if (el.dataset.value === v) return;
  el.querySelectorAll(".val").forEach(node => (node.textContent = v));
  el.dataset.value = v;
}

function updateDate(now){
  const fmt = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
  $("dateText").textContent = fmt.format(now);
}

const ids = ["h1","h2","m1","m2"];
for (const id of ids) createFlip($(id), "-");

function render(){
  const now = new Date();
  updateDate(now);

  const H = pad2(now.getHours());
  const M = pad2(now.getMinutes());

  setDigit($("h1"), H[0]);
  setDigit($("h2"), H[1]);
  setDigit($("m1"), M[0]);
  setDigit($("m2"), M[1]);
}

// 次の “分” ぴったりで更新（秒は見ない）
function schedule(){
  render();
  const now = new Date();
  const ms = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
  setTimeout(schedule, Math.max(250, ms));
}

schedule();