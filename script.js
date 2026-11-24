/*
PROGRAM NAME: script.js
DESCRIPTION: Handles expense state, custom categories, validation, filtering, and rendering for Tracker Expense.
AUTHOR: Prudenciado, Rhona-Mae
DATE COMPILED: November 25, 2026
*/

let expenses = [
    { id: 1, title: "Siomai Rice", amount: 65.00, category: "Food", },
    { id: 2, title: "Gas Unleaded", amount: 250.00, category: "Transport", },
    { id: 3, title: "Spotify", amount: 89.00, category: "Subscription", },
    { id: 4, title: "Facial Wash", amount: 150.00, category: "Toiletries", },
];
let categories = ["Food", "Transport", "Subscription", "Toiletries",];
let selectedCategory = "";
let hiddenSummary = [];
let activeFilter = "All";

const el = (id) => document.getElementById(id);

const palette = [
    { dot: "bg-[#7ea172]", badge: "bg-[#e8efe5] text-[#274423]", },
    { dot: "bg-[#b07494]", badge: "bg-[#efe6ec] text-[#471c39]", },
    { dot: "bg-[#cfa46c]", badge: "bg-[#f4ece2] text-[#5a3818]", },
    { dot: "bg-[#6e9ca0]", badge: "bg-[#e5f0f1] text-[#23474a]", },
    { dot: "bg-[#c47a6a]", badge: "bg-[#f4e8e5] text-[#5e291f]", },
    { dot: "bg-[#9b85b3]", badge: "bg-[#ede8f2] text-[#3e2b52]", },
];

function calculateTotal(list) {
    return list.reduce((sum, item) => sum + item.amount, 0);
}

function formatHeaderDate(date) {
    const dayName = date.toLocaleDateString("en-US", { weekday: "short", });
    const month = date.toLocaleDateString("en-US", { month: "short", });
    return `${dayName} | ${month === "May" ? "May" : `${month}.`} ${date.getDate()}, ${date.getFullYear()}`;
}

function getUsedCategories() {
    const used = [];
    for (let i = 0; i < expenses.length; i++) {
        if (!used.includes(expenses[i].category)) used.push(expenses[i].category);
    }
    return used;
}

const formatCurrency = (val) =>
    `PHP ${val.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2, })}`;

const escapeHtml = (text) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
};

const getTheme = (cat) => palette[Math.max(0, categories.indexOf(cat)) % palette.length];
const pillClass = (active) =>
    `px-3.5 py-1 text-xs font-semibold rounded-full border transition cursor-pointer ${active ? "bg-crimson text-white border-crimson" : "bg-paper text-mahogany border-crimson/20 hover:border-crimson"}`;
