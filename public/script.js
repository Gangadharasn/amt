document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('expense-form');
  const tableBody = document.querySelector('#expenses-table tbody');

  // Fetch and display expenses
  function loadExpenses() {
    fetch('/api/expenses')
      .then(res => res.json())
      .then(expenses => {
        tableBody.innerHTML = '';
        expenses.forEach(exp => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${exp.date}</td>
            <td>${exp.description}</td>
            <td>${parseFloat(exp.amount).toFixed(2)}</td>
          `;
          tableBody.appendChild(tr);
        });
      })
      .catch(error => {
        console.error('Error loading expenses:', error);
      });
  }

  // Handle form submit
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    if (!date || !description || !amount) return;
    fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, description, amount })
    })
    .then(res => res.json())
    .then(() => {
      form.reset();
      loadExpenses();
    })
    .catch(error => {
      console.error('Error saving expense:', error);
    });
  });

  loadExpenses();
}); 