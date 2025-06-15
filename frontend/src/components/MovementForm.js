import React, { useState } from 'react';

const MovementForm = ({ products, onSubmit }) => {
  const [movementType, setMovementType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [productId, setProductId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!movementType || !productId || quantity <= 0) {
      alert('Please fill in all required fields.');
      return;
    }
    onSubmit({ movementType, quantity, productId });
    // Reset form
    setMovementType('');
    setQuantity(1);
    setProductId('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Record New Movement</h2>
      <div>
        <label htmlFor="movementType">Movement Type:</label>
        <select
          id="movementType"
          value={movementType}
          onChange={(e) => setMovementType(e.target.value)}
          required
        >
          <option value="">Select Type</option>
          <option value="entrada">Entry</option>
          <option value="salida">Exit</option>
          {/* Add other types as needed */}
        </select>
      </div>
      <div>
        <label htmlFor="product">Product:</label>
        <select
          id="product"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        >
          <option value="">Select Product</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min="1"
          required
        />
      </div>
      <button type="submit">Record Movement</button>
    </form>
  );
};

export default MovementForm;