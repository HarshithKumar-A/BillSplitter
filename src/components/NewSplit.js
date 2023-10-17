import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchData } from '../API/api';
import Spinners from './Spinner';
import { useNavigate } from "react-router-dom";
import { getUserId, getUserName } from '../API/localStorage';


function SplitExpenses() {
    const navigate = useNavigate();
    const [totalAmount, setTotalAmount] = useState('');
    const [description, setDescription] = useState('');
    const [expenseType, setExpenseType] = useState('');
    const [splitValues, setSplitValues] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [dirty, setDirty] = useState([false, false, false, false, false, false, false]);
    const [validationError, setValidationError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState(getUserId());
    const [autoSplit, setAutoSPlit] = useState(true);


    useEffect(() => {
        setId(getUserId())
    }, []);

    const persons = ["Vishnu", "Karthik", "Harshith", "Nirmal", "Abinav", "Hari", "Mithun"];

    const handleTotalAmountChange = (e) => {
        let amount = parseFloat(e.target.value);
        if (isNaN(amount)) {
            amount = 0;
        }
        setTotalAmount(amount);
        const amountPerPerson = amount !== 0 ? (amount / persons.length).toFixed(2) : 0;
        setSplitValues(persons.map(() => (amount !== 0 ? parseFloat(amountPerPerson) : 0)));
    };


    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleExpenseTypeChange = (e) => {
        setExpenseType(e.target.value);
    };

    const handleSplitValueChange = (index, e) => {
        if (e.target.value > totalAmount || isNaN(Number(e.target.value))) {
            return;
        }
        const updatedSplitValues = [...splitValues];
        updatedSplitValues[index] = e.target.value;

        if (autoSplit) {
            const updatedDirty = [...dirty];
            updatedDirty[index] = true;
            setDirty(updatedDirty)
            const nonTouchedCount = updatedDirty.filter((val) => !val).length;
            let touchTotal = 0;
            updatedDirty.forEach((val, index) => {
                if (val) {
                    touchTotal += Number(updatedSplitValues[index] ? updatedSplitValues[index] : 0);
                }
            })
            setSplitValues(updatedDirty.map((value, index) => value ? updatedSplitValues[index] : (totalAmount - touchTotal) / nonTouchedCount))
        } else {
            setSplitValues(updatedSplitValues);
        }
    };

    const handleSplitSubmit = () => {
        if (!description) {
            setValidationError('Enter Description!');
            return;
        }
        if (splitValues.some((val) => val < 0)) {
            setValidationError('Value Can not be -ve !');
            return;
        }
        if (!expenseType) {
            setValidationError('Select A expense type!');
            return;
        }
        const totalSplitValue = splitValues.reduce((acc, value) => acc + Number(value), 0);
        if (totalAmount === '' || Number(totalSplitValue.toFixed(2)) !== totalAmount) {
            setValidationError(`Total split amount (₹${Number(totalSplitValue.toFixed(2))}) must match the total amount entered(₹${totalAmount}) .`);
            return;
        } else {
            setValidationError(null)
        }
        let payload = '&description=' + description + '&total=' + totalAmount + '&split=' + JSON.stringify(splitValues) + '&paid=' + id + '&type=' + expenseType + '&by=' + getUserName();
        setLoading(true);
        fetchData('writeSplit', payload)
            .then((data) => {
                setLoading(false);
                navigate("/view-history");
            })
            .catch((error) => {
                console.error('Error fetching expense history:', error);
                setValidationError('Error in publishing the Split. Save it as a draft for publishing later!')
            });
    };

    function makeDraft() {
        if (!description) {
            setValidationError('Enter Description!');
            return;
        }
        if (splitValues.some((val) => val < 0)) {
            setValidationError('Value Can not be -ve !');
            return;
        }
        if (!expenseType) {
            setValidationError('Select A expense type!');
            return;
        }
        const totalSplitValue = splitValues.reduce((acc, value) => acc + Number(value), 0);
        if (totalAmount === '' || Number(totalSplitValue.toFixed(2)) !== totalAmount) {
            setValidationError(`Total split amount (₹${Number(totalSplitValue.toFixed(2))}) must match the total amount entered(₹${totalAmount}) .`);
            return;
        } else {
            setValidationError(null)
        }
        let payload = '&description=' + description + '&total=' + totalAmount + '&split=' + JSON.stringify(splitValues) + '&paid=' + id + '&type=' + expenseType + '&by=' + getUserName();
        const newEntry = {
            payload: payload,
            description: description,
            totalAmount: totalAmount,
            paid: getUserName(),
            id: new Date().getTime()
        }
        let currenntlist = localStorage.getItem('v1:unpublished') ? [...JSON.parse(localStorage.getItem('v1:unpublished')), newEntry] : [newEntry];
        localStorage.setItem('v1:unpublished', JSON.stringify(currenntlist))
        navigate("/unpublished");
    }

    return (
        <div className="container mt-3 p-2">
            <div className='d-flex justify-content-between'>
                <h2>Split Expenses</h2>
                <Link to="/" className="btn btn-primary mb-3">Back to Home</Link>
            </div>
            <form>
                <div className="">
                    <div className="col-md-6 mb-3 p-0 pe-1">
                        <div className="form-group mt-2">
                            <label htmlFor="totalAmount">Total Amount (INR)</label>
                            <input
                                className="form-control"
                                id="totalAmount"
                                placeholder="Enter total amount"
                                value={totalAmount}
                                onChange={handleTotalAmountChange}
                            />
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="description">Description</label>
                            <textarea
                                className="form-control"
                                id="description"
                                placeholder="Enter description"
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="expenseType">Expense Type</label>
                            <select
                                className="form-control"
                                id="expenseType"
                                value={expenseType}
                                onChange={handleExpenseTypeChange}
                            >
                                <option value="">Select expense type</option>
                                <option value="Food">Food</option>
                                <option value="Travel">Travel</option>
                                <option value="Entry Pass">Entry Pass</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6 card p-3">
                        <h4 className="mb-3">Split Among Persons:</h4>
                        {persons.map((person, index) => (
                            <div className="row mt-2" key={index}>
                                <label className='col-sm-2 col-form-label' htmlFor={`split-${person}`}>{person}</label>
                                <div className="col-sm-10">
                                    <input
                                        className="form-control"
                                        id={`split-${person}`}
                                        placeholder={`Enter ${person}'s share (INR)`}
                                        value={splitValues[index]}
                                        onChange={(e) => handleSplitValueChange(index, e)}
                                        disabled={totalAmount <= 0}
                                        min={0}
                                        max={totalAmount}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-md-6 p-3">
                        <input checked={autoSplit} type="checkbox" id="split-disble" name="vehicle3" value={autoSplit} onChange={(e) => { setAutoSPlit(!autoSplit) }} />
                        <label className='col-sm-6 ms-2' htmlFor="split-disble">Auto splitting</label>
                    </div>
                </div>
                {validationError && (
                    <div className="alert alert-danger mt-3" role="alert">
                        {validationError}
                    </div>
                )}
                <button
                    type="button"
                    className="col-5 btn btn-primary mt-3 me-5"
                    onClick={handleSplitSubmit}
                    disabled={totalAmount <= 0}
                >
                    Publish Split
                </button>
                <button
                    type="button"
                    className="col-5 btn btn-primary mt-3"
                    onClick={makeDraft}
                    disabled={totalAmount <= 0}
                >
                    Save as draft
                </button>
            </form>
            {loading && <Spinners />}
        </div>
    );
}

export default SplitExpenses;
