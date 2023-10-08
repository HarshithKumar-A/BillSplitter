import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { fetchData } from '../API/api';

function ViewHistory() {
    const [openCardIndex, setOpenCardIndex] = useState(-1);
    const [expenseHistory, setExpenseHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const toggleCard = (index) => {
        setOpenCardIndex(openCardIndex === index ? -1 : index);
    };

    useEffect(() => {
        // Fetch expense history data when the component mounts
        fetchData('getHistory', false)
            .then((data) => {
                setExpenseHistory(data.result);
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

    return (
        <div className="container mt-5">
            <div className='d-flex justify-content-between'>
                <h2>Expense History</h2>
                <Link to="/" className="btn btn-primary mb-3">Back to Home</Link>
            </div>
            {expenseHistory.map((item, index) => (
                <div className="card mb-3" key={index}>
                    <div className="card-body">
                        <h6 className="card-title mb-0">{item.description}</h6>
                        <p className="card-text text-right m-0" style={{ fontSize: '8px', opacity: '0.7' }}>
                            {formatTime(item.time)}
                        </p>
                        <p className="card-text text-center mb-0" style={{ fontSize: '26px', color: 'red', fontWeight: 'bold' }}>
                            ₹{item.expense.vishnu}
                        </p>
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
            ))}
        </div>
    );
}

export default ViewHistory;
