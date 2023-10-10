import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchData } from '../API/api';
import Spinners from './Spinner';
import { useNavigate } from "react-router-dom";
import { getUserId } from '../API/localStorage';


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

    useEffect(() => {
        setId(getUserId())
    }, []);

    const persons = ["Vishnu", "Karthik", "Harshith", "Nirmal", "Abinav", "Hari", "Mithun"];

    const handleTotalAmountChange = (e) => {
        const amount = parseFloat(e.target.value);
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
        if (e.target.value > totalAmount) {
            return;
        }
        const updatedSplitValues = [...splitValues];
        updatedSplitValues[index] = parseFloat(e.target.value.replace(/^0+/, ''));

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
        console.log(touchTotal, totalAmount - touchTotal, nonTouchedCount);
        setSplitValues(updatedDirty.map((value, index) => value ? updatedSplitValues[index] : (totalAmount - touchTotal) / nonTouchedCount))
        console.log(splitValues)
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
        const totalSplitValue = splitValues.reduce((acc, value) => acc + value, 0);
        console.log(totalSplitValue.toFixed(2), totalAmount)
        if (totalAmount === '' || Number(totalSplitValue.toFixed(2)) !== totalAmount) {
            setValidationError(`Total split amount (₹${Number(totalSplitValue.toFixed(2))}) must match the total amount entered(₹${totalAmount}) .`);
            return;
        } else {
            setValidationError(null)
        }
        let payload = '&description=' + description + '&total=' + totalAmount + '&split=' + JSON.stringify(splitValues) + '&paid=' + id + '&type=' + expenseType;
        setLoading(true);
        fetchData('writeSplit', payload)
            .then((data) => {
                setLoading(false);
                console.log(data);
                navigate("/view-history");
            })
            .catch((error) => {
                console.error('Error fetching expense history:', error);
                setLoading(false);
            });
    };

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
                                        type="number"
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
                </div>
                {validationError && (
                    <div className="alert alert-danger mt-3" role="alert">
                        {validationError}
                    </div>
                )}
                <button
                    type="button"
                    className="col-12 btn btn-primary mt-3"
                    onClick={handleSplitSubmit}
                    disabled={totalAmount <= 0}
                >
                    Split Expenses
                </button>
            </form>
            {loading && <Spinners />}
        </div>
    );
}

export default SplitExpenses;
