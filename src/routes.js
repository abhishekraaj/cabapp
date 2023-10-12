import { Routes, Route } from "react-router-dom";
import App from "./App";
import BookingForm from "./Book";

export default function RoutesPath() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/book/:km" element={<BookingForm />} />
    </Routes>
  );
}
