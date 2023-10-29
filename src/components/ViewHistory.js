import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { fetchData } from '../API/api';
import Spinners from './Spinner';
import { getUserId, getUserName } from '../API/localStorage';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

function ViewHistory() {
    const [openCardIndex, setOpenCardIndex] = useState(-1);
    const [selectedForDelete, setselectedForDelete] = useState(-1);
    const [expenseHistory, setExpenseHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(getUserId());


    const toggleCard = (index) => {
        setOpenCardIndex(openCardIndex === index ? -1 : index);
    };

    useEffect(() => {
        setId(getUserId())
        // Fetch expense history data when the component mounts
        fetchData('getHistory', false)
            .then((data) => {
                setExpenseHistory(data.result.reverse());
                setLoading(false);
            })
            .catch((error) => {
                toast.error('Error fetching expense history');
                console.error('Error fetching expense history:', error);
                setLoading(false);
            });
    }, []);

    const formatTime = (time) => {
        const date = new Date(time);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const userTimezoneDate = new Date(date.getTime() - userTimezoneOffset);
        const formattedTime = userTimezoneDate.toLocaleString();

        return formattedTime;
    };

    function returnName(id) {
        return { A: 'Abu Ser', HP: 'Hari', H: 'Harshith', K: 'Karthik', 'V': 'Boss', 'M': 'Mithun', N: 'Nirmal', 'Their OWN': 'Their Own' }[id]
    }

    const handleDeleteSplit = (item) => {
        let payload = '&description=' + item.description + '&id=' + (item.index + 1) + '&by=' + getUserName();
        setLoading(true);
        fetchData('deleteRow', payload)
            .then((data) => {
                toast.success(item.description + '  deleted successfully!');
                setselectedForDelete(-1);
                fetchData('getHistory', false)
                    .then((data) => {
                        setExpenseHistory(data.result.reverse());
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error('Error fetching expense history:', error);
                        setLoading(false);
                    });
            })
            .catch((error) => {
                toast.error('Unable to delete expense history!');
                setLoading(false);
            });
    };

    const getTotalAmountToGet = ((expense, user) => {
        expense[user] = 0;
        return (Object.keys(expense).reduce((acc, value) => acc + Number(expense[value]), 0)).toFixed(2)
    });

    return (
        <div className="container mt-3">
            <div className='d-flex justify-content-between'>
                <h2>Expense History</h2>
                <Link to="/" className="btn btn-primary mb-3">Back to Home</Link>
            </div>
            {expenseHistory.map((item, index) => (
                <div className="card mb-3" key={index}>
                    <div className="card-body">
                        <div className='d-flex' style={{ justifyContent: 'space-between' }}>
                            <div style={{ overflow: 'truncated', width: 'calc(100% - 30px)' }}>
                                <h6 className="card-title mb-0" >{item.description}</h6>
                                <p className="card-text text-right m-0" style={{ fontSize: '8px', opacity: '0.7' }}>
                                    {new Date(item.time).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} by <b>{returnName(item.paidby)}</b>
                                </p>
                            </div>
                            {item.paidby === id &&
                                <span
                                    style={{ color: 'red', fontWeight: 'bolder', cursor: 'pointer' }}
                                    onClick={() => setselectedForDelete(index)}
                                >
                                    X
                                </span>
                            }
                        </div>
                        {item.paidby === id ?
                            <p className="card-text text-center mb-0" style={{ fontSize: '26px', color: 'green', fontWeight: 'bold' }}>
                                ₹{getTotalAmountToGet({ ...item.expense }, getUserName())}
                            </p>
                            : <p className="card-text text-center mb-0" style={{ fontSize: '26px', color: 'red', fontWeight: 'bold' }}>
                                ₹{item.expense[getUserName()]}
                            </p>
                        }
                        <p className="card-text text-center" style={{ color: 'gray' }}>Total: ₹{item.total}</p>
                        {index === openCardIndex && (
                            <div>
                                {Object.entries(item.expense).map(([key, value]) => (
                                    <p key={key} className="card-text">
                                        {key}: ₹{value}
                                    </p>
                                ))}
                            </div>
                        )}
                        {selectedForDelete === index && (
                            <div className="delete-confirmation m-2">
                                <div className="confirmation-content">
                                    <p>Are you sure you want to delete this split?</p>
                                    <div>
                                        <button className="btn btn-danger me-1" onClick={() => handleDeleteSplit(item)}>
                                            Yes, Delete
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => { setselectedForDelete(-1) }}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <p
                            className="card-text text-center show-more-link"
                            onClick={() => toggleCard(index)}
                            style={{ textDecoration: 'underline', cursor: 'pointer' }}
                        >
                            {openCardIndex === index ? 'Show Less' : 'Show More'}
                        </p>
                    </div>
                </div>
            ))
            }
            {loading && <Spinners />}
        </div>
    );
}

export default ViewHistory;
