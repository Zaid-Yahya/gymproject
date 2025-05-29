import React from 'react';

export default function PaymentMethodCard({ method, selected, onSelect }) {
    // Payment method icons
    const getMethodIcon = (methodId) => {
        switch(methodId) {
            case 'credit_card':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                );
            case 'paypal':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.554 9.488c.121.563.106 1.246-.04 2.051-.582 2.978-2.477 4.466-5.683 4.466h-.442a.666.666 0 0 0-.444.166.72.72 0 0 0-.239.427l-.041.189-.553 3.479-.021.151a.706.706 0 0 1-.247.426.666.666 0 0 1-.444.166H8.874a.395.395 0 0 1-.331-.15.457.457 0 0 1-.09-.363c.061-.373.148-.938.267-1.689.117-.75.206-1.314.267-1.689s.15-.938.268-1.685c.117-.748.207-1.31.27-1.685a.395.395 0 0 1 .15-.267.457.457 0 0 1 .271-.085h1.14c.354.019.66.033.916.044.255.012.51.018.766.018.255 0 .51-.01.766-.033.254-.02.51-.033.77-.033.69 0 1.247.08 1.673.241.427.161.742.373.946.635.204.263.347.572.427.928.08.355.121.743.121 1.164 0 .147-.006.293-.018.438a3.93 3.93 0 0 1-.061.428zm-5.39-6.202c.204.05.373.141.51.272.135.132.24.294.314.487.073.193.11.401.11.625 0 .147-.012.299-.033.459a3.088 3.088 0 0 1-.127.56c-.061.193-.15.37-.267.53a1.435 1.435 0 0 1-.428.41 1.494 1.494 0 0 1-.57.194c-.21.038-.441.056-.7.056-.146 0-.299-.006-.459-.017a2.9 2.9 0 0 1-.507-.073c.024-.146.051-.329.08-.55.03-.22.057-.43.081-.626.024-.196.054-.392.09-.586.036-.195.066-.353.09-.475.024-.121.054-.25.09-.384.036-.134.066-.235.09-.305a.388.388 0 0 1 .15-.257.455.455 0 0 1 .271-.085h.508c.158 0 .314.018.467.056zm-1.62 5.123c0-.085-.024-.155-.073-.21a.293.293 0 0 0-.193-.084h-.637a.444.444 0 0 0-.27.084.373.373 0 0 0-.15.232l-.238 1.513c.024 0 .06-.003.11-.01.048-.006.096-.01.144-.01h.33c.22 0 .4-.028.54-.084.142-.056.256-.131.343-.226a.95.95 0 0 0 .194-.338c.049-.134.073-.28.073-.437 0-.146-.024-.27-.073-.37a.652.652 0 0 0-.11-.16zm11.069-5.123c.207.05.376.141.51.272.133.132.237.294.31.487.074.193.11.401.11.625 0 .147-.01.299-.032.459a3.088 3.088 0 0 1-.127.56c-.062.193-.15.37-.268.53a1.435 1.435 0 0 1-.428.41 1.495 1.495 0 0 1-.57.194c-.207.038-.44.056-.699.056-.146 0-.299-.006-.459-.017a2.9 2.9 0 0 1-.507-.073c.024-.146.051-.329.08-.55.03-.22.057-.43.081-.626.024-.196.054-.392.09-.586.036-.195.066-.353.09-.475.024-.121.054-.25.09-.384.036-.134.066-.235.09-.305a.388.388 0 0 1 .15-.257.455.455 0 0 1 .271-.085h.508c.158 0 .314.018.467.056zM21.467 6.44c.354.196.664.47.928.823.265.354.466.76.604 1.22.14.458.21.94.21 1.446 0 .354-.03.72-.09 1.097-.06.378-.127.75-.2 1.116a7.55 7.55 0 0 1-.267 1.023 4.53 4.53 0 0 1-.338.863 2.7 2.7 0 0 1-.507.66 2.496 2.496 0 0 1-.699.463c-.28.122-.608.22-.98.295-.371.073-.8.11-1.288.11-.414 0-.813-.017-1.196-.05a15.86 15.86 0 0 1-1.132-.128 2.521 2.521 0 0 0-.77.217c-.237.11-.443.25-.618.42-.207.207-.371.443-.491.708-.122.265-.22.535-.295.812-.073.28-.134.56-.183.84-.05.28-.088.53-.117.754a.394.394 0 0 1-.15.266.455.455 0 0 1-.271.084H9.973a.395.395 0 0 1-.331-.15.456.456 0 0 1-.09-.362l1.542-9.772a.706.706 0 0 1 .247-.426.666.666 0 0 1 .444-.167h4.603c.195 0 .417.022.664.067.247.045.49.114.732.205z" />
                    </svg>
                );
            case 'bank_transfer':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                        <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                );
            default:
                return null;
        }
    };
    
    return (
        <div 
            className={`payment-method-card ${selected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            <div className="card-content">
                <div className="method-icon">
                    {getMethodIcon(method.id)}
                </div>
                
                <div className="method-info">
                    <div className="radio-container">
                        <input
                            type="radio"
                            name="payment_method"
                            checked={selected}
                            onChange={() => {}}
                            className="radio-input"
                        />
                        <span className="method-name">{method.name}</span>
                    </div>
                    <p className="method-description">{method.description}</p>
                </div>
            </div>
            
            <style jsx>{`
                .payment-method-card {
                    border: 1px solid #f0f0f0;
                    border-radius: 12px;
                    padding: 1.25rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: white;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.03);
                }
                
                .payment-method-card:hover {
                    border-color: #fdba74;
                    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.1);
                    transform: translateY(-2px);
                }
                
                .payment-method-card.selected {
                    border-color: #f97316;
                    background-color: #fff8f3;
                    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.15);
                }
                
                .payment-method-card.selected:after {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 0 40px 40px 0;
                    border-color: transparent #f97316 transparent transparent;
                    transition: all 0.3s ease;
                }
                
                .payment-method-card.selected:before {
                    content: '✓';
                    position: absolute;
                    top: 6px;
                    right: 8px;
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                    z-index: 1;
                }
                
                .card-content {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                
                .method-icon {
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    background-color: #fff8f3;
                    color: #f97316;
                    flex-shrink: 0;
                    transition: all 0.3s ease;
                }
                
                .payment-method-card.selected .method-icon {
                    background-color: #f97316;
                    color: white;
                    transform: scale(1.05);
                }
                
                .method-icon svg {
                    width: 24px;
                    height: 24px;
                    transition: all 0.3s ease;
                }
                
                .payment-method-card.selected .method-icon svg {
                    transform: scale(1.1);
                }
                
                .method-info {
                    flex: 1;
                }
                
                .radio-container {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.35rem;
                }
                
                .radio-input {
                    appearance: none;
                    -webkit-appearance: none;
                    width: 22px;
                    height: 22px;
                    border: 2px solid #e2e8f0;
                    border-radius: 50%;
                    margin-right: 0.75rem;
                    position: relative;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                    outline: none;
                    background-color: white;
                }
                
                .radio-input:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
                    border-color: #f97316;
                }
                
                /* Remove browser default styling */
                .radio-input::-ms-check {
                    display: none;
                }
                
                /* Override any browser default styles */
                .radio-input:-moz-focusring {
                    outline: none;
                }
                
                .radio-input:checked {
                    border-color: #f97316;
                    border-width: 2px;
                    background-color: white;
                }
                
                .radio-input:checked::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(1);
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: #f97316;
                    animation: pulseRadio 0.3s ease-out;
                }
                
                @keyframes pulseRadio {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 0;
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.2);
                        opacity: 0.7;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                }
                
                .method-name {
                    font-weight: 600;
                    color: #333;
                    font-size: 1.05rem;
                    transition: all 0.3s ease;
                }
                
                .method-description {
                    font-size: 0.85rem;
                    color: #666;
                    margin: 0;
                    line-height: 1.4;
                }
                
                .payment-method-card.selected .method-name {
                    color: #f97316;
                    transform: translateX(3px);
                }
            `}</style>
        </div>
    );
} 