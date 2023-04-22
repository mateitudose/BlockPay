import React, { useState, useEffect } from 'react';
import Badge from '@/components/Badge';

const Countdown = ({ unixTimestamp }) => {
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

    useEffect(() => {
        const targetTime = new Date(unixTimestamp).getTime() + 30 * 60 * 1000;
        const updateTimeLeft = () => {
            const currentTime = new Date().getTime();
            const diff = targetTime - currentTime;
            setTimeLeft(Math.floor(diff / 1000));
        };

        updateTimeLeft(); // Initial update
        const interval = setInterval(updateTimeLeft, 1000); // Update every second

        return () => {
            clearInterval(interval); // Clean up the interval on component unmount
        };
    }, [unixTimestamp]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div>
            <Badge color="gray" text={formatTime(timeLeft)} />
        </div>
    );
};

export default Countdown;
