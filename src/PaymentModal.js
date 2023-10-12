import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./PaymentForm.module.css"; // Import the CSS Module

Modal.setAppElement("#root"); // Make sure to set the root element for the modal

const PaymentForm = ({ isOpen, onClose, fare }) => {
  const [creditCard, setCreditCard] = useState("");

  const handlePayment = () => {
    // Implement your payment logic here, e.g., send payment details to a server.
    alert(`Payment of Rs ${fare} completed with credit card:`, creditCard);
    onClose(); // Close the modal
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Payment Modal"
      className={styles["payment_modal"]} // Apply the CSS Module class
      overlayClassName={styles["payment_overlay"]} // Apply the CSS Module class for the overlay
    >
      <div className={styles["payment_form"]}>
        <h3>Payment Details</h3>
        <p>Fare Amount: ₹ {fare}</p>
        <input
          type="text"
          className={styles["credit_card_input"]} // Apply the CSS Module class for the input
          placeholder="Credit Card Number"
          value={creditCard}
          onChange={(e) => setCreditCard(e.target.value)}
        />
        <button className={styles["pay_button"]} onClick={handlePayment}>
          Pay
        </button>
        <button className={styles["cancel_button"]} onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default PaymentForm;
