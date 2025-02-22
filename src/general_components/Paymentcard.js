import React, { useState, useRef, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import "../paymentcard.css";
import safaricomMpesa from '../images/icons/saf-mpesa.png';
import airtelMoney from '../images/icons/airtel-money.jpg';
import payPalIcon from '../images/icons/paypal.png';
import binanceIcon from '../images/icons/binance.png';

const Paymentcard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const paymentcardRef = useRef(null);
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [loading, setLoading] = useState(true);

    // Toggle sidebar visibility
    const togglePaymentCard = () => setIsOpen(!isOpen);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (paymentcardRef.current && !paymentcardRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <>
        <div className="payment-card-container">
            <button className='account-status-activate-button' onClick={togglePaymentCard}>Activate</button>
            {isOpen && <div className="backdrop-payment-card" onClick={() => setIsOpen(false)}></div>}
            <div ref={paymentcardRef} className={`payment-card ${isOpen ? "open" : ""}`}>
                <div className="payment-icons-container">
                    <div className="safaricom-mpesa-icon">
                        <img src={safaricomMpesa}></img>
                    </div>
                    <div className="airtel-money-icon">
                        <img src={airtelMoney}></img>
                    </div>
                    <div className="binance-icon">
                        <img src={binanceIcon}></img>
                    </div>
                    <div className="paypal-icon">
                        <img src={payPalIcon}></img>
                    </div>
                </div>
                <div>
                    <p>Your account requires activation before usage. We support Safaricom MPESA, Airtel Money, Binance and Paypal.</p><hr color="blue"/>
                    <p>Select your activation method:</p>
                    <select type="text" name='country' id='country' value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required>
                        <option value="" disabled selected>Select Your activation Option</option>
                        <option value="safaricom-mpesa">Safaricom MPESA</option>
                        <option value="airtel-money">Airtel Money</option>
                        <option value="binance">Binance</option>
                        <option value="paypal">PayPal</option>
                    </select>
                </div>
                <button className='payment-card-close-button' onClick={togglePaymentCard}>Go Back</button>
            </div>
        </div>
        </>
    );
};

export default Paymentcard;