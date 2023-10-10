import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { fetchData } from '../API/api';
import Spinners from './Spinner';
import { getUserId, getUserName } from '../API/localStorage';

function ViewHistory() {
    const [openCardIndex, setOpenCardIndex] = useState(-1);
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
        return { A: 'Abu Ser', HP: 'Hari', H: 'Harshith', K: 'Karthik', 'V': 'Boss', 'M': 'Mithun', N: 'Nirmal' }[id]
    }

    return (
        <div className="container mt-3">
            <div className='d-flex justify-content-between'>
                <h2>Expense History</h2>
                <Link to="/" className="btn btn-primary mb-3">Back to Home</Link>
            </div>
            {
                loading ? <Spinners /> :
                    expenseHistory.map((item, index) => (
                        <div className="card mb-3" key={index}>
                            <div className="card-body">
                                <h6 className="card-title mb-0">{item.description}</h6>
                                <p className="card-text text-right m-0" style={{ fontSize: '8px', opacity: '0.7' }}>
                                    {formatTime(item.time)} by <b>{returnName(item.paidby)}</b>
                                </p>
                                {item.paidby === id ?
                                    <p className="card-text text-center mb-0" style={{ fontSize: '26px', color: 'green', fontWeight: 'bold' }}>
                                        ₹{item.total - item.expense[getUserName()]}
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
        </div>
    );
}

export default ViewHistory;
