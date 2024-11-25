import React from "react";
import "./LoadingModal.css"; // Optional: Add custom styles if needed
import { useThemeContext } from "../contexts/ThemeContext";

const LoadingModal = ({ isOpen, message = "Loading..." }) => {

    const { darkMode } = useThemeContext();
    if (!isOpen) return null;

    const style = {
        borderTopColor: darkMode ? '#d392d6' : '#a113ab',
    };

    return (
        <div className="loading-modal-overlay">
        <div className="loading-modal" style={{background: darkMode ? '#121212' : '#fff',}}>
            <div className="spinner" style={{ borderTop: `4px solid ${style.borderTopColor}` }}></div>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default LoadingModal;
