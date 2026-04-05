const form = document.querySelector(".js-substation-form");
const clearButton = document.querySelector(".js-clear-button");
const filterSelect = document.querySelector(".js-filter-state");
const messageDiv = document.getElementById("message");
const substationsList = document.querySelector(".js-substations-list");

document.addEventListener("DOMContentLoaded", loadSubstations);

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = collectDataInJson();
    await sendData(data);
});

clearButton.addEventListener("click", () => {
    form.reset();
});

filterSelect.addEventListener("change", loadSubstations);

function collectDataInJson() {
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
}

async function sendData(data) {
    try {
        const response = await fetch("/api/substations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            form.reset();
            loadSubstations();
        }
    } catch (error) {
        console.error(error);
    }
}

async function loadSubstations() {
    try {
        const response = await fetch("/api/substations");
        const substations = await response.json();
        const filterValue = filterSelect.value;
        const filtered = filterValue ? substations.filter(s => s.state === filterValue) : substations;
        displaySubstations(filtered);
    } catch (error) {
        console.error("Помилка завантаження:", error);
    }
}

function displaySubstations(substations) {
    if (substations.length === 0) {
        substationsList.innerHTML = "<p class=\"empty-message\">Немає зареєстрованих підстанцій</p>";
        return;
    }

    substationsList.innerHTML = substations.map(s => {
        const age = s.date ? (new Date().getFullYear() - parseInt(s.date)) : null;
        const ageText = age !== null ? `${age} р.` : "—";

        return `
        <div class="substation-card">
            <div class="card-title-row">
                <span class="card-name">${s.name}</span>
                <span class="state-badge state-${getBadgeClass(s.state)}">${s.state}</span>
            </div>
            <table class="card-table">
                <tr><td class="label">Тип</td><td>${s.type}</td></tr>
                <tr><td class="label">Адреса</td><td>${s.address}</td></tr>
                <tr><td class="label">Потужність</td><td>${s.power} МВА</td></tr>
                <tr><td class="label">Клас напруги</td><td>${s.voltage}</td></tr>
                <tr><td class="label">Трансформатори</td><td>${s.quantity} шт.</td></tr>
                <tr><td class="label">Рік введення</td><td>${s.date || "—"}${s.date ? ` <span class="age-text">(вік: ${ageText})</span>` : ""}</td></tr>
            </table>
            <button class="delete-button" onclick="deleteSubstation('${s.id}')">Видалити</button>
        </div>
        `;
    }).join("");
}

async function deleteSubstation(id) {
    if (!confirm("Ви впевнені, що хочете видалити цю підстанцію?")) return;

    try {
        const response = await fetch(`/api/substations/${id}`, { method: "DELETE" });
        const result = await response.json();

        if (result.success) {
            loadSubstations();
        }
    } catch (error) {
        console.error(error);
    }
}

function getBadgeClass(state) {
    const map = {
        "Робочий": "ok",
        "Потребує ремонту": "repair",
        "Аварійний": "emergency",
        "На технічному обслуговуванні": "maintenance"
    };
    return map[state] || "ok";
}
