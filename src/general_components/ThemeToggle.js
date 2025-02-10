import React, {useEffect, useState} from 'react';
import darkMode from '../images/icons/dark_mode.svg';
import lightMode from '../images/icons/light.svg';

const ThemeToggle = () => {
    const[theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const toggleTheme = () => {
        const newTheme = theme === 'light'? 'dark': 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
    
    return(
        <div className='theme-button' onClick={toggleTheme}>
            <img className='theme-icon' src={theme === 'light' ? darkMode : lightMode} alt={theme === 'light' ? 'dark' : 'light'}></img>
        </div>
    );
};

export default ThemeToggle;
