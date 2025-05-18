import React, { useState, useEffect } from 'react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/transactions');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setExpenses(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching expenses:', err);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="features">
      <div className='feature'>
        <h1>Add Expense</h1>
        <AddExpenseForm setExpenses={setExpenses} expenses={expenses} />
      </div>
      <div className='feature'>
        <h1>Expenses</h1>
        {expenses.length === 0 ? (
          <p>No expenses found</p>
        ) : (
          <ul className='feature-list'>
            {expenses.map((expense) => (
              <li key={expense.id}>
                {expense.date} - {expense.description}: ${expense.amount} 
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className='feature'>
          <h1>Upcoming Expenses</h1>
      </div>
    </div>
  );
};

const AddExpenseForm = ({ setExpenses, expenses }) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [recurring, setRecurring] = useState('');

  const recurrenceOptions = [
    { value: '', label: 'No recurrence' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'bimonthly', label: 'Bi-monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'semiannually', label: 'Semi-annually' },
    { value: 'annually', label: 'Annually' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          category,
          subcategory,
          amount: parseFloat(amount),
          date,
          recurring: recurring || null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add expense');
      }

      const newExpense = await response.json();
      setExpenses([...expenses, newExpense]);
      
      // Clear form
      setDescription('');
      setCategory('');
      setSubcategory('');
      setAmount('');
      setDate('');
      setRecurring('');
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="subcategory">Subcategory:</label>
        <input
          type="text"
          id="subcategory"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          placeholder="Subcategory"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What did you spend money on?"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount ($):</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="recurring">Recurrence:</label>
        <select
          id="recurring"
          value={recurring}
          onChange={(e) => setRecurring(e.target.value)}
          className="form-input"
        >
          {recurrenceOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="submit-button">Add Expense</button>
    </form>
  );
};

export default Expenses; 
