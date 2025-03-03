import React, { useState, useRef, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import "../paymentcard.css";
import safaricomMpesa from '../images/icons/saf-mpesa.png';
import airtelMoney from '../images/icons/airtel-money.jpg';
import payPalIcon from '../images/icons/paypal.png';
import binanceIcon from '../images/icons/binance.png';
import yellowCardLogo from '../images/icons/Yellow Card Logo.svg';
import byBitLogo from '../images/icons/bybit.svg';

const Paymentcard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [tAmount, setTAmount] = useState(null)
    const paymentcardRef = useRef(null);
    const [errorT, setErrorT] = useState(null);
    const navigate = useNavigate();

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
    const handleDeposit = async (e) => {
        setErrorMessage('')
        try {
            const response = await fetch('/auth/make-deposits', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ tAmount }),
              });
              const text = await response.text();
              if(response.ok) {
                setErrorMessage(`Success: ${text}`);
              }
              else {
                setErrorMessage(`Error: ${text}`);
              }
              
        }
        catch (error) {

        }
    }
    const handleReset = () => {
        setPaymentMethod("");
    };
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
                    <div className="yellow-card-icon">
                        <img src={yellowCardLogo}></img>
                    </div>
                    <div className="by-bit-icon">
                        <img src={byBitLogo}></img>
                    </div>
                </div>
                {errorMessage && <p color='red' className="payment-card-error-text">{errorMessage}</p>}
                <div className="payment-card-desc-text">Your account requires activation before usage. We support Safaricom MPESA, Airtel Money, Binance, Paypal, Yellow Card and Bybit. A temporary hold of USD $12 will be placed on the Account and then refunded immediately. <br /><br /><strong>Select your activation method:</strong></div>
                <div className="select-body">
                    <select type="text" name='country' id='country' value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required>
                        <option value="" disabled>Select Your activation Option</option>
                        <option value="safaricom-mpesa">Safaricom MPESA</option>
                        <option value="airtel-money">Airtel Money</option>
                        <option value="binance">Binance</option>
                        <option value="paypal">PayPal</option>
                        <option value="yellow-card">Yellow Card</option>
                        <option value="Bybit">Bybit</option>
                    </select>
                </div>
                <div className="payment-method-content-body">
                    <div className={`selected ${paymentMethod === 'safaricom-mpesa'? 'mpesa' : paymentMethod === 'airtel-money' ? 'airtelmoney' : paymentMethod === 'binance' ? 'binance' : paymentMethod === 'paypal' ? 'paypal' : paymentMethod === 'yellow-card' ? 'yellowcard' : paymentMethod === 'Bybit' ? 'bybit' : 'none'}`}>
                    {paymentMethod === ''? null : <>
                        <p>Kindly make a deposit of $12(KES 1, 500) using the secretary's office {paymentMethod === 'safaricom-mpesa' ? <>MPESA Number
                            </> : paymentMethod === 'airtel-money' ? <>Artel Money Number</> : paymentMethod === 'binance' ? <>Binance Id</> : paymentMethod === 'paypal' ? <>Paypal id</> : paymentMethod === 'yellow-card' ? <>Not available</> : null }.
                            A temporary hold of the amount and then refunded after account activation. The payment method details are as in bellow:</p>
                            <ul>
                                <li>
                                    {paymentMethod === 'safaricom-mpesa' ? <><strong>Number: </strong><code>0729837343</code>
                                    </> : paymentMethod === 'airtel-money' ? <><strong>Artel Money Number: </strong><code>0103933199</code></> : paymentMethod === 'binance' ? <><strong>Binance Id: </strong>42478764</> : paymentMethod === 'paypal' ? <><strong>Paypal id: </strong>42478764</> : paymentMethod === 'yellow-card' ? <>Not available</> : paymentMethod === 'Bybit' ? <>Not available</> : null}
                                </li>
                            </ul>
                            <input type="number" placeholder="Enter Amount" value={tAmount}
          onChange={(e) => setTAmount(e.target.value)}></input> 
                            <button className="payment-confirmation-button" onClick={() => {handleDeposit()}}>Confirm And Finish</button></>}
                            
                    </div>
                </div>
                <button className='payment-card-close-button' onClick={() => {togglePaymentCard(); handleReset()}}>Go Back</button>
            </div>
        </div>
        </>
    );
};

export default Paymentcard;