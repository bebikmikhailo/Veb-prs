const express = require("express");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const SUBSTATIONS_DATA_PATH = path.join(__dirname, "data", "substations.json");

function getData() {
    try {
        if (!fs.existsSync(SUBSTATIONS_DATA_PATH)) {
            return [];
        }
        return JSON.parse(fs.readFileSync(SUBSTATIONS_DATA_PATH, "utf-8"));
    } catch (error) {
        console.error(error);
        return [];
    }
}

function saveData(data) {
    try {
        const dir = path.dirname(SUBSTATIONS_DATA_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(SUBSTATIONS_DATA_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/substations", (req, res) => {
    const substations = getData();
    res.json(substations);
});

app.post("/api/substations", (req, res) => {
    try {
        const year = parseInt(req.body.date);
        if (req.body.date && (year < 1950 || year > 2025)) {
            return res.status(400).json({ success: false, message: "Рік введення має бути між 1950 та 2025" });
        }

        const newSubstation = {
            id: Date.now().toString(),
            name: req.body.name,
            type: req.body.type,
            address: req.body.address,
            power: req.body.power,
            voltage: req.body.voltage,
            quantity: req.body.quantity,
            date: req.body.date,
            state: req.body.state,
            registrationDate: new Date().toISOString()
        };

        const substations = getData();
        substations.push(newSubstation);

        if (saveData(substations)) {
            res.status(201).json({ success: true, message: "Підстанцію успішно зареєстровано", data: newSubstation });
        } else {
            throw new Error("Помилка запису даних");
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Помилка реєстрації підстанції", error: error.message });
    }
});

app.delete("/api/substations/:id", (req, res) => {
    try {
        const substations = getData();
        const filtered = substations.filter(s => s.id !== req.params.id);

        if (saveData(filtered)) {
            res.json({ success: true, message: "Підстанцію видалено" });
        } else {
            throw new Error("Помилка запису даних");
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Помилка видалення підстанції" });
    }
});

app.listen(PORT, () => console.log(`Сервер запущено`));