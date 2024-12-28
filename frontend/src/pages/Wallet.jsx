import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function Wallet() {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState(0);
    const [transaction, setTransaction] = useState([]);

    const [page,setPage]=useState(1)
    const [totalPages, setTotalPages] = useState(1);

    const walletId = useSelector((state) => state.authSlice.walletid); 
    console.log(walletId);

    const getWallet = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/wallet/', { withCredentials: true });
            setBalance(res.data.balance);
        } catch (error) {
            console.log(error);
        }
    };
    const history = async (page) => {
        try {
            const res = await axios.post('http://localhost:3000/api/wallet/history', {page,limit:5}, { withCredentials: true });
            setTransaction(res.data);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddPayment = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/wallet/top-up', { amount }, { withCredentials: true });
            if (res.data) {
                getWallet(); 
                history(page);
                setAmount(0);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getWallet();
        history(page);
    }, [page]); 

    const sortedTransactions = [...transaction].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            
            <div className="flex justify-between items-center p-6 bg-blue-600 text-white shadow-md rounded-b-lg">
                <h1 className="text-3xl font-semibold">Wallet</h1>
                <div className="text-xl font-medium">Balance: ${balance}</div>
            </div>

            <div className="p-6 flex flex-col items-center">
                <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Add Amount</h2>
                    <div className="flex items-center space-x-4">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <button
                            onClick={handleAddPayment}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
                {sortedTransactions.length > 0 ? (
                    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                        <ul className="divide-y divide-gray-200">
                            {sortedTransactions.map((x, index) => (
                                <li key={index} className="py-4 flex justify-between items-center">
                                    <div>
                                        <p
                                            className={`font-medium ${x.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}
                                        >
                                            {x.type === 'credit' ? 'Credit' : 'Debit'}
                                        </p>
                                    </div>
                                    <div
                                        className={`text-xl font-semibold ${x.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                        {x.type === 'credit' ? `Credit: +$${x.amount}` : `Debit: -$${x.amount}`}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <p>No transactions found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Wallet;
