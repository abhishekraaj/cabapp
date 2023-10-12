import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import style from "./Book.module.css";
import { option } from "./dummy";
import PaymentForm from "./PaymentModal";

const BookingForm = () => {
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [carType, setCarType] = useState("select");
  const [fare, setFare] = useState("");
  const { km } = useParams();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleConfirmBooking = () => {
    if (userName && phoneNumber && passengerCount > 0) {
      console.log(carType);

      if (carType === "Economy") {
        setFare(option[0].Fare * km);
      } else if (carType === "Premium") {
        setFare(option[1].Fare * km);
      } else if (carType === "Luxury") {
        setFare(option[3].Fare * km);
      }
      // Open the payment modal
      setIsPaymentModalOpen(true);
    }
  };

  return (
    <div className={style.booking_form}>
      <h3 className="booking-form">Booking Details</h3>
      <p>For {km} Km.</p>
      <select onChange={(e) => setCarType(e.target.value)}>
        <option value="select">Select Cab Type</option>
        {option.map((item) => {
          return (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          );
        })}
      </select>
      <input
        type="text"
        className="booking-form"
        placeholder="Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="text"
        className="booking-form"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <input
        type="number"
        className="booking-form"
        placeholder="Passenger Count"
        value={passengerCount}
        onChange={(e) => setPassengerCount(e.target.value)}
      />
      <button className="booking-form" onClick={handleConfirmBooking}>
        Confirm Booking
      </button>

      {/* modal payment */}
      <PaymentForm
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        fare={fare}
      />
    </div>
  );
};

export default BookingForm;
