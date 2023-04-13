import React from 'react';
import { supabase } from '@/lib/supabaseClient';

const fetch = require('node-fetch');

const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd';


// Page component
const Transaction = ({ transaction }) => {
    function usdToBNB(usdAmount) {
        return fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const bnbPrice = data.binancecoin.usd;
                const bnbAmount = usdAmount / bnbPrice;
                return bnbAmount.toFixed(12);
            })
            .catch(error => console.error(error));
    }
    usdToBNB(transaction.price_in_usd)
        .then(bnbAmount => console.log(`$${transaction.price_in_usd} USD is equivalent to ` + bnbAmount + ' BNB'))
        .catch(error => console.error(error));
    return (
        <div>
            <title>Transaction Details</title>
            <h1>Transaction Details</h1>
            {/* Render the transaction details */}
            <div>
                <p>ID: {transaction.id}</p>
                <p>Description: {transaction.price_in_usd}</p>
                {/* Add more fields as needed */}
            </div>
        </div>
    );
};

export default Transaction;

// Fetch data from Supabase database
export async function getServerSideProps({ params }) {
    const { id } = params;
    const { data, error } = await supabase
        .from('checkout')
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
            transaction: data,
        },
    };
}
