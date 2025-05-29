import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import PaymentMethodCard from './Components/PaymentMethodCard';
import CardForm from './Components/CardForm';
import OrderSummary from './Components/OrderSummary';
import BackgroundAnimation from './Components/BackgroundAnimation';
import Navbar from '@/Components/Navbar';

export default function Process({ subscription, paymentMethods, auth }) {
    const [selectedMethod, setSelectedMethod] = useState('paypal');

    const { data, setData, post, processing, errors } = useForm({
        payment_method: 'paypal',
        card_number: '',
        card_expiry: '',
        card_cvc: '',
        card_holder: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payment.store', subscription.id));
    };

    const handlePaymentMethodChange = (methodId) => {
        setSelectedMethod(methodId);
        setData('payment_method', methodId);
    };

    return (
        <div className="payment-page">
            <Head title="Complete Payment" />
            
            {/* Background animation with lower z-index */}
            <div className="background-wrapper">
                <BackgroundAnimation />
            </div>

            {/* Navbar with higher z-index */}
            <div className="navbar-wrapper">
                <Navbar />
            </div>
                                    
            <div className="payment-container">
                <div className="payment-header">
                    <h2>Complete Payment</h2>
                    <p>Secure checkout for your subscription</p>
                </div>
                                    
                <div className="payment-content">
                    <div className="payment-methods">
                        <h3>Payment Method</h3>
                        <div className="methods-grid">
                            {paymentMethods.filter(method => method.id !== 'credit_card').map((method) => (
                                <PaymentMethodCard 
                                    key={method.id}
                                    method={method}
                                    selected={selectedMethod === method.id}
                                    onSelect={() => handlePaymentMethodChange(method.id)}
                                />
                            ))}
                        </div>
                        
                        <form onSubmit={handleSubmit} className="payment-form">
                            {selectedMethod === 'credit_card' && (
                                <CardForm 
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />
                            )}
                                    
                            {selectedMethod === 'paypal' && (
                                <div className="info-box paypal">
                                    <p>You will be redirected to PayPal to complete your payment.</p>
                                </div>
                            )}
                                    
                            {selectedMethod === 'bank_transfer' && (
                                <div className="info-box bank">
                                    <p>You'll receive bank transfer instructions after proceeding.</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="payment-button"
                            >
                                {processing ? 'Processing...' : `Pay $${subscription.price}`}
                            </button>
                        </form>
                    </div>
                    
                    <OrderSummary subscription={subscription} />
                </div>
                
                <div className="payment-footer">
                    <Link href={route('subscriptions.plans')} className="back-link">
                        Return to plans
                    </Link>
                    
                    <div className="secure-badge">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lock-icon">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <span>Secure Payment</span>
                    </div>
                </div>
                
                <div className="floating-elements">
                    <div className="floater card-floater"></div>
                    <div className="floater coin-floater"></div>
                    <div className="floater secure-floater"></div>
                </div>
                
                <div className="demo-notice">
                    <svg className="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p>This is a demo payment system. No real payments will be processed.</p>
                </div>
            </div>
            
            <style jsx>{`
                .payment-page {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    padding: 0;
                }
                
                .background-wrapper {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                }
                
                .navbar-wrapper {
                    position: relative;
                    z-index: 50;
                    width: 100%;
                }
                
                .payment-container {
                    width: 100%;
                    max-width: 900px;
                    margin: 2rem auto 2rem;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.3);
                    padding: 1.5rem;
                    position: relative;
                    z-index: 10;
                    border: 1px solid rgba(249, 115, 22, 0.2);
                    animation: fadeInUp 0.6s ease-out forwards;
                    margin-top: 7rem;
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .payment-header {
                    text-align: center;
                    margin-bottom: 1.5rem;
                }
                
                .payment-header h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #f97316;
                    margin: 0;
                    position: relative;
                    display: inline-block;
                }
                
                .payment-header h2:after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(to right, transparent, #f97316, transparent);
                }
                
                .payment-header p {
                    color: #666;
                    font-size: 0.9rem;
                    margin: 0.5rem 0 0;
                }
                
                .payment-content {
                    display: grid;
                    grid-template-columns: 1fr 300px;
                    gap: 1.5rem;
                }
                
                .payment-methods {
                    background: white;
                    border-radius: 8px;
                    padding: 1.75rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    border: 1px solid #ffece9;
                    animation: fadeIn 0.8s ease-out forwards;
                    animation-delay: 0.2s;
                    opacity: 0;
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                .payment-methods h3 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin: 0 0 1.25rem;
                    color: #f97316;
                    position: relative;
                    display: inline-block;
                }
                
                .payment-methods h3:after {
                    content: '';
                    position: absolute;
                    bottom: -6px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(to right, #f97316, transparent);
                }
                
                .methods-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }
                
                .payment-form {
                    margin-top: 1.5rem;
                }
                
                .info-box {
                    padding: 1rem 1.25rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                }
                
                .info-box:before {
                    content: "";
                    width: 24px;
                    height: 24px;
                    background-color: rgba(249, 115, 22, 0.1);
                    border-radius: 50%;
                    margin-right: 12px;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23f97316' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' y1='16' x2='12' y2='12'%3E%3C/line%3E%3Cline x1='12' y1='8' x2='12.01' y2='8'%3E%3C/line%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: center;
                    flex-shrink: 0;
                }
                
                .info-box.paypal {
                    background-color: #fff8f5;
                    border: 1px solid #ffede5;
                    color: #f97316;
                }
                
                .info-box.bank {
                    background-color: #fff8f5;
                    border: 1px solid #ffede5;
                    color: #f97316;
                }
                
                .payment-button {
                    width: 100%;
                    background: linear-gradient(45deg, #f97316, #fb923c);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 1rem;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 5px rgba(249, 115, 22, 0.3);
                    position: relative;
                    overflow: hidden;
                    margin-top: 0.5rem;
                }
                
                .payment-button:before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0.1),
                        rgba(255, 255, 255, 0.3),
                        rgba(255, 255, 255, 0.1)
                    );
                    transition: all 0.6s ease;
                }
                
                .payment-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(249, 115, 22, 0.4);
                    background: linear-gradient(45deg, #ea580c, #f97316);
                }
                
                .payment-button:hover:before {
                    left: 100%;
                }
                
                .payment-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                
                .payment-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 1.5rem;
                    padding-top: 1rem;
                    border-top: 1px solid #ffede5;
                    animation: fadeIn 0.8s ease-out forwards;
                    animation-delay: 0.4s;
                    opacity: 0;
                }
                
                .back-link {
                    color: #666;
                    font-size: 0.875rem;
                    text-decoration: none;
                    transition: color 0.2s;
                    display: flex;
                    align-items: center;
                }
                
                .back-link:before {
                    content: '←';
                    margin-right: 5px;
                    transition: transform 0.2s;
                }
                
                .back-link:hover {
                    color: #f97316;
                }
                
                .back-link:hover:before {
                    transform: translateX(-2px);
                }
                
                .secure-badge {
                    display: flex;
                    align-items: center;
                    color: #f97316;
                    font-size: 0.75rem;
                    font-weight: 500;
                }
                
                .lock-icon {
                    width: 14px;
                    height: 14px;
                    margin-right: 4px;
                }
                
                .floating-elements {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1;
                }
                
                .floater {
                    position: absolute;
                    border-radius: 50%;
                    opacity: 0.4;
                    animation-duration: 15s;
                    animation-iteration-count: infinite;
                    animation-timing-function: linear;
                }
                
                .card-floater {
                    width: 120px;
                    height: 120px;
                    background: rgba(249, 115, 22, 0.2);
                    top: 20%;
                    left: 15%;
                    animation-name: float1;
                }
                
                .coin-floater {
                    width: 80px;
                    height: 80px;
                    background: rgba(249, 115, 22, 0.15);
                    top: 60%;
                    right: 20%;
                    animation-name: float2;
                }
                
                .secure-floater {
                    width: 100px;
                    height: 100px;
                    background: rgba(249, 115, 22, 0.1);
                    bottom: 10%;
                    left: 30%;
                    animation-name: float3;
                }
                
                @keyframes float1 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(50px, 20px) rotate(90deg); }
                    50% { transform: translate(0, 40px) rotate(180deg); }
                    75% { transform: translate(-50px, 20px) rotate(270deg); }
                }
                
                @keyframes float2 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(-30px, 30px) rotate(-90deg); }
                    50% { transform: translate(0, 60px) rotate(-180deg); }
                    75% { transform: translate(30px, 30px) rotate(-270deg); }
                }
                
                @keyframes float3 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(40px, -40px) rotate(120deg); }
                    66% { transform: translate(-40px, -40px) rotate(240deg); }
                }
                
                .demo-notice {
                    position: absolute;
                    bottom: 0.75rem;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    align-items: center;
                    background: rgba(249, 115, 22, 0.05);
                    padding: 0.5rem 0.75rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    color: #666;
                    border: 1px solid rgba(249, 115, 22, 0.1);
                    z-index: 10;
                }
                
                .info-icon {
                    width: 14px;
                    height: 14px;
                    margin-right: 6px;
                    color: #f97316;
                }
                
                @media (max-width: 768px) {
                    .payment-container {
                        margin: 5rem auto 2rem;
                        padding: 1.25rem;
                    }
                    
                    .payment-content {
                        grid-template-columns: 1fr;
                    }
                    
                    .methods-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
} 