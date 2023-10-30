import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const userList = [
    { id: 'V', name: 'Vishnu' },
    { id: 'K', name: 'Karthik' },
    { id: 'H', name: 'Harshith' },
    { id: 'N', name: 'Nirmal' },
    { id: 'A', name: 'Abhinav' },
    { id: 'HP', name: 'Hariprasad' },
    { id: 'M', name: 'Mithun' },
];


function Login() {
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
        const isUserAuthenticated = localStorage.getItem('v1:userInfo');
        if (isUserAuthenticated) {
            navigate('/');
        }
    }, [])

    const handleLogin = () => {
        console.log(selectedUser);
        if (selectedUser) {
            localStorage.setItem('v1:userInfo', JSON.stringify({ name: userList[selectedUser].name, id: userList[selectedUser].id }));
            navigate('/');
        } else {
            alert('Please select a user before logging in.');
        }
    };

    return (
        <div className='d-flex align-items-center' style={{ height: '100vh' }}>
            <div className="container d-flex align-items-center flex-column">
                <h2>Login As</h2>
                <div className="form-group col-10">
                    <select
                        className="form-control my-3"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">Select a user</option>
                        {userList.map((user, index) => (
                            <option key={user.id} value={index}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button className="btn btn-primary col-10" onClick={handleLogin}>
                    Login
                </button>
            </div>
        </div>
    );
}

export default Login;
