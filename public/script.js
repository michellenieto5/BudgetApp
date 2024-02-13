const categoryTotals = {
  income: 0,
  housing: 0,
  transportation: 0,
  food: 0,
  subscriptions: 0,
  debt: 0
};

function addIncome() {
    const incomeContainer = document.getElementById('incomeContainer');
    const incomeItem = document.createElement('div');
    incomeItem.className = 'incomeItem';
    incomeItem.innerHTML = `
      <input type="text" name="incomeSource[]" placeholder="Enter source of income" >
      <input type="number" name="incomeAmount[]" placeholder="$0.00" >
    `;
    incomeContainer.appendChild(incomeItem);
  }
function addExpense(category) {
    // Select the specific category container
    const categoryContainer = document.querySelector(`#${category}Container`);
  
    // Check if the categoryContainer is found
    if (categoryContainer) {
      // Create a new expenseItem
      const expenseItem = document.createElement('div');
      expenseItem.className = 'expenseItem';
  
      // Set the HTML content for the new expenseItem
      expenseItem.innerHTML = `
          <input type="text" name="${category}Name[]" placeholder="Enter item">
          <input type="number" name="${category}Amount[]" placeholder="$0.00" >
      `;
  
      // Append the new expenseItem to the categoryContainer
      categoryContainer.appendChild(expenseItem);
  
      // Update the total for the corresponding category
      addEachCategoryTotal(category);
    } else {
      console.error(`Category Container for ${category} not found`);
    }
  }
  

// Function to add each category total
function addEachCategoryTotal(category) {
    const categoryAmountInputs = document.getElementsByName(`${category}Amount[]`);
    let categoryTotalAmount = 0;
  
    categoryAmountInputs.forEach(input => {
      const amount = parseFloat(input.value) || 0; // Convert the input value to a number
      categoryTotalAmount += amount;
    });
  
    // Update the corresponding total amount element in the HTML
    const totalAmountElement = document.getElementById(`${category}TotalAmount`);
    if (totalAmountElement) {
      totalAmountElement.textContent = `$${categoryTotalAmount.toFixed(2)}`;
    }

    // Update the categoryTotals object
  categoryTotals[category.toLowerCase()] = categoryTotalAmount;

  // Call drawChart with the updated categoryTotals
  drawChart(categoryTotals);

    return categoryTotalAmount;
  }
  // Attach input event listener to a static parent element for income and expenses
document.getElementById('budgetForm').addEventListener('input', function (event) {
    const target = event.target;
  
    // Check if the target is an input field with the correct name pattern
    if (target.tagName === 'INPUT' && target.name && target.name.match(/Amount\[\]/)) {
      const category = target.name.replace(/Amount\[\]/, '').toLowerCase();
      console.log(`Input event triggered for category: ${category}`);
      // Update the total for the corresponding category
      addEachCategoryTotal(category);
    }
  });
  // Function to draw the Google Chart
function drawChart(categoryTotals) {
  // Load the Visualization API and the corechart package.
  google.charts.load('current', {'packages': ['corechart']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(function () {
    // Create the data table.
    var data = google.visualization.arrayToDataTable([
      ['Category', 'Amount'],
     // ['Income', categoryTotals.income],
      ['Housing', categoryTotals.housing],
      ['Transportation', categoryTotals.transportation],
      ['Food', categoryTotals.food],
      ['Subscriptions', categoryTotals.subscriptions],
      ['Debt', categoryTotals.debt]
    ]);

    // Set chart options
    var options = {
      title: 'Budget Analysis',
      pieHole: 0.0,
    };

    // Instantiate and draw the chart.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  });
}
  document.getElementById('budgetForm').addEventListener('submit', function (event) {
    event.preventDefault();
  
    // Create an object to store the relevant data
    const jsonData = {};
  
    // Get the total amounts for each category
    const categories = ['income', 'housing', 'transportation', 'food', 'subscriptions', 'debt'];
  
    categories.forEach(category => {
      jsonData[`${category}TotalAmount`] = addEachCategoryTotal(category);
    });
  
    // Log the data for testing (you can remove this line in production)
    console.log(jsonData);
  
    // Make the fetch request with the relevant data
    fetch('/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify(jsonData), // Convert the data to JSON
    })
    .then(response => response.text())
    .then(responseText => {
      console.log(responseText); // Log the server response
    })
    .catch(error => {
      console.error('Error sending data to server:', error);
    });
  });   
  document.getElementById('feedbackForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get the selected question and user question from the form
    const question = document.getElementById('question').value;
    const userQuestion = document.getElementById('userQuestion').value;

    // Create an object to store the form data
    const formData = { question, userQuestion };

    // Log the data for testing (you can remove this line in production)
    console.log(formData);

    // Make the fetch request with the form data
    fetch('/submit-feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify(formData), // Convert the data to JSON
    })
    .then(response => response.text())
    .then(responseText => {
        console.log(responseText); // Log the server response
        // Add any client-side logic you want after the form submission
    })
    .catch(error => {
        console.error('Error sending data to server:', error);
    });
});

  