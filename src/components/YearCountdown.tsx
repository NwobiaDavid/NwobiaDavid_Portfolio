import { useEffect, useState } from 'react';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';

const YearCountdown = () => {
  const nextYear = new Date(new Date().getFullYear() + 1, 0, 1);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkTheme(); // initial
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const digitStyle = {
    background: isDarkMode ? 'white' : 'black',
    color: isDarkMode ? 'black' : 'white',
    fontSize: 20,
    width: 26,
    height: 35,
  };

  const labelStyle = {
    color: isDarkMode ? 'white' : 'black',
    fontSize: 0,
    // textTransform: 'uppercase',
  };

  const dividerStyle = {
    color: isDarkMode ? 'gray' : 'gray',
    fontSize: 14,
  };

  return (
    <div className="w-full flex justify-center items-center px-2 md:px-4">
      {/* Desktop countdown */}
      <div className="hidden md:block">
        <FlipClockCountdown
          to={nextYear.getTime()}
          labels={['DAYS', 'HOURS', 'MINUTES', 'SECONDS']}
          labelStyle={labelStyle}
          digitBlockStyle={digitStyle}
          dividerStyle={dividerStyle}
          showSeparators
        />
      </div>

      {/* Mobile quote */}
      <div className="block md:hidden font-bold text-center text-xs px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black">
        💡 “Stay curious.”
      </div>
    </div>
  );
};

export default YearCountdown;
