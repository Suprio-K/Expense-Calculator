let entries = JSON.parse(localStorage.getItem("entries")) || [];
let editId = null;
let currentFilter = "all";

const form = document.getElementById("entryForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const list = document.getElementById("entryList");

const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const balanceEl = document.getElementById("balance");

form.addEventListener("submit", handleSubmit);
document.getElementById("resetBtn").addEventListener("click", resetForm);

document.querySelectorAll("input[name='filter']").forEach(radio =>
  radio.addEventListener("change", (e) => {
    currentFilter = e.target.value;
    render();
  })
);

function handleSubmit(e) {
  e.preventDefault();

  const entry = {
    id: editId || Date.now(),
    description: descriptionInput.value,
    amount: Number(amountInput.value),
    type: typeInput.value
  };

  if (editId) {
    entries = entries.map(item => item.id === editId ? entry : item);
    editId = null;
  } else {
    entries.push(entry);
  }

  saveAndRender();
  resetForm();
}

function render() {
  list.innerHTML = "";

  const filteredEntries = currentFilter === "all"
    ? entries
    : entries.filter(e => e.type === currentFilter);

  filteredEntries.forEach(entry => {
    const li = document.createElement("li");
    li.className = entry.type;
    li.innerHTML = `
      ${entry.description} - ₹${entry.amount}
      <span class="actions">
        <button onclick="editEntry(${entry.id})">Edit</button>
        <button onclick="deleteEntry(${entry.id})">Delete</button>
      </span>
    `;
    list.appendChild(li);
  });

  updateSummary();
}

function updateSummary() {
  const income = entries
    .filter(e => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);

  const expense = entries
    .filter(e => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  totalIncomeEl.textContent = income;
  totalExpenseEl.textContent = expense;
  balanceEl.textContent = income - expense;
}

function editEntry(id) {
  const entry = entries.find(e => e.id === id);
  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;
  typeInput.value = entry.type;
  editId = id;
}

function deleteEntry(id) {
  entries = entries.filter(e => e.id !== id);
  saveAndRender();
}

function resetForm() {
  form.reset();
  editId = null;
}

function saveAndRender() {
  localStorage.setItem("entries", JSON.stringify(entries));
  render();
}

render();
