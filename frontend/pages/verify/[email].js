import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.ankr.com/polygon_mumbai"));
import ABI from '@/lib/ABI.json';
import { useState, useEffect } from 'react';
import { tr } from 'date-fns/locale';

const verify = ({ email }) => {

    const [active, setActive] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const emailKey = web3.utils.keccak256(email);
    const contract = new web3.eth.Contract(ABI, "0x14710BDb76743e217C3F936aE3ecb4673F45369c");
    const f = async () => {
        const totalPlans = await contract.methods.totalPlans().call();
        const userID = await contract.methods.userIDs(emailKey).call();

        for (let i = 0; i < parseInt(totalPlans); i++) {
            const isActive = await contract.methods.isActive(userID, i).call();
            if (isActive == true) {
                setActive(true);
                console.log(active);
                return true;
            }
        }
        return false;
    }
    f();

    useEffect(() => {
        const runPrecheck = async () => {
            const result = await f();

            if (result == true) {
                setShouldRender(true);
            } else {

            }
        };

        runPrecheck();
    }, []);

    if (!shouldRender) {
        return <div className="bg-[#0a0a0a] z-50 w-screen h-screen"></div>;
    }
    return (
        <div>
            <p className='text-black'>{
                active
                    ? (<div>is active</div>)
                    : (<div>not active</div>)

            }
            </p>
        </div>
    );
}

export default verify;


export async function getServerSideProps({ params }) {
    const { email } = params;

    return {
        props: {
            email: email,
        },
    };
}