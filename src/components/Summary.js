import React, { useState, useEffect } from 'react';
import { fetchData } from '../API/api';
import { Link } from 'react-router-dom';
import Spinners from './Spinner';
import { getUserId, getUserName } from '../API/localStorage';

function SummaryPage() {
    const [summaryData, setSummaryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(getUserId());
    const [total, setTotal] = useState({ get: 0, give: 0 });
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setUrl] = useState('');
    const [imageLoad, setImageLoad] = useState(false);
    const [expenseSummary, setExpenseSummary] = useState();

    useEffect(() => {
        setId(getUserId());
        fetchData('getSummary', false)
            .then((data) => {
                const myData = data.result?.summary.filter(
                    (item) => item.ToPerson === id || item.FromPerson === id
                );
                setSummaryData(myData);
                setExpenseSummary(data.result?.masterSummary);
                let get = 0,
                    give = 0;
                myData.forEach((item) => {
                    if (
                        (item.FromPerson === id && item.Amount > 0) ||
                        (item.ToPerson === id && item.Amount < 0)
                    ) {
                        give += Math.abs(item.Amount);
                    } else {
                        get += Math.abs(item.Amount);
                    }
                });
                setTotal({ get: get, give: give });
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching expense history:', error);
                setLoading(false);
            });
    }, []);

    function returnName(id) {
        return {
            A: 'Abu Ser',
            HP: 'Hari',
            H: 'Harshith',
            K: 'Karthik',
            V: 'Boss',
            M: 'Mithun',
            N: 'Nirmal',
            AB: "Benny",
            AK: "Akshaya",
            Y: "Yadu",
        }[id];
    }

    // Function to toggle the modal visibility
    const toggleImageModal = () => {
        setUrl('');
        if (!showImageModal) {
            setImageLoad(true);
            fetchData('getChart', false).then((data) => {
                setUrl(convertDriveLinkToEmbeddable(data.result.url));
            });
        }
        setShowImageModal(!showImageModal);
    };

    function convertDriveLinkToEmbeddable(link) {
        const fileIdMatch = link.match(/\/d\/(.+?)\//);
        if (!fileIdMatch || fileIdMatch.length < 2) {
            console.error('Invalid Google Drive link');
            return null;
        }
        const fileId = fileIdMatch[1];
        const directLink = `https://drive.google.com/uc?export=view&id=${fileId}`;
        return directLink;
    }

    const handleImageLoad = () => {
        setImageLoad(false);
    };

    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between">
                <h2>Summary</h2>
                <Link to="/" className="btn btn-primary mb-3">
                    Back to Home
                </Link>
            </div>
            {loading ? (
                <Spinners />
            ) : (
                <>
                    <div
                        className="card mb-3"
                        style={{
                            border: '1px solid blue',
                            boxShadow:
                                'rgb(0 64 255) 0px 1px 2px 0px, rgba(27, 255, 0, 0.15) 0px 2px 6px 2px',
                            fontSize: '22px',
                            fontWeight: 'bolder',
                        }}
                    >
                        <div className="card-body d-flex justify-content-around">
                            <span style={{ color: 'red' }}>₹{total.give.toFixed(2)} </span>|
                            <span style={{ color: 'lime' }}> ₹{total.get.toFixed(2)}</span>
                        </div>
                    </div>

                    {summaryData.map((item, index) => (
                        <div
                            className="card mb-3"
                            key={index}
                            style={
                                item.Amount === 0
                                    ? {}
                                    : (item.ToPerson === id && item.Amount > 0) ||
                                        (item.FromPerson === id && item.Amount < 0)
                                        ? {
                                            border: '1px solid lime',
                                            boxShadow:
                                                '0px 1px 2px 0px rgb(27, 255, 0), 0px 2px 6px 2px rgb(27, 255, 0, 0.15)',
                                        }
                                        : {
                                            border: '1px solid red',
                                            boxShadow:
                                                '0px 1px 2px 0px rgb(255, 0, 0), 0px 2px 6px 2px rgb(255, 0, 0, 0.3)',
                                        }
                            }
                        >
                            <div className="card-body">
                                <h6 className="card-title mb-0">
                                    {item.Statement
                                        .replace(getUserName(), 'You')
                                        .replace(/get /g, 'get ₹')}
                                    {item.Amount === 0
                                        ? ' with  ' +
                                        (item.FromPerson === id
                                            ? returnName(item.ToPerson)
                                            : returnName(item.FromPerson))
                                        : ''}
                                </h6>
                            </div>
                        </div>
                    ))}

                    {/* Card to display expense summary */}
                    <div className="card mt-3">
                        <div className="card-body">
                            <h5 className="card-title">Expense Summary</h5>
                            <table className="table">
                                <tbody>
                                    {Object.entries(expenseSummary).map(([category, amount], index) => (
                                        <tr key={index}>
                                            <td>{category}</td>
                                            <td>₹{amount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Button to open the image modal */}
                            <button
                                className="btn btn-primary btn-block mt-3"
                                onClick={toggleImageModal}
                            >
                                Generate Chart
                            </button>
                        </div>
                    </div>

                    {/* Image Modal */}
                    <div
                        className={`modal fade${showImageModal ? ' show' : ''}`}
                        style={{ display: showImageModal ? 'block' : 'none' }}
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="imageModalLabel"
                        aria-hidden={!showImageModal}
                    >
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="imageModalLabel">
                                        Image Popup
                                    </h5>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={toggleImageModal}
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {imageLoad && <Spinners />}
                                    <img
                                        src={imageUrl}
                                        alt="Popup Image"
                                        className="img-fluid"
                                        onLoad={handleImageLoad}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default SummaryPage;
