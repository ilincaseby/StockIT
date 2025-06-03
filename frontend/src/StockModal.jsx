import { useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import { useState, useEffect } from 'react';
import React from 'react';
import { AddRequestEmployee, GetCategories, GetDevicesHandle, GetEmployeeRequests } from './Funcs';
import { GetRequestsAdmin, GetStockDevice, ResponseRequest } from './FuncsAdmin';

const StockModal = ({ onClose, onSubmit }) => {
  const [stockAmount, setStockAmount] = useState(0);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Stock</h3>
        <input
        className='input-numberbox'
        type="number"
        value={stockAmount}
        onChange={(e) => setStockAmount(Number(e.target.value))}
        placeholder="Enter stock amount"
        />
        <div className="modal-actions">
          <button className='confirm-button' onClick={() => onSubmit(stockAmount)}>Confirm</button>
          <button className='cancel-button' onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default StockModal;