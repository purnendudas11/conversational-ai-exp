import React from 'react';
import './DealDetails.css';

function DealDetails({ deal, onClose }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="deal-details-overlay">
      <div className="deal-details-modal">
        <div className="deal-header">
          <h2>Deal Details</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="deal-content">
          {deal.statusCode === 200 && JSON.parse(JSON.parse(deal.body).response) ? (
            (() => {
              const dealData = JSON.parse(JSON.parse(deal.body).response);
              return (
                <div>
                  <div className="deal-section">
                    <h3>Offer Summary</h3>
                    <p>{dealData.summary || 'Deal has been processed successfully.'}</p>
                  </div>

                  {dealData.offer_details && (
                    <div className="deal-section">
                      <h3>Offer Details</h3>
                      <div className="deal-grid">
                        {dealData.offer_details.monthly_payment && (
                          <div className="deal-item">
                            <span>Monthly Payment</span>
                            <span className="deal-value">
                              {formatCurrency(dealData.offer_details.monthly_payment)}
                            </span>
                          </div>
                        )}
                        {dealData.offer_details.total_price && (
                          <div className="deal-item">
                            <span>Total Price</span>
                            <span className="deal-value">
                              {formatCurrency(dealData.offer_details.total_price)}
                            </span>
                          </div>
                        )}
                        {dealData.offer_details.down_payment && (
                          <div className="deal-item">
                            <span>Down Payment</span>
                            <span className="deal-value">
                              {formatCurrency(dealData.offer_details.down_payment)}
                            </span>
                          </div>
                        )}
                        {dealData.offer_details.apr && (
                          <div className="deal-item">
                            <span>APR</span>
                            <span className="deal-value">{dealData.offer_details.apr}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {dealData.terms && (
                    <div className="deal-section">
                      <h3>Terms & Conditions</h3>
                      <p>{dealData.terms}</p>
                    </div>
                  )}

                  {dealData.next_steps && (
                    <div className="deal-section">
                      <h3>Next Steps</h3>
                      <p>{dealData.next_steps}</p>
                    </div>
                  )}

                  <button className="close-deal-button" onClick={onClose}>
                    Continue Shopping
                  </button>
                </div>
              );
            })()
          ) : (
            <div className="deal-success">
              <h3>✓ Deal Confirmed</h3>
              <p>Your deal has been successfully processed. A representative will contact you shortly.</p>
              <button className="close-deal-button" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DealDetails;
