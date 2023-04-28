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
        const gasPriceBN = web3.utils.toBN(gasPrice);

        const tx = {
            from: senderAddress,
            to: destinationAddress,
            gasPrice: gasPrice,
        };

        // Estimate the gas required for the transaction
        const estimatedGas = await web3.eth.estimateGas(tx);

        const estimatedGasBN = web3.utils.toBN(estimatedGas).muln(110).divn(100);

        console.log('Estimated gas:', estimatedGasBN.toString());
        tx.gas = estimatedGas.toString();
    

        // Calculate total gas cost (gas cost = gas price * gas limit)
        const totalGasCost = gasPriceBN.mul(estimatedGasBN);

        // Check if the sender's balance is enough
        const senderBalance = await web3.eth.getBalance(senderAddress);
        console.log('Sender balance:', senderBalance);


        if (web3.utils.toBN(senderBalance).lt(totalGasCost)) {
            throw new Error('Sender balance is too low for the gas cost');
        }

        // Set the transaction value (value - total gas cost)
        let transactionValue = web3.utils.toBN(web3.utils.toWei(value, 'ether')).sub(totalGasCost);
        if (transactionValue.isNeg()) {
            throw new Error('The value after subtracting the gas cost is negative');
        }
        tx.value = transactionValue;

        // Sign the transaction
        const signedTx = await web3.eth.accounts.signTransaction(tx, senderPrivateKey);

        // Send the transaction
        const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log('Transaction hash:', txReceipt.transactionHash);

    } catch (error) {
        console.error('Error sending transaction:', error.message);
    }
}


async function checkConfirmations(address, txHash, callback) {
    try {
        // Get the current block number
        let tx = await web3.eth.getTransaction(txHash.toString());
        let currentBlockNumber = await web3.eth.getBlockNumber();
        currentBlockNumber = parseFloat(currentBlockNumber);
        tx.blockNumber = parseFloat(tx.blockNumber);
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
                        status: 'Confirmed',
                    },
                ])
                .eq('address', address);

            if (error) {
                console.log(`Error updating transaction as confirmed in database: ${error.message}`);
            }

            callback();
        } else {
            console.log(`Transaction has ${confirmations} confirmations. Waiting for more confirmations...`);

            if (!isNaN(confirmations)) {
                const { error } = await supabase
                    .from('invoices')
                    .update([
                        {
                            status: `Awaiting confirmation ${confirmations}/12`
                        },
                    ])
                    .eq('address', address);
                if (error)
                    console.log(error);
            }

            setTimeout(() => checkConfirmations(address, txHash, callback), 3000); // Check again after 3 seconds
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
            const tx = await web3.eth.getTransaction(txHash.toString());
            if (tx.to === address) {
                console.log(tx);
                console.log(`Incoming transaction detected: ${tx.hash}`);
                console.log(`From: ${tx.from}`);
                console.log(`To: ${tx.to}`);
                console.log(`Value: ${web3.utils.fromWei(tx.value, 'ether')} BNB`);

                checkConfirmations(address, txHash, async () => {
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

                });
            }
        } catch (error) {
            console.log(`Error fetching transaction data: ${error.message}`);
        }
    });
}

async function generateWallet(option, invoice_id) {
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
                invoice_id: invoice_id,
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
            if (payload.new.crypto_option == 3) {
                let merchantID = payload.new.merchant_id;
                let invoice_id = payload.new.id;

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
                generateWallet(payload.new.crypto_option, invoice_id).then(
                    async (walletAddress) => {
                        watchAddress(walletAddress, merchantAddress, payload.new.value_to_receive);
                        // insert in the database
                        const { data, error } = await supabase
                            .from('invoices')
                            .update({
                                address: walletAddress,
                            })
                            .match({ id: invoice_id });
                        if (error) {
                            console.error(error.message);
                        }
                    });
            }
        }
    )
    .subscribe()