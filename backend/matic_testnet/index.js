const Web3 = require('web3');
const { createClient } = require('@supabase/supabase-js');
const { Wallet } = require('ethers');

const providerUrl = 'wss://alpha-dry-friday.matic-testnet.discover.quiknode.pro/fd98487de5185e948eba15342c3243f55013200e/';
const web3 = new Web3(new Web3.providers.WebsocketProvider(providerUrl));

const supabase = createClient(
    'https://ecozdwjnqcnxnyjfaxlm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjb3pkd2pucWNueG55amZheGxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NTE2NDQ4MywiZXhwIjoyMDAwNzQwNDgzfQ.UnseGYC4_ARBA2D7WeVcXoHpRyvce1kQQfY0UI-Lsss'
)

const tokenABI = require('./ABIs/BUSD.json');
const tokenAddress = '0x2e84cC0cE546A50f0C0B6731f119D37ae2B6c7eE'; // The BEP20 token contract address
const transferEventSignature = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const feePrivateKey = "d2a055101b4f1ed131fd55c8e3c85b62c0e64bda9c2691bb3fa8e28c353ffb96";
const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);

const transferEventInputs = [
    {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
    },
    {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
    }
];

async function sendTokenTransaction(destinationAddress, senderPrivateKey, value) {
    try {
        web3.eth.accounts.wallet.add(senderPrivateKey);

        const fromAddress = web3.eth.accounts.wallet[0].address;

        gasPrice = await web3.eth.getGasPrice();

        let gasLimit = await tokenContract.methods.transfer(destinationAddress, web3.utils.toWei(value.toString())).estimateGas({
            from: fromAddress
        });

        let tx = await tokenContract.methods.transfer(destinationAddress, web3.utils.toWei(value.toString())).send({
            from: fromAddress,
            gasPrice: gasPrice,
            gas: gasLimit
        });
        console.log(tx);
    }
    catch (error) {
        console.error('Error sending transaction:', error.message);
    }
}

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
                        confirm_date: new Date().getTime(),
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

async function watchAddress(address, merchantAddress, valueToSend, crypto_option) {
    console.log(`Watching for incoming transactions to ${address}...`);
    if (crypto_option == "BNB") {
        const subscription = web3.eth.subscribe('pendingTransactions', async (error, txHash) => {
            if (error) {
                console.log(`Error subscribing to pendingTransactions: ${error.message}`);
                return;
            }

            try {
                const tx = await web3.eth.getTransaction(txHash.toString());
                if (tx.to === address && web3.utils.toBN(tx.value).gte(web3.utils.toWei(valueToSend.toString(), 'ether'))) {
                    console.log(web3.utils.toBN(tx.value));
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
    else if (crypto_option == "USDT(BEP-20)" || crypto_option == "BUSD(BEP-20)" || crypto_option == "USDC(BEP-20)") {
        const logs = web3.eth.subscribe('logs', {
            address: tokenAddress,
            topics: [
                transferEventSignature,
                null,
                console.log(web3.eth.abi.encodeParameter('address', address))
            ]
        }, (error, result) => {
            if (error) {
                console.error('Error:', error);
                return;
            }

            const event = web3.eth.abi.decodeLog(transferEventInputs, result.data, result.topics.slice(1));
            console.log('Event:', event);
            const fromAddress = event.from;
            const toAddress = event.to;
            const value = event.value;
            if (event.to === address && web3.utils.toBN(event.value).gte(web3.utils.toWei(valueToSend.toString(), 'ether'))) {
                console.log(`From: ${fromAddress}`);
                console.log(`To: ${toAddress}`);
                console.log(`Value: ${web3.utils.fromWei(value, 'ether')}`);
                console.log(`Incoming transaction detected: ${result.transactionHash}`);

                checkConfirmations(address, result.transactionHash.toString(), async () => {
                    // Unsubscribe from the 'pendingTransactions' event
                    logs.unsubscribe((error, success) => {
                        if (error) {
                            console.log(`Error unsubscribing from logs: ${error.message}`);
                            return;
                        }

                        console.log(`Successfully unsubscribed from logs for address ${address}`);
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

                    const bnbFee = "0.005"; // 5 Gwei
                    let tokenBalance = await tokenContract.methods.balanceOf(address).call();

                    if (web3.utils.toBN(tokenBalance).gte(web3.utils.toWei(valueToSend.toString(), 'ether'))) {
                        await sendTransaction(address, feePrivateKey, bnbFee).then(async () => {
                            await sendTokenTransaction(merchantAddress, privateKey, valueToSend).then(() => {
                                console.log(`Successfully sent ${valueToSend} BUSD to the merchant address ${merchantAddress}`);
                            }).catch((error) => {
                                console.log(error);
                            });
                        }).catch((error) => {
                            console.log(error);
                        });
                    }
                });
            }
        }).on('connected', (subscriptionId) => {
            console.log('Connected with subscription ID:', subscriptionId);
        }).on('error', (error) => {
            console.error('Error:', error);
        });
    }

}

async function generateWallet(option, invoice_id) {
    let walletAddress = null;
    if (option == "BNB" || option == "USDT(BEP-20)" || option == "BUSD(BEP-20)" || option == "USDC(BEP-20)") {
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
            if (payload.new.crypto_option == "BNB" || payload.new.crypto_option == "USDT(BEP-20)" || payload.new.crypto_option == "BUSD(BEP-20)" || payload.new.crypto_option == "USDC(BEP-20)") {
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
                        watchAddress(walletAddress, merchantAddress, payload.new.value_to_receive, payload.new.crypto_option);
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