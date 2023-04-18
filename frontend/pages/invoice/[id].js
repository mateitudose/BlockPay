import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';



// Page component
const Invoice = ({ invoice }) => {
    const [countdown, setCountdown] = useState(0);

    function calculateCountdown(unixTime) {
        // Convert Unix timestamp to Date object
        const startDate = new Date(unixTime);

        // Add 30 minutes to start date
        const endDate = new Date(startDate.getTime() + 30 * 60000);

        // Calculate time difference between end date and current date
        const timeDiff = endDate.getTime() - Date.now();

        // Convert time difference to minutes and seconds
        const minutes = Math.floor(timeDiff / 60000);
        const seconds = Math.floor((timeDiff % 60000) / 1000);

        // Format countdown value
        const countdownValue = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        return countdownValue > 0 ? countdownValue : "0:00";
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newCountdown = calculateCountdown(invoice.created_at);
            setCountdown(newCountdown);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [invoice.created_at]);


    return (
        <div>
            <h1>Transaction Details</h1>
            {/* Render the transaction details */}
            <div>
                <p>ID: {invoice.id}</p>
                <p>Description: {invoice.description}</p>
                <p>{countdown}</p>
                {/* Add more fields as needed */}
            </div>
        </div>
    );
};

export default Invoice;

// Fetch data from Supabase database
export async function getServerSideProps({ params }) {
    const { id } = params;
    const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.log(error);
        return {
            notFound: true,
        };
    }

    return {
        props: {
            invoice: data,
        },
    };
}
