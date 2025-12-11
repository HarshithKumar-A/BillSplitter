import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchData } from '../API/api';
import Spinners from './Spinner';
import { useNavigate } from "react-router-dom";
import { getTrip, getUserId, getUserName } from '../API/localStorage';
import NewSplitVrindavan from './NewSplit copy';

function SplitExpenses() {
    const navigate = useNavigate();
    const [totalAmount, setTotalAmount] = useState('');
    const [description, setDescription] = useState('');
    const [expenseType, setExpenseType] = useState('');
    const [splitValues, setSplitValues] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [persons, setPersons] = useState([
        { name: "Vishnu", checked: true },
        { name: "Karthik", checked: true },
        { name: "Harshith", checked: true },
        { name: "Nirmal", checked: false },
        { name: "Abhinav", checked: true },
        { name: "Hari", checked: true },
        { name: "Mithun", checked: true },
    ]);
    const [validationError, setValidationError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userId, setId] = useState();
    const [autoSplit, setAutoSplit] = useState(getTrip() !== 'Vrindavan');
    const [ignoreTotalError, setIgnoreTotalError] = useState(false);
    const [totalError, setTotalError] = useState(false);

    useEffect(() => {
        setId(getUserId())
    }, []);

    const handleTotalAmountChange = (e) => {
        let amount = (e.target.value);
        if (isNaN(amount)) {
            amount = 0;
        }
        setTotalAmount(e.target.value);
        if (autoSplit) {
            const selectedPersons = persons.filter(person => person.checked);
            const amountPerPerson = amount !== 0 ? (amount / selectedPersons.length).toFixed(2) : 0;
            setSplitValues(persons.map(person => person.checked ? parseFloat(amountPerPerson) : 0));
        }
    };

    const handleKeyDown = (e) => {
        if (
            (e.key === 'Enter') ||
            (e.key >= '0' && e.key <= '9') ||
            e.key === 'Backspace' ||
            e.key === 'Delete' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' || (e.key === '.' && !totalAmount.includes('.'))
        ) {
            return;
        }
        e.preventDefault();
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleExpenseTypeChange = (e) => {
        setExpenseType(e.target.value);
    };

    const handlePaidByChange = (e) => {
        setId(e.target.value);
    };

    const handleSplitValueChange = (index, e) => {
        if (e.target.value > Number(totalAmount) || isNaN(Number(e.target.value))) {
            return;
        }
        const updatedSplitValues = [...splitValues];
        updatedSplitValues[index] = e.target.value;
        setSplitValues(updatedSplitValues);
    };

    const handleCheckboxChange = (index) => {
        const updatedPersons = [...persons];
        updatedPersons[index].checked = !updatedPersons[index].checked;
        setPersons(updatedPersons);

        if (autoSplit) {
            const selectedPersons = updatedPersons.filter(person => person.checked);
            const amountPerPerson = totalAmount !== 0 ? (totalAmount / selectedPersons.length).toFixed(2) : 0;
            setSplitValues(updatedPersons.map(person => person.checked ? parseFloat(amountPerPerson) : 0));
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
        if ((totalAmount === '' || Number(totalSplitValue.toFixed(2)) !== Number(totalAmount)) && !ignoreTotalError) {
            setTotalError(true);
            setValidationError(`Total split amount (₹${Number(totalSplitValue.toFixed(2))}) must match the total amount entered(₹${totalAmount}) .`);
            return;
        } else {
            setValidationError(null);
        }
        let payload = '&description=' + description + '&total=' + Number(totalAmount) + '&split=' + JSON.stringify(splitValues) + '&paid=' + userId + '&type=' + expenseType + '&by=' + getUserName();
        console.log(payload);
        setLoading(true);
        fetchData('writeSplit', payload)
            .then((data) => {
                setLoading(false);
                navigate("/view-history");
            })
            .catch((error) => {
                console.error('Error fetching expense history:', error);
                setLoading(false);
                setValidationError('Error in publishing the Split. Save it as a draft for publishing later!');
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
        if ((totalAmount === '' || Number(totalSplitValue.toFixed(2)) !== Number(totalAmount)) && !ignoreTotalError) {
            setTotalError(true);
            setValidationError(`Total split amount (₹${Number(totalSplitValue.toFixed(2))}) must match the total amount entered(₹${totalAmount}) .`);
            return;
        } else {
            setValidationError(null);
        }
        let payload = '&description=' + description + '&total=' + Number(totalAmount) + '&split=' + JSON.stringify(splitValues) + '&paid=' + userId + '&type=' + expenseType + '&by=' + getUserName();
        const newEntry = {
            payload: payload,
            description: description,
            totalAmount: Number(totalAmount),
            paid: getUserName(),
            id: new Date().getTime()
        };
        let currenntlist = localStorage.getItem('v1:unpublished') ? [...JSON.parse(localStorage.getItem('v1:unpublished')), newEntry] : [newEntry];
        localStorage.setItem('v1:unpublished', JSON.stringify(currenntlist));
        navigate("/unpublished");
    }

    return getTrip() === 'Vrindavan' ? <NewSplitVrindavan /> : (
        <div className="container mt-3 p-2">
            <div className='d-flex justify-content-between'>
                <h2>Split Expenses</h2>
                <Link to="/" className="btn btn-primary mb-3">Back to Home</Link>
            </div>
            <form>
                <div className="">
                    <div className=" mb-3 p-0 pe-1">
                        <div className="form-group mt-2">
                            <label htmlFor="totalAmount">Total Amount (INR)</label>
                            <input
                                className="form-control"
                                id="totalAmount"
                                placeholder="Enter total amount"
                                value={totalAmount}
                                onChange={handleTotalAmountChange}
                                onKeyDown={handleKeyDown}
                                type='number'
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
                                <option value="Stay">Stay</option>
                                <option value="Entry Pass">Entry Pass</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                    </div>
                    <div className=" card p-3">
                        <h4 className="mb-3">Split Among Persons:</h4>
                        {persons.map((person, index) => (
                            <div className="row mt-2" key={index}>
                                <div className="col-sm-4">
                                    <input
                                        type="checkbox"
                                        checked={person.checked}
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                    <label className='ms-2' htmlFor={`split-${person.name}`}>{person.name}</label>
                                </div>
                                <div className="col-sm-8">
                                    <input
                                        className="form-control"
                                        id={`split-${person.name}`}
                                        placeholder={`Enter ${person.name}'s share (INR)`}
                                        value={splitValues[index]}
                                        onChange={(e) => handleSplitValueChange(index, e)}
                                        disabled={!person.checked || Number(totalAmount) <= 0}
                                        min={0}
                                        max={Number(totalAmount)}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="row mt-2">
                            <label className='col-sm-2 col-form-label' htmlFor={`split-by`}>Paid By:</label>
                            <div className="col-sm-10">
                                <select
                                    className="form-control"
                                    id="split-by"
                                    value={userId}
                                    onChange={handlePaidByChange}
                                >
                                    {[
                                        { id: 'A', name: 'Abhinav' },
                                        { id: 'HP', name: 'Hari' },
                                        { id: 'H', name: 'Harshith' },
                                        { id: 'K', name: 'Karthik' },
                                        { id: 'V', name: 'Vishnu' },
                                        { id: 'M', name: 'Mithun' },
                                        { id: 'N', name: 'Nirmal' },
                                        { id: 'AB', name: 'Benny' },
                                        { id: 'AK', name: 'Akshaya' },
                                        { id: 'Y', name: 'Yadu' },
                                        { id: 'Their OWN', name: 'Their Own' }
                                    ].map((obj) => <option key={obj.id} value={obj.id}>{obj.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className=" p-3">
                        <input checked={autoSplit} type="checkbox" id="split-disable" name="autoSplit" value={autoSplit} onChange={(e) => { setAutoSplit(!autoSplit) }} />
                        <label className='col-sm-6 ms-2' htmlFor="split-disable">Auto splitting</label>
                    </div>
                    {
                        totalError &&
                        <div className=" p-3">
                            <input checked={ignoreTotalError} type="checkbox" id="error-disable" name="ignoreTotalError" value={ignoreTotalError} onChange={(e) => { setIgnoreTotalError(!ignoreTotalError) }} />
                            <label className='col-sm-6 ms-2' htmlFor="error-disable">Ignore total error <span style={{ color: 'red', fontWeight: 'bold', fontSize: '18px', marginLeft: '2px' }}>!</span></label>
                        </div>
                    }
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
                    disabled={Number(totalAmount) <= 0}
                >
                    Publish Split
                </button>
                <button
                    type="button"
                    className="col-5 btn btn-primary mt-3"
                    onClick={makeDraft}
                    disabled={Number(totalAmount) <= 0}
                >
                    Save as draft
                </button>
            </form>
            {loading && <Spinners />}
        </div>
    );
}

export default SplitExpenses;
