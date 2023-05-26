const Web3 = require('web3');

const providerUrl = 'wss://alpha-dry-friday.matic-testnet.discover.quiknode.pro/fd98487de5185e948eba15342c3243f55013200e/';
const web3 = new Web3(new Web3.providers.WebsocketProvider(providerUrl));

// Private key of the account that will execute the autopay function
const privateKey = 'd2a055101b4f1ed131fd55c8e3c85b62c0e64bda9c2691bb3fa8e28c353ffb96';

// The contract ABI
const abi = require('./ABI.json');
const contractAddress = '0xe77279967EFeE08cc8F879Db518d9f512d2aa6Dd';

const contract = new web3.eth.Contract(abi, contractAddress);


const account = web3.eth.accounts.privateKeyToAccount(privateKey);


web3.eth.accounts.wallet.add(account);


web3.eth.defaultAccount = account.address;

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function checkAndAutoPay() {
    const totalPlans = await contract.methods.totalPlans().call();
    for (let i = 0; i < totalPlans; i++) {
        console.log(`Checking plan ${i}`);
        const totalSubscribers = await contract.methods.plan(i).call();
        console.log(`Total subscribers: ${totalSubscribers[3]}`);
        for (let j = 0; j < parseInt(totalSubscribers[3]); j++) {
            console.log(`Checking subscriber ${j}`);
            const subscriberAddress = await contract.methods.numberToAddress(j).call();
            
            await delay(20);

            const isDue = await contract.methods.checkDue(i, subscriberAddress).call();
            if (!isDue) {
                const autopayTx = contract.methods.autoPay(i, subscriberAddress);
                const gas = await autopayTx.estimateGas({ from: account.address });
                const tx = {
                    to: contractAddress,
                    data: autopayTx.encodeABI(),
                    gas,
                };

                const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

                await delay(20);

                const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                console.log(`Transaction hash: ${receipt.transactionHash}`);
            }
        }
    }
}

checkAndAutoPay().catch(console.error);
setInterval(() => {
    checkAndAutoPay().catch(console.error);
}, 1000 * 60 * 5);