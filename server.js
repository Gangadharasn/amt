// ... existing code ...
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
// ... existing code ... 