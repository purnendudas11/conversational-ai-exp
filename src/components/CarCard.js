import React from 'react';
import './CarCard.css';

function CarCard({ car, onSelect, isBestValue, isAnalyzing }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDecimal = (value) => {
    return value.toFixed(2);
  };

  return (
    <div className={`car-card ${isBestValue ? 'best-value' : ''} ${isAnalyzing ? 'analyzing' : ''}`}>
      {isAnalyzing && (
        <div className="analyzing-overlay">
          <div className="analyzing-spinner"></div>
          <p className="analyzing-text">AI Analyzing...</p>
        </div>
      )}
      
      {isBestValue && <div className="best-value-badge">Best Value</div>}
      
      <div className="car-card-header">
        <h3>{car.car_name}</h3>
      </div>

      <div className="car-card-highlight">
        <p>{car.key_highlight}</p>
      </div>

      <div className="car-card-details">
        <div className="detail-item">
          <span className="detail-label">Monthly Payment</span>
          <span className="detail-value">{formatCurrency(car.monthly_payment_usd)}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Total Price</span>
          <span className="detail-value">{formatCurrency(car.total_price_usd)}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">APR</span>
          <span className="detail-value">{formatDecimal(car.apr_percent)}%</span>
        </div>

        {car.cashback_usd > 0 && (
          <div className="detail-item">
            <span className="detail-label">Cashback</span>
            <span className="detail-value cashback">{formatCurrency(car.cashback_usd)}</span>
          </div>
        )}

        {car.valid_from && car.valid_to && (
          <div className="detail-item">
            <span className="detail-label">Valid</span>
            <span className="detail-value">{car.valid_from}   to   {car.valid_to}</span>
          </div>
        )}
      </div>

      <button 
        className="select-button"
        onClick={() => onSelect(car)}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? 'AI Analyzing...' : 'Get AI Insights'}
      </button>
    </div>
  );
}

export default CarCard;
