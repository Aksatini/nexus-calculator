const PACK_SIZE = 200;
const SELLER_COMMISSION = 0.15;

const ITEMS = [
  { name: "G36", price: 300000 },
  { name: "MTAR", price: 140000 },
  { name: "M60", price: 450000 },
  { name: "WINCHESTER", price: 150000 },
  { name: "M4A1", price: 190000 },
  { name: "THOMPSON", price: 100000 },
  { name: "MP5 MK2", price: 110000 },
  { name: "PT MK2", price: 95000 },
  { name: "AK-74", price: 170000 },
  { name: "MICRO UZI", price: 115000 },
  { name: "DESERT", price: 40000 },
  { name: "SCAR LIGHT", price: 200000 },
  { name: "PARAFAL", price: 225000 },
  { name: "MINI SMG", price: 105000 },
  { name: "FAMAS MK2", price: 150000 },
  { name: "TEC-9", price: 100000 },
  { name: "HK P7M10", price: 27000 },
  { name: "MAGNUM", price: 27000 },
  { name: "GLOCK RAJADA", price: 65000 },
  { name: "MG", price: 125000 }
];

const DISCOUNTS = {
  none: 0,
  partner: 20,
  strong: 25
};

function formatBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function getUnitPrice(packPrice) {
  return packPrice / PACK_SIZE;
}

function getDiscountedPrice(value, discount) {
  return value * (1 - discount / 100);
}

function populateItems() {
  const itemSelect = document.getElementById("itemSelect");
  const priceTableBody = document.getElementById("priceTableBody");

  if (itemSelect) {
    itemSelect.innerHTML = "";

    ITEMS.forEach((item, index) => {
      const unitPrice = getUnitPrice(item.price);

      const option = document.createElement("option");
      option.value = index;
      option.textContent = `${item.name} — ${formatBRL(unitPrice)} por unidade`;
      itemSelect.appendChild(option);
    });
  }

  if (priceTableBody) {
    priceTableBody.innerHTML = "";

    ITEMS.forEach((item) => {
      const unitPrice = getUnitPrice(item.price);
      const partnerUnitPrice = getDiscountedPrice(unitPrice, DISCOUNTS.partner);
      const strongUnitPrice = getDiscountedPrice(unitPrice, DISCOUNTS.strong);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${formatBRL(unitPrice)}</td>
        <td>${formatBRL(partnerUnitPrice)}</td>
        <td>${formatBRL(strongUnitPrice)}</td>
      `;
      priceTableBody.appendChild(tr);
    });
  }
}

function calculateTotal() {
  const itemSelect = document.getElementById("itemSelect");
  const quantityInput = document.getElementById("quantityInput");
  const partnerType = document.getElementById("partnerType");

  if (!itemSelect || !quantityInput || !partnerType) return;

  const item = ITEMS[Number(itemSelect.value)];
  const units = Math.max(1, Number(quantityInput.value) || 1);
  const discount = DISCOUNTS[partnerType.value] || 0;

  const baseUnitPrice = getUnitPrice(item.price);
  const finalUnitPrice = getDiscountedPrice(baseUnitPrice, discount);
  const total = finalUnitPrice * units;
  const commission = total * SELLER_COMMISSION;

  document.getElementById("resultItem").textContent = item.name;
  document.getElementById("resultBase").textContent = formatBRL(baseUnitPrice);
  document.getElementById("resultQty").textContent = `${units} unidade(s)`;
  document.getElementById("resultDiscount").textContent = `${discount}%`;
  document.getElementById("resultCommission").textContent = formatBRL(commission);
  document.getElementById("resultTotal").textContent = formatBRL(total);
}

function clearResult() {
  const quantityInput = document.getElementById("quantityInput");
  const partnerType = document.getElementById("partnerType");
  const itemSelect = document.getElementById("itemSelect");

  if (quantityInput) quantityInput.value = 1;
  if (partnerType) partnerType.value = "none";
  if (itemSelect) itemSelect.value = "0";

  document.getElementById("resultItem").textContent = "—";
  document.getElementById("resultBase").textContent = "R$ 0,00";
  document.getElementById("resultQty").textContent = "0 unidade(s)";
  document.getElementById("resultDiscount").textContent = "0%";
  document.getElementById("resultCommission").textContent = "R$ 0,00";
  document.getElementById("resultTotal").textContent = "R$ 0,00";
}

document.addEventListener("DOMContentLoaded", () => {
  populateItems();

  const calculateBtn = document.getElementById("calculateBtn");
  const clearBtn = document.getElementById("clearBtn");

  if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateTotal);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", clearResult);
  }
});