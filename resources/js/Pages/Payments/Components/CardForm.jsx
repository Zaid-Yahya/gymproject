import React, { useState } from 'react';

export default function CardForm({ data, setData, errors }) {
    const [focusedField, setFocusedField] = useState(null);
    
    return (
        <div className="card-form">
            <div className="form-row">
                <div className={`form-group ${focusedField === 'card_holder' ? 'focused' : ''} ${errors.card_holder ? 'has-error' : ''}`}>
                    <label htmlFor="card_holder">Cardholder Name</label>
                    <div className="input-wrapper">
                        <span className="input-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </span>
                        <input
                            type="text"
                            id="card_holder"
                            placeholder="John Doe"
                            value={data.card_holder}
                            onChange={(e) => setData('card_holder', e.target.value)}
                            onFocus={() => setFocusedField('card_holder')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </div>
                    {errors.card_holder && (
                        <p className="error-message">{errors.card_holder}</p>
                    )}
                </div>
            </div>
            
            <div className={`form-group ${focusedField === 'card_number' ? 'focused' : ''} ${errors.card_number ? 'has-error' : ''}`}>
                <label htmlFor="card_number">Card Number</label>
                <div className="input-wrapper card-number-input">
                    <span className="input-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                            <line x1="1" y1="10" x2="23" y2="10"></line>
                        </svg>
                    </span>
                    <input
                        type="text"
                        id="card_number"
                        placeholder="4242 4242 4242 4242"
                        value={data.card_number}
                        onChange={(e) => setData('card_number', e.target.value)}
                        onFocus={() => setFocusedField('card_number')}
                        onBlur={() => setFocusedField(null)}
                    />
                    <div className="card-icons">
                        <svg className="card-icon" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000" opacity=".07"/>
                            <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#FFF"/>
                            <path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z" fill="#9a0000"/>
                        </svg>
                    </div>
                </div>
                {errors.card_number && (
                    <p className="error-message">{errors.card_number}</p>
                )}
            </div>
            
            <div className="form-row">
                <div className={`form-group half ${focusedField === 'card_expiry' ? 'focused' : ''} ${errors.card_expiry ? 'has-error' : ''}`}>
                    <label htmlFor="card_expiry">Expiration Date</label>
                    <div className="input-wrapper">
                        <span className="input-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </span>
                        <input
                            type="text"
                            id="card_expiry"
                            placeholder="MM/YY"
                            value={data.card_expiry}
                            onChange={(e) => setData('card_expiry', e.target.value)}
                            onFocus={() => setFocusedField('card_expiry')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </div>
                    {errors.card_expiry && (
                        <p className="error-message">{errors.card_expiry}</p>
                    )}
                </div>
                
                <div className={`form-group half ${focusedField === 'card_cvc' ? 'focused' : ''} ${errors.card_cvc ? 'has-error' : ''}`}>
                    <label htmlFor="card_cvc">CVC</label>
                    <div className="input-wrapper">
                        <span className="input-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                        </span>
                        <input
                            type="text"
                            id="card_cvc"
                            placeholder="123"
                            value={data.card_cvc}
                            onChange={(e) => setData('card_cvc', e.target.value)}
                            onFocus={() => setFocusedField('card_cvc')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </div>
                    {errors.card_cvc && (
                        <p className="error-message">{errors.card_cvc}</p>
                    )}
                </div>
            </div>
            
            <style jsx>{`
                .card-form {
                    margin-bottom: 1rem;
                }
                
                .form-group {
                    margin-bottom: 1rem;
                    position: relative;
                    transition: all 0.3s ease;
                }
                
                .form-group.focused label {
                    color: #9a0000;
                    transform: translateY(-2px);
                }
                
                .form-group.has-error .input-wrapper {
                    border-color: #9a0000;
                    box-shadow: 0 0 0 1px rgba(154, 0, 0, 0.2);
                }
                
                .form-row {
                    display: flex;
                    gap: 1rem;
                }
                
                .form-group.half {
                    flex: 1;
                }
                
                label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #666;
                    margin-bottom: 0.25rem;
                    transition: all 0.2s ease;
                }
                
                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    border: 1px solid #ffe6e6;
                    border-radius: 8px;
                    background-color: #fffafa;
                    transition: all 0.2s ease;
                    overflow: hidden;
                    height: 42px;
                }
                
                .input-wrapper:hover {
                    border-color: #ffd6d6;
                }
                
                .form-group.focused .input-wrapper {
                    border-color: #9a0000;
                    box-shadow: 0 0 0 2px rgba(154, 0, 0, 0.15);
                    background-color: white;
                }
                
                .input-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 0.75rem;
                    color: #bb4b4b;
                }
                
                .input-icon svg {
                    width: 16px;
                    height: 16px;
                }
                
                .form-group.focused .input-icon {
                    color: #9a0000;
                }
                
                input {
                    width: 100%;
                    padding: 0.45rem 0.5rem 0.45rem 0;
                    border: none;
                    font-size: 0.9rem;
                    background: transparent;
                    color: #333;
                    transition: all 0.2s ease;
                    outline: none;
                }
                
                input:focus {
                    outline: none;
                }
                
                input::placeholder {
                    color: #bbb;
                }
                
                .card-number-input {
                    position: relative;
                }
                
                .card-icons {
                    position: absolute;
                    right: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    display: flex;
                }
                
                .card-icon {
                    width: 32px;
                    height: 20px;
                    transition: all 0.2s ease;
                    opacity: 0.7;
                }
                
                .form-group.focused .card-icon {
                    opacity: 1;
                }
                
                .error-message {
                    color: #9a0000;
                    font-size: 0.7rem;
                    margin: 0.35rem 0 0 0.5rem;
                    display: flex;
                    align-items: center;
                }
                
                .error-message:before {
                    content: "!";
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 14px;
                    height: 14px;
                    background: rgba(154, 0, 0, 0.15);
                    border-radius: 50%;
                    margin-right: 5px;
                    font-size: 10px;
                    font-weight: bold;
                    color: #9a0000;
                }
            `}</style>
        </div>
    );
} 