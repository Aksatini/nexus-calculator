const weapons200 = {
  "WINCHESTER 22": 300000,
  "G3": 300000,
  "M60": 250000,
  "FAMAS MK2": 270000,
  "AK-47": 220000,
  "MTAR": 255000,
  "MICRO UZI": 180000,
  "MP5 MK2": 180000,
  "MAGNUM 357": 175000,
  "GLOCK RAJADA": 150000,
  "DESERT": 125000,
  "PT MK2": 100000,
  "HK P7M10": 80000,
  "SCARLIGHT": 300000,
  "MG": 230000,
  "MINI UZI": 120000,
  "THOMPSON": 200000,
  "APARAFAL": 250000,
  "M4A1": 300000,
  "DOZE": 250000,
  "TEC-9": 200000
};

const weaponSelect = document.getElementById("weapon");
const qtyInput = document.getElementById("quantity");
const budgetInput = document.getElementById("budget");
const budgetKkInput = document.getElementById("budgetKk");

const qtyField = document.getElementById("qtyField");
const moneyField = document.getElementById("moneyField");
const kkField = document.getElementById("kkField");

const resultEl = document.getElementById("result");
const unitEl = document.getElementById("unitInfo");
const extraEl = document.getElementById("extraInfo");

const btn = document.getElementById("btn");
const pills = document.getElementById("pills");
const modePills = document.getElementById("modePills");

function moneyBRL(v){
  return v.toLocaleString("pt-BR",{ style:"currency", currency:"BRL" });
}
function formatInt(v){
  return (Math.max(0, Math.floor(v))).toLocaleString("pt-BR");
}

Object.keys(weapons200).forEach((w) => {
  const perUnit = weapons200[w] / 200;
  const option = document.createElement("option");
  option.value = w;
  option.textContent = `${w} — ${moneyBRL(perUnit)} / munição`;
  weaponSelect.appendChild(option);
});

function syncPillChecked(container){
  const labels = container.querySelectorAll(".pill");
  labels.forEach(l => l.classList.remove("checked"));
  labels.forEach(l => {
    const input = l.querySelector("input");
    if(input && input.checked) l.classList.add("checked");
  });
}

function getDiscount(){
  return Number(document.querySelector('input[name="discount"]:checked')?.value || "0");
}
function getMode(){
  return document.querySelector('input[name="mode"]:checked')?.value || "qty";
}

function syncModeUI(){
  const mode = getMode();
  qtyField.style.display   = (mode === "qty")   ? "" : "none";
  moneyField.style.display = (mode === "money") ? "" : "none";
  kkField.style.display    = (mode === "kk")    ? "" : "none";
  syncPillChecked(modePills);
}

function calculate(){
  const weapon = weaponSelect.value;
  const discount = getDiscount();
  const base200 = weapons200[weapon] || 0;

  const perUnitBase = base200 / 200;
  const perUnitFinal = perUnitBase * (1 - discount);

  const mode = getMode();

  let total = 0;
  let qty = 0;

  if(mode === "qty"){
    qty = Math.max(1, parseInt(qtyInput.value || "1", 10));
    qtyInput.value = qty;
    total = perUnitFinal * qty;

    resultEl.innerHTML = `Total: <strong>${moneyBRL(total)}</strong>`;
    extraEl.textContent = `Quantidade: ${formatInt(qty)} munições`;
  }

  if(mode === "money"){
    const budget = Math.max(1, parseFloat(budgetInput.value || "1"));
    budgetInput.value = budget;

    qty = Math.floor(budget / perUnitFinal);
    total = qty * perUnitFinal;

    resultEl.innerHTML = `Com <strong>${moneyBRL(budget)}</strong>, dá pra comprar: <strong>${formatInt(qty)} munições</strong>`;
    extraEl.textContent = `Gasto estimado: ${moneyBRL(total)} (sobra ${moneyBRL(Math.max(0, budget - total))})`;
  }

  if(mode === "kk"){
    const kk = Math.max(1, parseFloat(budgetKkInput.value || "1"));
    budgetKkInput.value = kk;

    const budget = kk * 1_000_000;
    qty = Math.floor(budget / perUnitFinal);
    total = qty * perUnitFinal;

    resultEl.innerHTML = `Com <strong>${formatInt(kk)}kk</strong> (${moneyBRL(budget)}), dá pra comprar: <strong>${formatInt(qty)} munições</strong>`;
    extraEl.textContent = `Gasto estimado: ${moneyBRL(total)} (sobra ${moneyBRL(Math.max(0, budget - total))})`;
  }

  unitEl.textContent =
    `Preço por munição: ${moneyBRL(perUnitFinal)} ` +
    `(base 200: ${moneyBRL(base200)}${discount ? " com desconto" : ""})`;

  syncPillChecked(pills);
}

btn.addEventListener("click", calculate);
weaponSelect.addEventListener("change", calculate);

qtyInput.addEventListener("input", calculate);
budgetInput.addEventListener("input", calculate);
budgetKkInput.addEventListener("input", calculate);

pills.addEventListener("change", calculate);
modePills.addEventListener("change", () => { syncModeUI(); calculate(); });

syncPillChecked(pills);
syncModeUI();
calculate();
