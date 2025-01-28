const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Хранилище для состояния и логов
let testsAllowed = true; // Текущее состояние разрешения тестов
let logs = []; // Хранилище для логов

// Роут: Получение текущего состояния
app.get('/tests-allowed', (req, res) => {
    res.json({ testsAllowed });
});

// Роут: Изменение состояния (разрешены ли тесты)
app.post('/tests-allowed', (req, res) => {
    const { allowed } = req.body;
    if (typeof allowed !== 'boolean') {
        return res.status(400).json({ error: "Invalid value for 'allowed'. Must be true or false." });
    }
    testsAllowed = allowed;
    console.log(`Tests allowed state updated: ${testsAllowed}`);
    res.json({ message: 'Tests allowed state updated', testsAllowed });
});

// Роут: Получение логов
app.get('/logs', (req, res) => {
    res.json(logs);
});

// Роут: Прием логов от клиента
app.post('/logs', (req, res) => {
    const { type, result, message, timestamp } = req.body;

    if (!type || !timestamp) {
        return res.status(400).json({ error: 'Log must include type and timestamp.' });
    }

    logs.push({ type, result, message, timestamp });
    console.log(`Log received: ${type}, Result: ${result}, Message: ${message}`);
    res.json({ message: 'Log successfully recorded.' });
});

// Роут: Инициация теста пропускной способности
app.post('/initiate-bandwidth-test', (req, res) => {
    // В реальном случае здесь можно добавить логику отправки вебхука или сообщения клиенту
    console.log('Bandwidth test initiated.');
    res.json({ message: 'Bandwidth test initiated.' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
