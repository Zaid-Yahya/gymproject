import React from 'react';

export default function OrderSummary({ subscription }) {
    return (
        <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-content">
                <div className="summary-row">
                    <span className="label">Plan</span>
                    <span className="value">{subscription.plan_name}</span>
                </div>
                
                <div className="summary-row">
                    <span className="label">Period</span>
                    <span className="value">Monthly</span>
                </div>
                
                {subscription.discount && (
                    <>
                        <div className="summary-row original-price">
                            <span className="label">Original Price</span>
                            <span className="value">${subscription.original_price}</span>
                        </div>
                        
                        <div className="summary-row discount">
                            <span className="label">Discount</span>
                            <span className="value">-${(subscription.original_price - subscription.price).toFixed(2)}</span>
                        </div>
                    </>
                )}
                
                <div className="summary-row total">
                    <span className="label">Total</span>
                    <span className="value">${subscription.price}</span>
                </div>
            </div>
            
            <style jsx>{`
                .order-summary {
                    background: white;
                    border-radius: 8px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    border: 1px solid #ffece9;
                }
                
                h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0 0 1rem;
                    color: #ff7e67;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid #ffece9;
                }
                
                .summary-content {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.875rem;
                }
                
                .label {
                    color: #666;
                }
                
                .value {
                    font-weight: 500;
                    color: #333;
                }
                
                .original-price .value {
                    text-decoration: line-through;
                    color: #999;
                    font-weight: normal;
                }
                
                .discount {
                    color: #ff9e7d;
                }
                
                .discount .value {
                    color: #ff9e7d;
                }
                
                .total {
                    margin-top: 0.5rem;
                    padding-top: 0.75rem;
                    border-top: 1px solid #ffece9;
                    font-size: 1rem;
                }
                
                .total .label {
                    font-weight: 600;
                    color: #333;
                }
                
                .total .value {
                    font-weight: 600;
                    color: #ff7e67;
                }
            `}</style>
        </div>
    );
} 