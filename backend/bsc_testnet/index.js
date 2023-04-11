const Web3 = require('web3');
const { createClient } = require('@supabase/supabase-js');

const providerUrl = 'wss://spring-orbital-patron.bsc-testnet.discover.quiknode.pro/b77b8eda48751ce215a0c997946f4f8c82d37edc/';
const web3 = new Web3(new Web3.providers.WebsocketProvider(providerUrl));
const supabase = createClient(
    'https://ecozdwjnqcnxnyjfaxlm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjb3pkd2pucWNueG55amZheGxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTA0NDM0OCwiZXhwIjoxOTk2NjIwMzQ4fQ.4_Zc1tsRTnAcI2-Mi6LhiJKQXKsD1TCLw7xW0qQlMQE'
)

async function checkConfirmations(address, tx, callback) {
    try {
        // Get the current block number
        const currentBlockNumber = await web3.eth.getBlockNumber();
        currentBlockNumber = parseFloat(currentBlockNumber);
        tx.blockNumber = parseFloat(tx.blockNumber);

        // Calculate the number of confirmations
        const confirmations = currentBlockNumber - tx.blockNumber;

        if (confirmations >= 12) {
            console.log(`Transaction has ${confirmations} confirmations. Updating database as confirmed...`);

            // Update the transaction in the database as confirmed
            const { error } = await supabase
                .from('transactions')
                .update([
                    {
                        tx_hash: tx.hash,
                        from_address: tx.from,
                        to_address: tx.to,
                        value: tx.value,
                        confirmed: true,
                        confirmations: confirmations,
                    },
                ])
                .eq('address', address);

            if (error) {
                console.error(`Error updating transaction as confirmed in database: ${error.message}`);
            }

            callback();
        } else {
            console.log(`Transaction has ${confirmations} confirmations. Waiting for more confirmations...`);
            setTimeout(() => checkConfirmations(address, tx, callback), 3000); // Check again after 3 seconds
        }
    } catch (error) {
        console.error(`Error checking confirmations: ${error.message}`);
    }
}

async function watchAddress(address) {
    console.log(`Watching for incoming transactions to ${address}...`);

    const subscription = web3.eth.subscribe('pendingTransactions', async (error, txHash) => {
        if (error) {
            console.error(`Error subscribing to pendingTransactions: ${error.message}`);
            return;
        }

        try {
            const tx = await web3.eth.getTransaction(txHash);
            if (tx.to === address) {
                console.log(`Incoming transaction detected: ${tx.hash}`);
                console.log(`From: ${tx.from}`);
                console.log(`To: ${tx.to}`);
                console.log(`Value: ${web3.utils.fromWei(tx.value, 'ether')} BNB`);

                checkConfirmations(address, tx, () => {
                    // Unsubscribe from the 'pendingTransactions' event
                    subscription.unsubscribe((error, success) => {
                        if (error) {
                            console.error(`Error unsubscribing from pendingTransactions: ${error.message}`);
                            return;
                        }

                        console.log(`Successfully unsubscribed from pendingTransactions for address ${address}`);
                    });
                });
            }
        } catch (error) {
            console.error(`Error fetching transaction data: ${error.message}`);
        }
    });
}

// Supabase client setup

const channel = supabase
    .channel('table-db-changes')
    .on(
        'postgres_changes',
        {
            event: 'INSERT',
            schema: 'public',
            table: 'transactions',
        },
        (payload) => {
            watchAddress(payload.new.address);
        }
    )
    .subscribe()