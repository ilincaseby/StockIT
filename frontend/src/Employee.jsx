import { useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import { useState, useEffect } from 'react';
import React from 'react';
import { AddFeedback, AddRequestEmployee, GetCategories, GetDevicesHandle, GetEmployeeRequests } from './Funcs';


function Employee() {
    const [form, setForm] = useState(() => {
        const stored = localStorage.getItem('values');
        return stored ? JSON.parse(stored) : {};
    });
    const [filter, setFilter] = useState({
        name: '',
        category: '',
    })
    const [categories, setCategories] = useState([])
    const [devices, setDevices] = useState([])
    const [requests, setRequests] = useState([])
    const [show, setShow] = useState({
        deviceShow: false,
        categoryShow: false,
        requestShow: false,
        shopShow: false,
    })
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageRequest, setCurrentPageRequest] = useState(1);
    const itemsPerPage = 5;
    const [tempName, setTempName] = useState('');
    const [quantities, setQuantities] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [feedback, setFeedback] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (show.deviceShow) {
            getDevicesHandle();
        }
    }, [filter.category, filter.name]);

    React.useEffect(() => {
        const body = document.body;
        body.classList.add('fade-in');
        return () => {
            body.classList.remove('fade-in');
        };
    }, []);

    const getDevicesHandle = async () => {
        const [obtainedDevices, errorMessage] = await GetDevicesHandle(form.accessToken, filter.category, filter.name);
        if (errorMessage !== '') {
            alert(errorMessage);
            return;
        }
        if (!Array.isArray(obtainedDevices)) {
            console.warn('Received a single object instead of an array:', obtainedDevices);
            setDevices([obtainedDevices]);
        } else {
            setDevices(obtainedDevices);
        }
        setShow({...show, deviceShow: true})
        const [obtainedCategories, errorMessageCategories] = await GetCategories(form.accessToken)
        if (errorMessageCategories !== '') {
            alert(errorMessageCategories);
            return;
        }
        setCategories(obtainedCategories);
    }


    const toggleShops = (index) => {
        setDevices(prevDevices =>
            prevDevices.map((dev, idx) =>
            idx === index ? { ...dev, showShops: !dev.showShops } : dev
            )
        );
    };

    const requestItem = async (device) => {
        const quantity = quantities[device.id]
        let confirmed = window.confirm('Are you sure you want to request this item?');
        if (!confirmed) {
            return;
        }
        const [requestCompleted, errorMessage] = await AddRequestEmployee(form.accessToken, device.id, quantity);
        if (!requestCompleted) {
            alert(errorMessage);
            return;
        }
        

        setSuccessMessage('Request completed');
        setTimeout(() => {
        setSuccessMessage('');
        }, 1000); // 2 secunde

    }

    const getMyRequests = async () => {
        let [reqs, errorMessage] = await GetEmployeeRequests(form.accessToken);
        if (errorMessage !== '') {
            alert(errorMessage);
            return;
        }
        console.log(reqs); // ex: "object", "string", "number", etc.
        setRequests(reqs);
        setShow({...show, requestShow: true});
    }

    const sendFeedback = async () => {
        const newErrors = {};

        if (feedback === '') {
            newErrors.feedback = 'Feedback gol';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) {
            return;
        }
        let [sent, sentMessage] = await AddFeedback(form.accessToken, feedback);
        if (!sent) {
            alert(sentMessage);
            return;
        }
        alert('Feedback sent');
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const visibleDevices = devices.slice(startIndex, endIndex);

    const startIndexRequests = (currentPageRequest - 1) * itemsPerPage;
    const endIndexRequests = startIndexRequests + itemsPerPage;
    const visibleRequests = requests.slice(startIndexRequests, endIndexRequests);


    return (
        <div
        className="background-style"
        >
            {show.requestShow && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: '10px', flexDirection: 'column'}}>

                    <button
                        onClick={() => setShow(prev => ({ ...prev, requestShow: false }))}
                        className='close-page-class'
                    >
                        ×
                    </button>

                <table className="device-table">
                    
                    <thead>
                        <tr>
                            <th>Device Name</th>
                            <th>Device Id</th>
                            <th>Device Quantity</th>
                            <th>Status Request</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleRequests.map((req, idx) => (
                            <tr key={idx}>
                                <td>{req.deviceName}</td>
                                <td>{req.deviceId}</td>
                                <td>{req.units}</td>
                                <td>{req.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            )}

            {show.requestShow && (
                <div className="pagination-controls">
                    <button
                        onClick={() => setCurrentPageRequest((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPageRequest === 1}
                    >
                        Previous
                    </button>
                    
                    <span style={{ margin: '0 12px', color: 'white' }}>
                        Page {currentPageRequest}
                    </span>
                    <button
                        onClick={() =>
                        setCurrentPageRequest((prev) =>
                            endIndexRequests < requests.length ? prev + 1 : prev
                        )
                        }
                        disabled={endIndexRequests >= requests.length}
                    >
                        Next
                    </button>
                    </div>
            )}
            
            {show.deviceShow && (
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: '10px', flexDirection: 'column'}}>

                    <button
                        onClick={() => setShow(prev => ({ ...prev, deviceShow: false }))}
                        className='close-page-class'
                    >
                        ×
                    </button>
                    {successMessage && (
                    <div style={{
                        backgroundColor: '#4caf50',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        margin: '10px auto',
                        textAlign: 'center',
                        width: '60%',
                        fontWeight: 'bold'
                    }}>
                        {successMessage}
                    </div>
                    )}
                    
                    
                    <div style={{ marginBottom: '10px', width: '60%', margin: '0 auto', display: 'flex', justifyContent: 'flex-end' }}>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={tempName}
                        onChange={(e) => {
                            if (e.target.value === '') {
                                setFilter(prev => ({ ...prev, name: e.target.value }));
                            }
                            setTempName(e.target.value)}
                        }
                        className='input-textbox'
                    />
                    <button
                    className="view-shops-button"
                    onClick={() => {
                    setFilter(prev => ({ ...prev, name: tempName }));
                    }}
                >
                    Search
                </button>
                    </div>
                
                <div style={{ marginBottom: '10px', width: '60%', margin: '0 auto', display: 'flex', justifyContent: 'flex-end' }}>
                        <select
                            className="view-shops-button"
                            value={filter.category}
                            onChange={(e) => {
                                setFilter(prev => ({ ...prev, category: e.target.value }))
                            }}
                        >
                            <option value="">None</option>
                            {categories.map((cat, idx) => (
                            <option key={idx} value={cat}>
                                {cat}
                            </option>
                            ))}
                        </select>
                        </div>

                <table className="device-table">
                    
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Available Shops</th>
                            <th>Request Quantity</th>
                            <th>Request</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleDevices.map((device, idx) => (
                            <tr key={idx}>
                                <td>{device.id}</td>
                                <td>{device.name}</td>
                                <td>{device.description}</td>
                                <td>
                                    <button className="view-shops-button" onClick={() => toggleShops(startIndex + idx)}>View Shops</button>
                                    {device.showShops && (
                                        <div className="shops-list-box">
                                        <ul>
                                            {Array.isArray(device.shops) && device.shops.map((shop, shopIdx) => (
                                            <li key={shopIdx}>{shop}</li>
                                            ))}
                                        </ul>
                                        </div>
                                        )}
                                </td>
                                <td><input
                                    type="number"
                                    min="1"
                                    value={quantities[device.id] || ''}
                                    onChange={e => setQuantities({...quantities, [device.id]: e.target.value})}
                                    placeholder="Cantitate"
                                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc' }}
                                /></td>
                                <td>
                                   <button
                                        className="view-shops-button"
                                        onClick={() => requestItem(device)}
                                        >
                                        Request this item
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            )}
            {show.deviceShow && (
                <div className="pagination-controls">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    
                    <span style={{ margin: '0 12px', color: 'white' }}>
                        Page {currentPage}
                    </span>
                    <button
                        onClick={() =>
                        setCurrentPage((prev) =>
                            endIndex < devices.length ? prev + 1 : prev
                        )
                        }
                        disabled={endIndex >= devices.length}
                    >
                        Next
                    </button>
                    </div>
            )}
            {!show.deviceShow && !show.requestShow && (
                <div className='employee-box'>
                    <button className="button-employee" onClick={getDevicesHandle}>
                        Get Device List
                    </button>
                    <button className="button-employee" onClick={getMyRequests}>
                        My Requests
                    </button>
                    <input
                    className='input-numberbox'
                    type="text"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter Feedback"
                    />
                    {errors.feedback && (
                        <div style={{ color: 'red', fontSize: '14px', marginBottom: '8px' }}>
                            {errors.feedback}
                        </div>
                    )}
                    <button className="button-employee" onClick={sendFeedback}>
                        Send Feedback
                    </button>
                </div>
            )}
            
        </div>
    );
}

export default Employee;