import React from 'react';
import { supabase } from '@/lib/supabaseClient';

// Page component
const Transaction = ({ transaction }) => {
    return (
        <div>
            <h1>Transaction Details</h1>
            {/* Render the transaction details */}
            <div>
                <p>ID: {transaction.id}</p>
                <p>Description: {transaction.description}</p>
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
            transaction: data,
        },
    };
}
