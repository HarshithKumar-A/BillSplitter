import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchData } from '../API/api';
import Spinners from './Spinner';

function SplitExpenses() {
    const [totalAmount, setTotalAmount] = useState('');
    const [description, setDescription] = useState('');
    const [expenseType, setExpenseType] = useState('');
    const [splitAmount, setSplitAmount] = useState('');
    const [splitValues, setSplitValues] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [submittedValues, setSubmittedValues] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [loading, setLoading] = useState(false);

    const persons = ["Vishnu", "Karthik", "Harshith", "Nirmal", "Abinav", "Hari", "Mithun"];

    const handleTotalAmountChange = (e) => {
        const amount = parseFloat(e.target.value);
        setTotalAmount(amount);
        const amountPerPerson = amount !== 0 ? (amount / persons.length).toFixed(2) : 0;
        setSplitAmount(amountPerPerson);
        setSplitValues(persons.map(() => (amount !== 0 ? parseFloat(amountPerPerson) : 0)));
    };


    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleExpenseTypeChange = (e) => {
        setExpenseType(e.target.value);
    };

    const handleSplitValueChange = (index, e) => {
        const updatedSplitValues = [...splitValues];
        updatedSplitValues[index] = parseFloat(e.target.value);
        setSplitValues(updatedSplitValues);
    };

    const handleSplitSubmit = () => {
        const totalSplitValue = splitValues.reduce((acc, value) => acc + value, 0);
        console.log(totalSplitValue.toFixed(2), totalAmount)
        if (totalAmount === '' || Number(totalSplitValue.toFixed(2)) !== totalAmount) {
            setValidationError(`Total split amount (₹${Number(totalSplitValue.toFixed(2))}) must match the total amount entered(₹${totalAmount}) .`);
            return;
        } else {
            setValidationError(null)
        }
        let payload = '&description=' + description + '&total=' + totalAmount + '&split=' + JSON.stringify(splitValues) + '&paid=H' + '&type=' + expenseType;
        setLoading(true);
        fetchData('writeSplit', payload)
            .then((data) => {
                setLoading(false);
                console.log(data);
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
                                type="number"
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
            {submittedValues && (
                <div className="mt-3">
                    <h3>Submitted Values:</h3>
                </div>
            )}
            {loading && <Spinners />}
        </div>
    );
}

export default SplitExpenses;