const chevronSvg = (id, extra = "") =>
    `<svg id="${id}" class="w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${extra}" viewBox="0 0 20 20" fill="none"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const menuMarkup = (id, pos, items) =>
    `<div id="${id}" class="hidden absolute ${pos} z-20 bg-white border border-crimson/20 rounded-xl shadow-xl p-2"><ul class="max-h-48 overflow-y-auto flex flex-col gap-1">${items}</ul></div>`;
const optionMarkup = (label, dot, selected, attr, cls) =>
    `<li><button type="button" ${attr} class="${cls} w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2.5 transition cursor-pointer ${selected ? "bg-crimson text-white font-semibold" : "text-mahogany hover:bg-paper"}"><span class="w-2 h-2 rounded-full shrink-0 ${selected ? "bg-linen" : dot}"></span><span class="truncate">${escapeHtml(label)}</span></button></li>`;

function hideMenu(menuId, chevId) {
    const menu = el(menuId);
    const chev = el(chevId);
    if (menu !== null) menu.classList.add("hidden");
    if (chev !== null) chev.classList.remove("rotate-180");
}

function closeDropdowns() {
    hideMenu("category-menu", "category-chevron");
    hideMenu("filter-other-menu", "filter-other-chevron");
    hideMenu("summary-other-menu", "summary-other-chevron");
    el("category-trigger").setAttribute("aria-expanded", "false");
}

function toggleDropdown(menuId, chevId) {
    const isOpen = !el(menuId).classList.contains("hidden");
    closeDropdowns();
    if (!isOpen) {
        el(menuId).classList.remove("hidden");
        el(chevId).classList.add("rotate-180");
        if (menuId === "category-menu") el("category-trigger").setAttribute("aria-expanded", "true");
    }
    return !isOpen;
}

function showError(msg) {
    el("error-message").textContent = msg;
    el("error-message").classList.toggle("hidden", msg === "");
}

function renderCategoryDropdown() {
    const label = el("category-selected-text");
    label.textContent = selectedCategory === "" ? "Select a category..." : selectedCategory;
    label.className = selectedCategory === "" ? "text-mahogany/50 truncate" : "text-mahogany font-medium truncate";

    el("category-options").innerHTML = categories.length === 0
        ? `<li class="px-3 py-2.5 text-xs text-mahogany/55 text-center">No categories yet. Add one below.</li>`
        : categories.map((cat) => optionMarkup(cat, getTheme(cat).dot, cat === selectedCategory, `data-value="${escapeHtml(cat)}"`, "category-option")).join("");
}

function renderFilters(used) {
    const overflow = used.length > 3 ? used.slice(2) : [];
    if (activeFilter !== "All" && activeFilter !== "__OTHER__" && !used.includes(activeFilter)) activeFilter = "All";
    if (activeFilter === "__OTHER__" && overflow.length === 0) activeFilter = "All";

    const primary = used.length > 3 ? used.slice(0, 2) : used;
    let html = `<button type="button" data-category="All" class="filter-btn ${pillClass(activeFilter === "All")}">All</button>`;
    html += primary.map((cat) => `<button type="button" data-category="${escapeHtml(cat)}" class="filter-btn ${pillClass(activeFilter === cat)}">${escapeHtml(cat)}</button>`).join("");

    if (overflow.length > 0) {
        const otherActive = activeFilter === "__OTHER__" || overflow.includes(activeFilter);
        const btnText = overflow.includes(activeFilter) ? activeFilter : "Other";
        const items = optionMarkup("All Other", "bg-[#cfa46c]", activeFilter === "__OTHER__", `data-filter-option="__OTHER__"`, "filter-dropdown-option")
            + overflow.map((cat) => optionMarkup(cat, getTheme(cat).dot, activeFilter === cat, `data-filter-option="${escapeHtml(cat)}"`, "filter-dropdown-option")).join("");

        html += `<div id="filter-other-dropdown" class="relative"><button type="button" id="filter-other-trigger" class="${pillClass(otherActive)} inline-flex items-center gap-1.5"><span>${escapeHtml(btnText)}</span>${chevronSvg("filter-other-chevron")}</button>${menuMarkup("filter-other-menu", "right-0 top-[calc(100%+6px)] min-w-[190px]", items)}</div>`;
    }
    el("filter-group").innerHTML = html;
}

function renderSummary(displayed, used) {
    if (expenses.length === 0) {
        el("summary-legend-row").classList.add("hidden");
        el("customize-tray").classList.add("hidden");
        return;
    }
    el("summary-legend-row").classList.remove("hidden");

    const shown = used.filter((cat) => !hiddenSummary.includes(cat));
    const primary = shown.length > 3 ? shown.slice(0, 2) : shown;
    const overflow = shown.length > 3 ? shown.slice(2) : [];

    if (shown.length === 0) {
        el("summary-legend").innerHTML = `<span class="text-linen/60">No categories selected. Click Customize to choose.</span>`;
    } else {
        let html = primary.map((cat) => {
            const sub = calculateTotal(displayed.filter((i) => i.category === cat));
            return `<span class="inline-flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full ${getTheme(cat).dot}"></span><span>${escapeHtml(cat)}: <strong class="text-white">${formatCurrency(sub)}</strong></span></span>`;
        }).join("");

        if (overflow.length > 0) {
            const otherTotal = calculateTotal(displayed.filter((i) => overflow.includes(i.category)));
            const rows = overflow.map((cat) => {
                const sub = calculateTotal(displayed.filter((i) => i.category === cat));
                return `<li class="px-3 py-2 text-sm rounded-lg flex items-center justify-between gap-4 text-mahogany hover:bg-paper transition"><span class="inline-flex items-center gap-2.5 min-w-0"><span class="w-2 h-2 rounded-full shrink-0 ${getTheme(cat).dot}"></span><span class="truncate">${escapeHtml(cat)}</span></span><strong class="text-xs font-bold text-coffee tabular-nums shrink-0">${formatCurrency(sub)}</strong></li>`;
            }).join("");

            html += `<div id="summary-other-dropdown" class="relative"><button type="button" id="summary-other-trigger" class="inline-flex items-center gap-2 hover:text-white transition cursor-pointer"><span class="w-2.5 h-2.5 rounded-full bg-[#cfa46c]"></span><span>Other: <strong class="text-white">${formatCurrency(otherTotal)}</strong></span>${chevronSvg("summary-other-chevron", "text-linen/75")}</button>${menuMarkup("summary-other-menu", "left-0 top-[calc(100%+8px)] min-w-[230px]", rows)}</div>`;
        }
        el("summary-legend").innerHTML = html;
    }

    el("customize-options").innerHTML = used.map((cat) => {
        const active = !hiddenSummary.includes(cat);
        return `<button type="button" data-summary-cat="${escapeHtml(cat)}" class="px-3 py-1 text-xs font-medium rounded-full border transition cursor-pointer ${active ? "bg-crimson text-white border-crimson" : "bg-white/5 text-linen/75 border-linen/20 hover:border-linen/50"}">${escapeHtml(cat)}</button>`;
    }).join("");
}

function renderExpenses() {
    const used = getUsedCategories();
    renderFilters(used);

    const overflow = used.length > 3 ? used.slice(2) : [];
    const filtered = expenses.filter((expense) => {
        if (activeFilter === "All") return true;
        else if (activeFilter === "__OTHER__") return overflow.includes(expense.category);
        else return expense.category === activeFilter;
    });

    el("total-label").textContent = `Total (${activeFilter === "__OTHER__" ? "Other" : activeFilter})`;
    el("total-amount").textContent = formatCurrency(calculateTotal(filtered));
    el("expense-count").textContent = `${filtered.length} ${filtered.length === 1 ? "item" : "items"} shown`;
    renderSummary(filtered, used);

    el("expense-list").innerHTML = filtered.length === 0
        ? `<li class="flex-1 flex flex-col items-center justify-center text-center py-10 px-4 bg-paper border border-dashed border-crimson/20 rounded-lg text-sm text-mahogany/70"><strong class="text-mahogany mb-1">No expenses yet</strong><span>Add an expense on the left to start tracking.</span></li>`
        : filtered.map(({ id, title, amount, category }) =>
            `<li class="flex items-center justify-between gap-3 px-4 py-3 bg-paper hover:bg-white border border-crimson/10 hover:border-crimson/25 rounded-lg transition"><div class="flex items-center gap-3 min-w-0"><span class="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full shrink-0 ${getTheme(category).badge}">${escapeHtml(category)}</span><span class="text-sm font-semibold text-coffee truncate">${escapeHtml(title)}</span></div><div class="flex items-center gap-3 shrink-0"><span class="text-sm font-bold text-mahogany tabular-nums">${formatCurrency(amount)}</span><button type="button" data-id="${id}" class="delete-btn text-xs text-mahogany/60 hover:text-red-700 border border-crimson/15 hover:border-red-300 hover:bg-red-50 px-2.5 py-1 rounded-md transition cursor-pointer">Remove</button></div></li>`
        ).join("");
}

function addCategory() {
    const name = el("new-category-input").value.trim();
    if (name === "") return el("new-category-input").focus();

    const match = categories.find((c) => c.toLowerCase() === name.toLowerCase());
    if (match !== undefined) {
        selectedCategory = match;
    } else {
        categories = [...categories, name];
        selectedCategory = name;
    }
    el("new-category-input").value = "";
    renderCategoryDropdown();
    closeDropdowns();
}

el("category-trigger").addEventListener("click", () => {
    if (toggleDropdown("category-menu", "category-chevron") && categories.length === 0) el("new-category-input").focus();
});

el("category-options").addEventListener("click", (e) => {
    const btn = e.target.closest(".category-option");
    if (btn === null) return;
    selectedCategory = btn.dataset.value;
    renderCategoryDropdown();
    closeDropdowns();
});

el("add-category-btn").addEventListener("click", addCategory);
el("new-category-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); addCategory(); }
});

el("filter-group").addEventListener("click", (e) => {
    const pill = e.target.closest(".filter-btn");
    const otherTrigger = e.target.closest("#filter-other-trigger");
    const opt = e.target.closest(".filter-dropdown-option");

    if (pill !== null) {
        activeFilter = pill.dataset.category;
        renderExpenses();
    } else if (otherTrigger !== null) {
        toggleDropdown("filter-other-menu", "filter-other-chevron");
    } else if (opt !== null) {
        activeFilter = opt.dataset.filterOption;
        renderExpenses();
    }
});

el("summary-legend").addEventListener("click", (e) => {
    if (e.target.closest("#summary-other-trigger") !== null) toggleDropdown("summary-other-menu", "summary-other-chevron");
});

el("customize-btn").addEventListener("click", () => el("customize-tray").classList.toggle("hidden"));
el("customize-options").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-summary-cat]");
    if (chip === null) return;
    const cat = chip.dataset.summaryCat;
    hiddenSummary = hiddenSummary.includes(cat) ? hiddenSummary.filter((c) => c !== cat) : [...hiddenSummary, cat];
    renderExpenses();
});

el("expense-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = el("expense-title").value.trim();
    const rawAmount = el("expense-amount").value.trim();
    const amount = Number(rawAmount);

    if (title === "") {
        showError("Please enter an expense title.");
        return el("expense-title").focus();
    } else if (rawAmount === "" || Number.isNaN(amount) || amount <= 0) {
        showError("Please enter an amount greater than 0.");
        return el("expense-amount").focus();
    } else if (selectedCategory === "") {
        showError("Please add or select a category.");
        toggleDropdown("category-menu", "category-chevron");
        return el("new-category-input").focus();
    }

    showError("");
    expenses = [...expenses, { id: Date.now(), title, amount, category: selectedCategory, }];
    el("expense-title").value = "";
    el("expense-amount").value = "";
    selectedCategory = "";
    renderCategoryDropdown();
    el("expense-title").focus();
    renderExpenses();
});

el("expense-list").addEventListener("click", (e) => {
    const btn = e.target.closest(".delete-btn");
    if (btn === null) return;
    expenses = expenses.filter((item) => item.id !== Number(btn.dataset.id));
    renderExpenses();
});

document.addEventListener("click", (e) => {
    const inside = el("category-dropdown").contains(e.target) || e.target.closest("#filter-other-dropdown") !== null || e.target.closest("#summary-other-dropdown") !== null;
    if (!inside) closeDropdowns();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdowns();
});

el("today-date").textContent = formatHeaderDate(new Date());
renderCategoryDropdown();
renderExpenses();
