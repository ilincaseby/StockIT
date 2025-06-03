import { useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import StockModal from './StockModal';
import { useState, useEffect } from 'react';
import React from 'react';
import { AddRequestEmployee, GetCategories, GetDevicesHandle, GetEmployeeRequests } from './Funcs';
import { AddShopDevice, AddStockDevice, DeleteDevice, DeleteShopDevice, GetRequestsAdmin, GetStockDevice, ResponseRequest } from './FuncsAdmin';
import ShopAddModal from './ShopAddModal';


function Admin() {
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
    const [stockBox, setStockBox] = useState(false);
    const [selectedStockDeviceId, setSelectedStockDeviceId] = useState(null);
    const [selectedShopDeviceId, setSelectedShopDeviceId] = useState(null);
    const [selectedDeleteShopDeviceId, setSelectedDeleteShopDeviceId] = useState(null);

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

    const getAllRequests = async () => {
        let [reqs, errorMessage] = await GetRequestsAdmin(form.accessToken);
        if (errorMessage !== '') {
            alert(errorMessage);
            return;
        }
        console.log(reqs); // ex: "object", "string", "number", etc.
        setRequests(reqs);
        
    }

    const viewStock = async (req) => {
        let [gotStock, stockMessage] = await GetStockDevice(form.accessToken, req.deviceId);
        if (!gotStock) {
            alert('Error: '+ stockMessage);
            return;
        }
        alert('Stock is: ' + stockMessage);
    }

    const approveOrDeny = async (req, approved) => {
        let [opSuccess, opMessage] = await ResponseRequest(form.accessToken, req.requestId, approved)
        if (!opSuccess) {
            alert('Failed to apply operation on request: ', opMessage);
            return;
        }
        alert(opMessage);
        getAllRequests();
    } 

    const addStock = async (id, stock) => {
        let [stockAdded, stockMessage] = await AddStockDevice(form.accessToken, id, stock);
        if (!stockAdded) {
            alert('Failed: ' + stockAdded);
            return;
        }
        alert('Added stock for device id: ' + id);
        getDevicesHandle();
    }

    const addShop = async (id, shop) => {
        let [shopAdded, shopMessage] = await AddShopDevice(form.accessToken, id, shop);
        if (!shopAdded) {
            alert('Failed: ' + shopMessage);
            return;
        }
        alert('Added shop for device id: ' + id);
        getDevicesHandle();
    }

    const deleteShop = async (id, shop) => {
        let [shopDeleted, shopMessage] = await DeleteShopDevice(form.accessToken, id, shop);
        if (!shopDeleted) {
            alert('Failed: ' + shopMessage);
            return;
        }
        alert('Deleted shop for device id: ' + id);
        getDevicesHandle();
    }

    const deleteDevice = async (id) => {
        let [deviceDeleted, deleteMessage] = await DeleteDevice(form.accessToken, id)
        if (!deviceDeleted) {
            alert('Failed: ' + deleteMessage);
            return;
        }
        alert('Device deleted');
        getDevicesHandle();
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
                            <th>Requester Username</th>
                            <th>Requester First Name</th>
                            <th>Requester Last Name</th>
                            <th>Stock</th>
                            <th>Deny</th>
                            <th>Approve</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleRequests.map((req, idx) => (
                            <tr key={idx}>
                                <td>{req.deviceName}</td>
                                <td>{req.deviceId}</td>
                                <td>{req.units}</td>
                                <td>{req.status}</td>
                                <td>{req.username}</td>
                                <td>{req.firstName}</td>
                                <td>{req.lastName}</td>
                                <td>
                                    <button className="view-shops-button" onClick={() => viewStock(req)}>View Stock</button>
                                </td>
                                <td>
                                    <button className="view-shops-button" onClick={() => approveOrDeny(req, false)}>Deny</button>
                                </td>
                                <td>
                                    <button className="view-shops-button" onClick={() => approveOrDeny(req, true)}>Approve</button>
                                </td>
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
                            <th>Available Shops</th>
                            <th>Add Stock</th>
                            <th>Add Shop</th>
                            <th>Delete Shop</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleDevices.map((device, idx) => (
                            <tr key={idx}>
                                <td>{device.id}</td>
                                <td>{device.name}</td>
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
                                <td>
                                    <button className='view-shops-button' onClick={() => setSelectedStockDeviceId(device.id)}>Add Stock</button>
                                    {selectedStockDeviceId === device.id && (
                                        <StockModal
                                        onClose={() => {
                                            setStockBox(false);
                                            setSelectedStockDeviceId(null);
                                        }}
                                        onSubmit={(amount) => {
                                            addStock(device.id, amount)
                                            setSelectedStockDeviceId(null); // închide modalul după acțiune
                                            // Aici poți apela și o funcție de backend dacă vrei
                                        }}
                                        />
                                    )
                                    }
                                </td>
                                <td>
                                    <button className='view-shops-button' onClick={() => setSelectedShopDeviceId(device.id)}>Add Shop</button>
                                    {selectedShopDeviceId === device.id && (
                                        <ShopAddModal
                                        onClose={() => {
                                            setStockBox(false);
                                            setSelectedShopDeviceId(null);
                                        }}
                                        onSubmit={(shop) => {
                                            addShop(device.id, shop)
                                            setSelectedShopDeviceId(null); // închide modalul după acțiune
                                            // Aici poți apela și o funcție de backend dacă vrei
                                        }}
                                        />
                                    )
                                    }
                                </td>
                                <td>
                                    <button className='delete-button' onClick={() => setSelectedDeleteShopDeviceId(device.id)}>Delete Shop</button>
                                    {selectedDeleteShopDeviceId === device.id && (
                                        <ShopAddModal
                                        onClose={() => {
                                            setStockBox(false);
                                            setSelectedDeleteShopDeviceId(null);
                                        }}
                                        onSubmit={(shop) => {
                                            deleteShop(device.id, shop)
                                            setSelectedDeleteShopDeviceId(null); // închide modalul după acțiune
                                            // Aici poți apela și o funcție de backend dacă vrei
                                        }}
                                        />
                                    )
                                    }
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
                    <button className="button-employee" onClick={() => {
                        getAllRequests();
                        setShow({...show, requestShow: true});
                    }
                        }>
                        Requests
                    </button>
                </div>
            )}
            
        </div>
    );
}

export default Admin;