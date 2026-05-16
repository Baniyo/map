const API_BASE = "https://api.baniyo.jp";
const POLL_INTERVAL_MS = 5000;

const COLORS = [
  "#e74c3c"
];

const FLOOR_MAP = {
  "1F":"map_1f","2F":"map_2f","3F":"map_3f","4F":"map_4f","5F":"map_5f"
};

let latestData = {};
let userColors = {};
let colorIndex = 0;
let selectedRoom = null;
let searchWord = "";

// 階切り替え
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  const label = document.getElementById("floor-label");
  if (label) label.textContent = id.replace("F", "階");
}

// SVGヘルパー
function getSvgDoc(floor) {
  const obj = document.getElementById(FLOOR_MAP[floor]);
  return obj ? obj.contentDocument : null;
}

function initSvg(objId, floor) {
  const obj = document.getElementById(objId);
  if (!obj) return;
  obj.addEventListener("load", () => {
    const svgDoc = obj.contentDocument;
    svgDoc.querySelectorAll("rect,path").forEach(el => {
      // 元の値を保存
      el.dataset.originalFill = el.style.fill;
      el.dataset.originalStroke = el.style.stroke;
      el.dataset.originalStrokeWidth = el.style.strokeWidth;
      el.style.cursor = "pointer";
      el.addEventListener("click", () => onRoomClick(floor, el.id, el));
    });
  });
}

// 全ハイライトリセット
function resetAllHighlights() {
  Object.entries(FLOOR_MAP).forEach(([floor, objId]) => {
    const obj = document.getElementById(objId);
    if (!obj || !obj.contentDocument) return;
    obj.contentDocument.querySelectorAll("rect,path").forEach(el => {
      if (el.dataset.originalFill !== undefined) {
        el.style.fill = el.dataset.originalFill;
        el.style.opacity = "1";
        el.style.stroke = el.dataset.originalStroke || "";
        el.style.strokeWidth = el.dataset.originalStrokeWidth || "";
      }
    });
  });
}

// 在室者のハイライトを適用
function applyUserHighlights(data) {
  Object.keys(data).forEach(uid => {
    if (!userColors[uid]) {
      userColors[uid] = COLORS[colorIndex % COLORS.length];
      colorIndex++;
    }
  });

  Object.entries(data).forEach(([uid, info]) => {
    const svgDoc = getSvgDoc(info.floor);
    if (!svgDoc) return;
    const el = svgDoc.getElementById(info.room_id);
    if (!el) return;
    el.style.fill = userColors[uid];
  });
}

// 選択中の部屋を強調
function applyRoomSelection() {
  if (!selectedRoom) return;
  const svgDoc = getSvgDoc(selectedRoom.floor);
  if (!svgDoc) return;
  const el = svgDoc.getElementById(selectedRoom.room_id);
  if (!el) return;
  el.style.fill = "red";
  el.style.stroke = "#aa0000";
  el.style.strokeWidth = "3";
}

// 部屋クリック時の処理
function onRoomClick(floor, roomId, el) {
  if (!roomId) return;

  if (selectedRoom && selectedRoom.floor === floor && selectedRoom.room_id === roomId) {
    selectedRoom = null;
    renderAll();
    showRoomPanel(null, []);
    return;
  }

  selectedRoom = { floor, room_id: roomId };
  renderAll();

  const label = el.getAttribute("inkscape:label") || roomId;
  const occupants = Object.values(latestData).filter(
    info => info.floor === floor && info.room_id === roomId
  );
  showRoomPanel(label, occupants);
}

// 部屋パネル表示
function showRoomPanel(roomLabel, occupants) {
  const panel = document.getElementById("room_panel");
  const title = document.getElementById("room_panel_title");
  const list  = document.getElementById("room_panel_list");
  if (!panel) return;

  if (!roomLabel) {
    panel.style.display = "none";
    return;
  }

  panel.style.display = "block";
  title.textContent = roomLabel;

  if (occupants.length === 0) {
    list.innerHTML = '<li style="color:#999;">在室者なし</li>';
  } else {
    list.innerHTML = occupants.map(info => {
      const uid = Object.keys(latestData).find(k => latestData[k] === info);
      const color = userColors[uid] ?? "#ccc";
      return `<li style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
        <span style="width:12px;height:12px;border-radius:2px;background:${color};display:inline-block;flex-shrink:0;"></span>
        <span>${info.name}</span>
      </li>`;
    }).join("");
  }
}

// 名前検索
function doSearch() {
  const input = document.getElementById("search_input");
  searchWord = input ? input.value.trim() : "";

  if (!searchWord) {
    selectedRoom = null;
    renderAll();
    showRoomPanel(null, []);
    return;
  }

  const match = Object.entries(latestData).find(
    ([, info]) => info.name.includes(searchWord)
  );

  if (!match) {
    showSearchResult(null);
    return;
  }

  const [uid, info] = match;
  showScreen(info.floor);
  selectedRoom = { floor: info.floor, room_id: info.room_id };
  renderAll();
  showRoomPanel(info.label, [info]);
  showSearchResult(info);
}

function showSearchResult(info) {
  const el = document.getElementById("search-result-msg");
  if (!el) return;
  if (!info) {
    el.textContent = "見つかりませんでした";
    el.style.color = "#e74c3c";
  } else {
    el.textContent = `${info.name} → ${info.floor} ${info.label}`;
    el.style.color = "#2ecc71";
  }
}

function clearSearch() {
  const input = document.getElementById("search_input");
  if (input) input.value = "";
  searchWord = "";
  selectedRoom = null;
  userColors = {};
  colorIndex = 0;
  const el = document.getElementById("search-result-msg");
  if (el) el.textContent = "";
  renderAll();
  showRoomPanel(null, []);
}

// 全体再描画
function renderAll() {
  resetAllHighlights();
  applyUserHighlights(latestData);
  applyRoomSelection();
}

// データ取得ループ
async function fetchAndRender() {
  let data;
  try {
    const res = await fetch(`${API_BASE}/locations`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (e) {
    console.warn("位置情報の取得に失敗:", e);
    return;
  }

  latestData = data;
  renderAll();

  if (selectedRoom) {
    const occupants = Object.values(latestData).filter(
      info => info.floor === selectedRoom.floor && info.room_id === selectedRoom.room_id
    );
    const svgDoc = getSvgDoc(selectedRoom.floor);
    const label = svgDoc
      ? (svgDoc.getElementById(selectedRoom.room_id)?.getAttribute("inkscape:label") || selectedRoom.room_id)
      : selectedRoom.room_id;
    showRoomPanel(label, occupants);
  }
}

// 起動
Object.entries(FLOOR_MAP).forEach(([floor, objId]) => initSvg(objId, floor));

window.addEventListener("load", () => {
  fetchAndRender();
  setInterval(fetchAndRender, POLL_INTERVAL_MS);
});