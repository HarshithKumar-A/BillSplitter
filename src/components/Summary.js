import React, { useState, useEffect } from 'react';
import { fetchData } from '../API/api';
import { Link } from 'react-router-dom';

const summaryData = [
    {
        "FromPerson": "K",
        "ToPerson": "V",
        "Amount": 10,
        "Statement": "visnu will get 10 from Karthik"
    },
    {
        "FromPerson": "H",
        "ToPerson": "V",
        "Amount": -200,
        "Statement": "Harshith will get 200 from visnu"
    },
    {
        "FromPerson": "N",
        "ToPerson": "V",
        "Amount": 10,
        "Statement": "visnu will get 10 from Nirmal"
    },
    {
        "FromPerson": "A",
        "ToPerson": "V",
        "Amount": 0,
        "Statement": "No transactions"
    },
    {
        "FromPerson": "M",
        "ToPerson": "V",
        "Amount": 10,
        "Statement": "visnu will get 10 from Mithun"
    },
    {
        "FromPerson": "H",
        "ToPerson": "K",
        "Amount": -210,
        "Statement": "Harshith will get 210 from Karthik"
    },
    {
        "FromPerson": "N",
        "ToPerson": "K",
        "Amount": 0,
        "Statement": "No transactions"
    },
    {
        "FromPerson": "A",
        "ToPerson": "K",
        "Amount": -10,
        "Statement": "Abinav will get 10 from Karthik"
    },
    {
        "FromPerson": "M",
        "ToPerson": "K",
        "Amount": 0,
        "Statement": "No transactions"
    },
    {
        "FromPerson": "N",
        "ToPerson": "H",
        "Amount": 210,
        "Statement": "Harshith will get 210 from Nirmal"
    },
    {
        "FromPerson": "A",
        "ToPerson": "H",
        "Amount": 200,
        "Statement": "Harshith will get 200 from Abinav"
    },
    {
        "FromPerson": "M",
        "ToPerson": "H",
        "Amount": 210,
        "Statement": "Harshith will get 210 from Mithun"
    },
    {
        "FromPerson": "A",
        "ToPerson": "N",
        "Amount": -10,
        "Statement": "Abinav will get 10 from Nirmal"
    },
    {
        "FromPerson": "M",
        "ToPerson": "N",
        "Amount": 0,
        "Statement": "No transactions"
    },
    {
        "FromPerson": "M",
        "ToPerson": "A",
        "Amount": 10,
        "Statement": "Abinav will get 10 from Mithun"
    },
    {
        "FromPerson": "V",
        "ToPerson": "HP",
        "Amount": -10,
        "Statement": "visnu will get 10 from Hariprasad"
    },
    {
        "FromPerson": "K",
        "ToPerson": "HP",
        "Amount": 0,
        "Statement": "No transactions"
    },
    {
        "FromPerson": "H",
        "ToPerson": "HP",
        "Amount": -210,
        "Statement": "Harshith will get 210 from Hariprasad"
    },
    {
        "FromPerson": "N",
        "ToPerson": "HP",
        "Amount": 0,
        "Statement": "No transactions"
    },
    {
        "FromPerson": "A",
        "ToPerson": "HP",
        "Amount": -10,
        "Statement": "Abinav will get 10 from Hariprasad"
    },
    {
        "FromPerson": "M",
        "ToPerson": "HP",
        "Amount": 0,
        "Statement": "No transactions"
    }
];

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
            {summaryData.map((item, index) => (
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
