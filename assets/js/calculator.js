const weapons200 = {
  "WINCHESTER 22": 300000, // Não encontrado na lista 1 (valor mantido)
  "G3": 300000,            // Não encontrado na lista 1 (valor mantido)
  "M60": 450000,           // Atualizado
  "FAMAS MK2": 150000,     // Atualizado
  "AK-47": 220000,         // Não encontrado (há AK-74 na lista 1, mantido 220k)
  "MTAR": 140000,          // Atualizado
  "MICRO UZI": 115000,     // Atualizado
  "MP5 MK2": 110000,       // Atualizado
  "MAGNUM 357": 175000,    // Valor original (Na lista 1 é apenas "MAGNUM")
  "GLOCK RAJADA": 65000,   // Atualizado
  "DESERT": 40000,         // Atualizado
  "PT MK2": 95000,         // Atualizado
  "HK P7M10": 27000,       // Atualizado
  "SCARLIGHT": 200000,     // Atualizado (referente a SCAR LIGHT)
  "MG": 125000,            // Atualizado
  "MINI UZI": 120000,      // Não encontrado (Na lista 1 é "MINI SMG")
  "THOMPSON": 100000,      // Atualizado
  "APARAFAL": 225000,      // Atualizado (referente a PARAFAL)
  "M4A1": 190000,          // Atualizado
  "DOZE": 250000,          // Não encontrado na lista 1
  "TEC-9": 100000          // Atualizado
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
