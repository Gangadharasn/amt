const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'expenses.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

function readExpenses() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
  }
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

function writeExpenses(expenses) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2));
}

// Add a new expense
app.post('/api/expenses', (req, res) => {
  const { date, description, amount, category, user } = req.body;
  if (!date || !description || !amount || !category || !user) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const expenses = readExpenses();
  expenses.push({ date, description, amount, category, user });
  writeExpenses(expenses);
  res.json({ success: true });
});

// Delete an expense by index
app.delete('/api/expenses/:idx', (req, res) => {
  const idx = parseInt(req.params.idx, 10);
  let expenses = readExpenses();
  if (isNaN(idx) || idx < 0 || idx >= expenses.length) {
    return res.status(400).json({ error: 'Invalid index' });
  }
  expenses.splice(idx, 1);
  writeExpenses(expenses);
  res.json({ success: true });
});

// Get all expenses
app.get('/api/expenses', (req, res) => {
  const expenses = readExpenses();
  res.json(expenses);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 