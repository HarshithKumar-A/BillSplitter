import React, { useState, useEffect } from 'react';
import { fetchData } from '../API/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinners from './Spinner';


// Sample data from local storage

const PublishSplits = () => {
    const [loading, setLoading] = useState(false);
    const [splits, setSplits] = useState([]);
    const [publishId, setPublishId] = useState()

    const postData = async (payload, id) => {
        setPublishId(id);
        setLoading(true)
        fetchData('writeSplit', payload)
            .then((data) => {
                deleteSplit(id, false);
                setLoading(false);
                toast.success("Draft Published!");
            })
            .catch((error) => {
                setLoading(false)
                toast.error("Unable to publish!");
            });
    };

    function deleteSplit(id, showDelete) {
        const newList = splits.filter((item) => item.id !== id);
        localStorage.setItem('v1:unpublished', JSON.stringify(newList));
        setSplits(newList);
        if (showDelete) {
            toast("Draft Removed!");
        }
    }

    useEffect(() => {
        const unpublishedSplits = JSON.parse(localStorage.getItem('v1:unpublished')) || [];
        setSplits(unpublishedSplits);

    }, []);

    return (
        <div className="container mt-5">
            <div className='d-flex justify-content-between'>
                <h2>Publish Splits</h2>
                <Link to="/" className="btn btn-primary mb-3">Back to Home</Link>
            </div>
            {splits.length ? splits.map((split) => (
                <div className="card mb-3" key={split.payload}>
                    <div className="card-body d-flex">
                        <div className="flex-grow-1">
                            <p className="card-text fs-5 fw-bold text-primary">{split.totalAmount}</p>
                            <p className="card-text fs-6 fw-bold text-secondary-50">Paid by {split.paid}</p>
                            <p className="card-text fs-6 truncate">{split.description}</p>
                        </div>
                        <div className="d-flex align-items-center">
                            <button
                                className="btn btn-success"
                                onClick={() => postData(split.payload, split.id)}
                                disabled={loading}
                            >
                                {loading && publishId === split.id ? 'Publishing...' : 'Publish'}
                            </button>
                            <button
                                className="btn btn-danger ms-1"
                                onClick={() => deleteSplit(split.id, true)}
                                disabled={loading}
                            >
                                delete
                            </button>
                        </div>
                    </div>
                </div>
            )) : <div className='d-flex align-items-center justify-content-center' style={{ height: '50vh', }}>No Drafts</div>}
            {loading && <Spinners />}
        </div>
    );
};

export default PublishSplits;
