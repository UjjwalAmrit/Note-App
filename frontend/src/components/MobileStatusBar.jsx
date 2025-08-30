import { FaWifi, FaBatteryFull, FaSignal } from "react-icons/fa";

export function MobileStatusBar({ time = "9:41" }) {
  return (
    <div className="status-bar">
      <span className="time">{time}</span>
      <div className="status-icons">
        <FaSignal className="status-icon" />
        <FaWifi className="status-icon" />
        <FaBatteryFull className="status-icon" />
      </div>
    </div>
  );
}