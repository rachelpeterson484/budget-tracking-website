import React, { useState, useEffect } from 'react';
import Header from "../components/Header";

const Savings = () => {
  const [savingsAccounts, setSavingsAccounts] = useState([]);
  const [savingsTransactions, setSavingsTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formType, setFormType] = useState('savings');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch savings accounts
        const accountsResponse = await fetch('http://localhost:5001/api/savings');
        if (!accountsResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const accountsData = await accountsResponse.json();
        setSavingsAccounts(accountsData);

        // Fetch savings transactions
        const transactionsResponse = await fetch('http://localhost:5001/api/transactions');
        if (!transactionsResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const transactionsData = await transactionsResponse.json();
        // Filter transactions to only include those with savings accounts
        const savingsTransactions = transactionsData.filter(t => 
          t.category === t.subcategory && // This indicates it's a savings account
          t.transaction_type === 'income' // Only include income transactions
        );
        setSavingsTransactions(savingsTransactions);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="features">
      <div className='feature'>
        <div className="form-type-selector">
          <select 
            value={formType} 
            onChange={(e) => setFormType(e.target.value)}
            className="form-input"
          >
            <option value="savings">Create Savings Account</option>
            <option value="transaction">Add Savings Transaction</option>
          </select>
        </div>
        <h1>{formType === 'savings' ? 'Create Savings Account' : 'Add Savings Transaction'}</h1>
        {formType === 'savings' ? (
          <AddSavingsForm setSavings={setSavingsAccounts} savings={savingsAccounts} />
        ) : (
          <AddSavingsTransactionForm 
            setSavings={setSavingsTransactions} 
            savings={savingsTransactions}
            savingsAccounts={savingsAccounts}
          />
        )}
      </div>
      <div className='feature'>
        <h1>Savings Accounts</h1>
        {savingsAccounts.length === 0 ? (
          <p>No savings accounts found</p>
        ) : (
          <ul className='feature-list'>
            {savingsAccounts.map((saving) => (
              <li key={saving.id}>
                {saving.date} - {saving.name}: ${saving.amount} 
                {saving.goal && ` (Goal: $${saving.goal})`}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className='feature'>
        <h1>Savings Transactions</h1>
        {savingsTransactions.length === 0 ? (
          <p>No savings transactions found</p>
        ) : (
          <ul className='feature-list'>
            {savingsTransactions.map((transaction) => (
              <li key={transaction.id}>
                {transaction.date} - {transaction.description}: ${transaction.amount}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const AddSavingsForm = ({ setSavings, savings }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [goal, setGoal] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/savings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          amount: parseFloat(amount),
          goal: parseFloat(goal),
          date
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add savings');
      }

      const newSaving = await response.json();
      setSavings([...savings, newSaving]);
      
      // Clear form
      setName('');
      setAmount('');
      setGoal('');
      setDate('');
    } catch (err) {
      console.error('Error adding savings:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <div className="form-group">
        <label htmlFor="name">Account Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Account Name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Current Amount ($):</label>
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
        <label htmlFor="goal">Goal Amount ($):</label>
        <input
          type="number"
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />
      </div>

      <button type="submit" className="submit-button">Add Savings</button>
    </form>
  );
};

const AddSavingsTransactionForm = ({ setSavings, savings, savingsAccounts }) => {
  const [savingsAccount, setSavingsAccount] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [recurring, setRecurring] = useState('');
  const [transactionType, setTransactionType] = useState('income');

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
          category: savingsAccount,
          subcategory: savingsAccount,
          description,
          amount: parseFloat(amount),
          date,
          recurring: recurring || null,
          transaction_type: transactionType
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add savings transaction');
      }

      const newTransaction = await response.json();
      setSavings([...savings, newTransaction]);
      
      // Clear form
      setSavingsAccount('');
      setDescription('');
      setAmount('');
      setDate('');
      setRecurring('');
    } catch (err) {
      console.error('Error adding savings transaction:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <div className="form-group">
        <label htmlFor="savingsAccount">Savings Account:</label>
        <select
          id="savingsAccount"
          value={savingsAccount}
          onChange={(e) => setSavingsAccount(e.target.value)}
          className="form-input"
          required
        >
          <option value="">Select a savings account</option>
          {savingsAccounts.map(account => (
            <option key={account.id} value={account.name}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="transactionType">Transaction Type:</label>
        <select
          id="transactionType"
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          className="form-input"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this savings transaction for?"
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

      <button type="submit" className="submit-button">Add Transaction</button>
    </form>
  );
};

export default Savings;
  