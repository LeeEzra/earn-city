import React, { useState, useRef, useEffect } from "react";
import "../sidebar.css"; // Import CSS

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);

    // Toggle sidebar visibility
    const toggleMenu = () => setIsOpen(!isOpen);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
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
            {/* Button to open sidebar */}
            <button className="menu-button" onClick={toggleMenu}>☰ Menu</button>

            {/* Backdrop (clicking it closes the sidebar) */}
            {isOpen && <div className="backdrop" onClick={() => setIsOpen(false)}></div>}

            {/* Sidebar */}
            <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
                <button className="close-btn" onClick={toggleMenu}>✖</button>
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;