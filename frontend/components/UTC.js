import React, { useState, useEffect } from 'react';

const UTC = ({ timestamp }) => {
    const [localDate, setLocalDate] = useState('');

    useEffect(() => {
        const date = new Date(timestamp);

        const timeFormatter = new Intl.DateTimeFormat('default', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        const dateFormatter = new Intl.DateTimeFormat('default', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        const formattedTime = timeFormatter.format(date);
        const formattedDate = dateFormatter.format(date);

        setLocalDate(`${formattedTime} - ${formattedDate}`);
    }, [timestamp]);

    return <span>{localDate}</span>;
};

export default UTC;
