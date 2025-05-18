import React, { useState, useEffect } from 'react';
import Header from "../components/Header";

const Savings = () => {
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/savings');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSavings(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching savings:', err);
      }
    };

    fetchSavings();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="features">
      <div className='feature'>
        <h1>Add Savings</h1>
        <AddSavingsForm setSavings={setSavings} savings={savings} />
      </div>
      <div className='feature'>
        <h1>Savings</h1>
        {savings.length === 0 ? (
          <p>No savings found</p>
        ) : (
          <ul className='feature-list'>
            {savings.map((saving) => (
              <li key={saving.id}>
                {saving.name} - ${saving.amount} 
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className='feature'>
        <h1>Savings Goals</h1>
      </div>
    </div>
  );
};

const AddSavingsForm = ({ setSavings, savings }) => {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [amount, setAmount] = useState('');

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
      const response = await fetch('http://localhost:5001/api/savings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          goal,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add savings');
      }

      const newSaving = await response.json();
      setSavings([...savings, newSaving]);
      
      // Clear form
      setName('');
      setGoal('');
      setAmount('');
    } catch (err) {
      console.error('Error adding savings:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount:</label>
        <input
          type="text"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="goal">Goal ($):</label>
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

export default Savings;
  