import React from 'react';

const InventoryTable = ({ products }) => {
  return (
    <table className="">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.nombre}</td>
            <td>{product.cantidad}</td>
            <td>{product.precio}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InventoryTable;