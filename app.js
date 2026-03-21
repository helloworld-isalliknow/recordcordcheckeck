// ===== 时间显示 =====
function updateTime() {
  const now = new Date();
  document.getElementById("time").innerText =
    now.toLocaleString();
}
setInterval(updateTime, 1000);
updateTime();

// ===== 数据存储 =====
let data = JSON.parse(localStorage.getItem("records")) || {};

// ===== 日期初始化 =====
const datePicker = document.getElementById("datePicker");
const today = new Date().toISOString().split("T")[0];
datePicker.value = today;

// ===== 渲染表格 =====
function renderTable() {
  const date = datePicker.value;
  const table = document.getElementById("recordTable");
  table.innerHTML = "";

  const records = data[date] || [];

  records.forEach(item => {
    const row = `<tr>
      <td>${item.type}</td>
      <td>${item.amount}</td>
    </tr>`;
    table.innerHTML += row;
  });
}

// ===== 按钮输入逻辑 =====
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.type;
    const input = prompt(`Enter amount for ${type}:`);

    if (!/^\d+$/.test(input)) {
      alert("Invalid input! Only numbers allowed.");
      return;
    }

    const date = datePicker.value;

    if (!data[date]) data[date] = [];

    data[date].push({
      type,
      amount: Number(input)
    });

    localStorage.setItem("records", JSON.stringify(data));
    renderTable();
  });
});

// ===== 日期切换 =====
datePicker.addEventListener("change", renderTable);

// ===== JSON导出 =====
document.getElementById("exportBtn").addEventListener("click", () => {
  const output = document.getElementById("output");
  output.textContent = JSON.stringify(data, null, 2);
});

// ===== 滑动切换页面 =====
let startX = 0;
let currentPage = 0;
const container = document.getElementById("container");

document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
  let endX = e.changedTouches[0].clientX;
  let diff = startX - endX;

  if (diff > 50) currentPage = 1;
  if (diff < -50) currentPage = 0;

  container.style.transform = `translateX(-${currentPage * 50}%)`;
});

// 初始化渲染
renderTable();
