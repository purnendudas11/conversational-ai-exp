import React, { useState } from 'react';
import './Questionnaire.css';

function Questionnaire({ onSubmit }) {
  const [answers, setAnswers] = useState({
    budget: '',
    carType: '',
    brand: '',
    condition: '',
    fuel: ''
  });

  const handleChange = (field, value) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if all fields are filled
    if (!answers.budget || !answers.carType || !answers.brand || !answers.condition || !answers.fuel) {
      alert('Please answer all questions');
      return;
    }

    onSubmit(answers);
  };

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-card">
        <div className="questionnaire-header">
          <h1>Welcome to Car Advisor</h1>
          <p>Let's find your perfect car! Please answer a few quick questions.</p>
        </div>

        <form className="questionnaire-form" onSubmit={handleSubmit}>
          {/* Budget Question */}
          <div className="form-group">
            <label htmlFor="budget" className="form-label">
              1. What is your budget?
            </label>
            <input
              id="budget"
              type="text"
              placeholder="e.g., $20,000 - $30,000 or $25,000"
              value={answers.budget}
              onChange={(e) => handleChange('budget', e.target.value)}
              className="form-input"
            />
          </div>

          {/* Car Type Question */}
          <div className="form-group">
            <label htmlFor="carType" className="form-label">
              2. Are you looking for an SUV, sedan, or truck?
            </label>
            <select
              id="carType"
              value={answers.carType}
              onChange={(e) => handleChange('carType', e.target.value)}
              className="form-select"
            >
              <option value="">Select a car type</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Truck">Truck</option>
            </select>
          </div>

          {/* Brand Question */}
          <div className="form-group">
            <label htmlFor="brand" className="form-label">
              3. Do you have a preferred brand?
            </label>
            <input
              id="brand"
              type="text"
              placeholder="e.g., Toyota, Honda, Ford, or 'No preference'"
              value={answers.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
              className="form-input"
            />
          </div>

          {/* Condition Question */}
          <div className="form-group">
            <label htmlFor="condition" className="form-label">
              4. Do you want a new or used car?
            </label>
            <select
              id="condition"
              value={answers.condition}
              onChange={(e) => handleChange('condition', e.target.value)}
              className="form-select"
            >
              <option value="">Select a condition</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Either">Either</option>
            </select>
          </div>

          {/* Fuel Type Question */}
          <div className="form-group">
            <label htmlFor="fuel" className="form-label">
              5. Do you prefer gas, hybrid, or electric?
            </label>
            <select
              id="fuel"
              value={answers.fuel}
              onChange={(e) => handleChange('fuel', e.target.value)}
              className="form-select"
            >
              <option value="">Select a fuel type</option>
              <option value="Gas">Gas</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
              <option value="Any">Any</option>
            </select>
          </div>

          <button type="submit" className="submit-button">
            Get Car Recommendations
          </button>
        </form>
      </div>
    </div>
  );
}

export default Questionnaire;
