const Web3 = require('web3');
const { createClient } = require('@supabase/supabase-js');
const { Wallet } = require('ethers');

const providerUrl = 'wss://spring-orbital-patron.bsc-testnet.discover.quiknode.pro/b77b8eda48751ce215a0c997946f4f8c82d37edc/';
const web3 = new Web3(new Web3.providers.WebsocketProvider(providerUrl));
const supabase = createClient(
    'https://ecozdwjnqcnxnyjfaxlm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjb3pkd2pucWNueG55amZheGxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTA0NDM0OCwiZXhwIjoxOTk2NjIwMzQ4fQ.4_Zc1tsRTnAcI2-Mi6LhiJKQXKsD1TCLw7xW0qQlMQE'
)


async function sendTransaction(destinationAddress, senderPrivateKey, value) {
    try {
        const senderAddress = web3.eth.accounts.privateKeyToAccount(senderPrivateKey).address;

        // Check if the destination address is valid
        if (!web3.utils.isAddress(destinationAddress)) {
            throw new Error('Invalid destination address');
        }

        // Set the transaction details
        const gasPrice = await web3.eth.getGasPrice();

        const tx = {
            from: senderAddress,
            to: destinationAddress,
            value: web3.utils.toWei(value, 'ether'),
            gasPrice: gasPrice,
        };

        // Estimate the gas required for the transaction
        const estimatedGas = await web3.eth.estimateGas(tx);
        console.log('Estimated gas:', estimatedGas);
        tx.gas = estimatedGas;
        tx.value -= (gasPrice * estimatedGas);

        // Sign the transaction
        const signedTx = await web3.eth.accounts.signTransaction(tx, senderPrivateKey);

        // Send the transaction
        const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log('Transaction hash:', txReceipt.transactionHash);

    } catch (error) {
        console.error('Error sending transaction:', error.message);
    }
}

async function checkConfirmations(address, tx, callback) {
    try {
        // Get the current block number
        let currentBlockNumber = await web3.eth.getBlockNumber();
        currentBlockNumber = parseFloat(currentBlockNumber);
        tx.blockNumber = parseFloat(tx.blockNumber);
        console.log(tx);

        // Calculate the number of confirmations
        let confirmations = currentBlockNumber - tx.blockNumber;


        if (confirmations >= 12) {
            console.log(`Transaction has ${confirmations} confirmations. Updating database as confirmed...`);

            // Update the transaction in the database as confirmed
            const { error } = await supabase
                .from('invoices')
                .update([
                    {
                        tx_hash: tx.hash,
                        value_received: tx.value,
                        confirmed: true,
                        confirmations: confirmations,
                    },
                ])
                .eq('address', address);

            if (error) {
                console.log(`Error updating transaction as confirmed in database: ${error.message}`);
            }

            callback();
        } else {
            console.log(`Transaction has ${confirmations} confirmations. Waiting for more confirmations...`);
            setTimeout(() => checkConfirmations(address, tx, callback), 3000); // Check again after 3 seconds
        }
    } catch (error) {
        console.log(`Error checking confirmations: ${error.message}`);
    }
}

async function watchAddress(address, merchantAddress, valueToSend) {
    console.log(`Watching for incoming transactions to ${address}...`);

    const subscription = web3.eth.subscribe('pendingTransactions', async (error, txHash) => {
        if (error) {
            console.log(`Error subscribing to pendingTransactions: ${error.message}`);
            return;
        }

        try {
            const tx = await web3.eth.getTransaction(txHash);
            if (tx.to === address) {
                console.log(`Incoming transaction detected: ${tx.hash}`);
                console.log(`From: ${tx.from}`);
                console.log(`To: ${tx.to}`);
                console.log(`Value: ${web3.utils.fromWei(tx.value, 'ether')} BNB`);

                // Send the transaction and listen to the "confirmation" event
                web3.eth.sendSignedTransaction(tx.rawTransaction)
                    .on('confirmation', async (confirmationNumber, receipt) => {
                        console.log(`Transaction has ${confirmationNumber} confirmations`);

                        if (confirmationNumber >= 12) {
                            // Update the transaction in the database as confirmed
                            const { error } = await supabase
                                .from('invoices')
                                .update([
                                    {
                                        tx_hash: tx.hash,
                                        value_received: tx.value,
                                        confirmed: true,
                                        confirmations: confirmationNumber,
                                    },
                                ])
                                .eq('address', address);

                            if (error) {
                                console.log(`Error updating transaction as confirmed in database: ${error.message}`);
                            }

                            // Unsubscribe from the 'pendingTransactions' event
                            subscription.unsubscribe((error, success) => {
                                if (error) {
                                    console.log(`Error unsubscribing from pendingTransactions: ${error.message}`);
                                    return;
                                }

                                console.log(`Successfully unsubscribed from pendingTransactions for address ${address}`);
                            });

                            // Retrieve private key from the 'eth_keys' table
                            const { data, error } = await supabase
                                .from('eth_keys')
                                .select('privateKey')
                                .eq('address', address);

                            if (error) {
                                console.error(`Error retrieving private key from database: ${error.message}`);
                                return;
                            }

                            if (!data || data.length === 0) {
                                console.error('No private key found for the given address');
                                return;
                            }

                            const privateKey = data[0].privateKey;

                            await sendTransaction(merchantAddress, privateKey, valueToSend);

                            console.log(`Successfully sent ${valueToSend} BNB to the merchant address ${merchantAddress}`);
                        }
                    });
            }
        } catch (error) {
            console.log(`Error fetching transaction data: ${error.message}`);
        }
    });
}


async function generateWallet(option) {
    let walletAddress = null;
    if (option === 2 || option === 3 || option === 5 || option === 6 || option === 7) {
        // Generate a new Ethereum wallet
        const wallet = Wallet.createRandom();
        walletAddress = wallet.address;

        const { data, error } = await supabase
            .from('eth_keys')
            .insert({
                address: wallet.address,
                privateKey: wallet.privateKey,
            });
        if (error) {
            console.error(error.message);
        }
    }
    return walletAddress;
}

// Supabase client setup

const channel = supabase
    .channel('table-db-changes')
    .on(
        'postgres_changes',
        {
            event: 'INSERT',
            schema: 'public',
            table: 'invoices',
        },
        async (payload) => {
            let merchantID = payload.new.merchant_id;

            // Find the address by the id in profiles
            const { data: merchantData, error: merchantError } = await supabase
                .from('profiles')
                .select('eth_address')
                .eq('id', merchantID);

            if (merchantError) {
                console.error(`Error retrieving merchant address from database: ${merchantError.message}`);
                return;
            }

            if (!merchantData || merchantData.length === 0) {
                console.error('No merchant address found for the given merchant id');
                return;
            }

            const merchantAddress = merchantData[0].eth_address;
            console.log(`Merchant address: ${merchantAddress}`);
            generateWallet(payload.new.crypto_option).then(
                (walletAddress) => {
                    watchAddress(walletAddress, merchantAddress, payload.new.value_to_receive);
                });
        }
    )
    .subscribe()