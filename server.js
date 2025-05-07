const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'expenses.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read expenses
function readExpenses() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
  }
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

// Helper to write expenses
function writeExpenses(expenses) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2));
}

// Get all expenses
app.get('/api/expenses', (req, res) => {
  const expenses = readExpenses();
  res.json(expenses);
});

// Add a new expense
app.post('/api/expenses', (req, res) => {
  const { date, description, amount } = req.body;
  if (!date || !description || !amount) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const expenses = readExpenses();
  expenses.push({ date, description, amount });
  writeExpenses(expenses);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 