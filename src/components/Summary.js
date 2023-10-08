import React, { useState, useEffect } from 'react';
import { fetchData } from '../API/api';
import { Link } from 'react-router-dom';
import Spinners from './Spinner';

function SummaryPage() {
    const [summaryData, setSummaryData] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        // Fetch expense history data when the component mounts
        fetchData('getSummary', false)
            .then((data) => {
                setSummaryData(data.result);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching expense history:', error);
                setLoading(false);
            });
    }, []);

    function returnName(id) {
        return { A: 'Abu Ser', HP: 'Hari', H: 'Harshith', K: 'Karthik', 'V': 'Boss', 'M': 'Mithun', N: 'Nirmal' }[id]
    }
    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between">
                <h2>Summary</h2>
                <Link to="/" className="btn btn-primary mb-3">
                    Back to Home
                </Link>
            </div>
            {
                loading ? <Spinners /> :
                    summaryData.map((item, index) => (
                        (item.ToPerson === 'V' || item.FromPerson === 'V') && (
                            <div
                                className="card mb-3"
                                key={index}
                                style={
                                    item.Amount === 0 ? {} : (
                                        (item.ToPerson === 'V' && item.Amount > 0) || (item.FromPerson === 'V' && item.Amount < 0)
                                            ? {
                                                border: '1px solid lime',
                                                boxShadow: '0px 1px 2px 0px rgb(27, 255, 0), 0px 2px 6px 2px rgb(27, 255, 0, 0.15)',
                                            }
                                            : {
                                                border: '1px solid red',
                                                boxShadow: '0px 1px 2px 0px rgb(255, 0, 0), 0px 2px 6px 2px rgb(255, 0, 0, 0.3)',
                                            }
                                    )
                                }
                            >
                                <div className="card-body">
                                    <h6 className="card-title mb-0">{item.Statement.replace(/visnu/g, 'You').replace(/get /g, 'get ₹')}
                                        {item.Amount === 0 ? ' with  ' + (item.FromPerson === 'V' ? returnName(item.ToPerson) : returnName(item.FromPerson)) : ''}
                                    </h6>
                                </div>
                            </div>
                        )
                    ))}
        </div>
    );
}

export default SummaryPage;
