import React, { useState } from 'react';

const ShopAddModal = ({ onClose, onSubmit }) => {
  const [shopName, setShopName] = useState('');

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Shop</h3>
        <input
          className='input-numberbox'
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          placeholder="Enter shop name"
        />
        <div className="modal-actions">
          <button
            className='confirm-button'
            onClick={() => {
              if (shopName.trim() !== '') {
                onSubmit(shopName.trim());
              }
            }}
          >
            Confirm
          </button>
          <button className='cancel-button' onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ShopAddModal;