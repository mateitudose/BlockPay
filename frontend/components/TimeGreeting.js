import React, { useState, useEffect } from 'react';

const TimeGreeting = () => {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();

        let timeGreeting = '';

        if (currentHour >= 5 && currentHour < 12) {
            timeGreeting = 'Good morning, ';
        } else if (currentHour >= 12 && currentHour < 18) {
            timeGreeting = 'Good afternoon, ';
        } else if (currentHour >= 18 && currentHour < 22) {
            timeGreeting = 'Good evening, ';
        } else {
            timeGreeting = 'Good night, ';
        }

        setGreeting(timeGreeting);
    }, []);

    return <p>{greeting}</p>;
};

export default TimeGreeting;
