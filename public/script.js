document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('expense-form');
  const userFilter = document.getElementById('user-filter');
  let categoryChart = null;
  let userChart = null;

  // Initialize charts
  function initCharts() {
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    const userCtx = document.getElementById('userChart').getContext('2d');

    categoryChart = new Chart(categoryCtx, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });

    userChart = new Chart(userCtx, {
      type: 'bar',
      data: {
        labels: ['Gangadhara', 'Kruthika'],
        datasets: [{
          label: 'Total Expenses',
          data: [0, 0],
          backgroundColor: ['#36A2EB', '#FF6384']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Update charts with new data
  function updateCharts(expenses) {
    // Update category chart
    const categoryData = {};
    expenses.forEach(exp => {
      categoryData[exp.category] = (categoryData[exp.category] || 0) + parseFloat(exp.amount);
    });

    categoryChart.data.labels = Object.keys(categoryData);
    categoryChart.data.datasets[0].data = Object.values(categoryData);
    categoryChart.update();

    // Update user chart
    const userData = {
      'Gangadhara': 0,
      'Kruthika': 0
    };
    expenses.forEach(exp => {
      userData[exp.user] += parseFloat(exp.amount);
    });

    userChart.data.datasets[0].data = [userData['Gangadhara'], userData['Kruthika']];
    userChart.update();
  }

  // Update tables with filtered data
  function updateTables(expenses) {
    const gangadharaTable = document.querySelector('#gangadhara-table tbody');
    const kruthikaTable = document.querySelector('#kruthika-table tbody');
    const combinedTable = document.querySelector('#combined-table tbody');

    // Clear existing rows
    gangadharaTable.innerHTML = '';
    kruthikaTable.innerHTML = '';
    combinedTable.innerHTML = '';

    // Filter expenses based on user filter
    const filteredExpenses = userFilter.value === 'all' 
      ? expenses 
      : expenses.filter(exp => exp.user === userFilter.value);

    // Add rows to respective tables
    filteredExpenses.forEach(exp => {
      const row = `
        <tr>
          <td>${exp.date}</td>
          <td>${exp.description}</td>
          <td>${exp.category}</td>
          <td>${parseFloat(exp.amount).toFixed(2)}</td>
        </tr>
      `;

      if (exp.user === 'Gangadhara') {
        gangadharaTable.innerHTML += row;
      } else if (exp.user === 'Kruthika') {
        kruthikaTable.innerHTML += row;
      }

      // Add to combined table
      combinedTable.innerHTML += `
        <tr>
          <td>${exp.date}</td>
          <td>${exp.user}</td>
          <td>${exp.description}</td>
          <td>${exp.category}</td>
          <td>${parseFloat(exp.amount).toFixed(2)}</td>
        </tr>
      `;
    });
  }

  // Load and display expenses
  function loadExpenses() {
    fetch('/api/expenses')
      .then(res => res.json())
      .then(expenses => {
        updateTables(expenses);
        updateCharts(expenses);
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
    const category = document.getElementById('category').value;
    const user = document.getElementById('user').value;

    if (!date || !description || !amount || !category || !user) return;

    fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, description, amount, category, user })
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

  // Handle user filter change
  userFilter.addEventListener('change', loadExpenses);

  // Initialize charts and load initial data
  initCharts();
  loadExpenses();
}); 