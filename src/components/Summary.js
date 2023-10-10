import React, { useState, useEffect } from 'react';
import { fetchData } from '../API/api';
import { Link } from 'react-router-dom';
import Spinners from './Spinner';
import { getUserId, getUserName } from '../API/localStorage';

function SummaryPage() {
    const [summaryData, setSummaryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(getUserId());
    const [total, setTotal] = useState({ get: 0, give: 0 })


    useEffect(() => {
        // Fetch expense history data when the component mounts
        setId(getUserId())
        fetchData('getSummary', false)
            .then((data) => {
                const myData = data.result.filter((item) => item.ToPerson === id || item.FromPerson === id);
                setSummaryData(myData);
                let get = 0, give = 0;
                myData.forEach((item) => {
                    if (item.FromPerson === id && item.Amount > 0 || item.ToPerson === id && item.Amount < 0) {
                        give += Math.abs(item.Amount);
                    } else {
                        get += Math.abs(item.Amount);
                    }
                })
                setTotal({ get: get, give: give });
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
        <div className="container mt-3">
            <div className="d-flex justify-content-between">
                <h2>Summary</h2>
                <Link to="/" className="btn btn-primary mb-3">
                    Back to Home
                </Link>
            </div>
            {loading ? <Spinners /> :
                <>

                    <div className="card mb-3" style={{
                        border: '1px solid blue',
                        boxShadow: 'rgb(0 64 255) 0px 1px 2px 0px, rgba(27, 255, 0, 0.15) 0px 2px 6px 2px',
                        fontSize: '22px',
                        fontWeight: 'bolder',
                    }}>
                        <div className='card-body d-flex justify-content-around'>
                            <span style={{ color: 'red' }}>₹{total.give.toFixed(2)} </span>| <span style={{ color: 'lime' }}> ₹{total.get.toFixed(2)}</span>
                        </div>
                    </div>

                    {summaryData.map((item, index) => (
                        <div
                            className="card mb-3"
                            key={index}
                            style={
                                item.Amount === 0 ? {} : (
                                    (item.ToPerson === id && item.Amount > 0) || (item.FromPerson === id && item.Amount < 0)
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
                                <h6 className="card-title mb-0">{item.Statement.replace(getUserName(), 'You').replace(/get /g, 'get ₹')}
                                    {item.Amount === 0 ? ' with  ' + (item.FromPerson === id ? returnName(item.ToPerson) : returnName(item.FromPerson)) : ''}
                                </h6>
                            </div>
                        </div>
                    ))
                    }
                </>
            }
        </div>
    );
}

export default SummaryPage;
