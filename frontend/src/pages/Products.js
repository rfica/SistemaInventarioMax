import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Table, Button, Alert, Form, Card,
  InputGroup, Modal, Dropdown
} from 'react-bootstrap';

const Products = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad: 0,
    precio: 0,
    stock_minimo: 5,
    categoria_id: '',
    almacen_id: ''
  });
  const [editando, setEditando] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Cargar datos al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');

    const cargarDatos = async () => {
      try {
        // Cargar productos
        const resProd = await axios.get('http://localhost:3001/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProductos(resProd.data);

        // Cargar categorías
        const resCat = await axios.get('http://localhost:3001/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategorias(resCat.data);

        // Cargar almacenes
        const resAlm = await axios.get('http://localhost:3001/api/warehouses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlmacenes(resAlm.data);
      } catch (err) {
        navigate('/');
      }
    };

    cargarDatos();
  }, [navigate]);

  // Abrir modal para crear/editar
  const abrirModal = (producto = null) => {
    if (producto) {
      // Editar
      setEditando(producto.id);
      setFormData({
        nombre: producto.nombre,
        cantidad: producto.cantidad,
        precio: producto.precio,
        stock_minimo: producto.stock_minimo,
        categoria_id: producto.categoria_id,
        almacen_id: producto.almacen_id
      });
    } else {
      // Crear
      setEditando(null);
      setFormData({
        nombre: '',
        cantidad: 0,
        precio: 0,
        stock_minimo: 5,
        categoria_id: '',
        almacen_id: ''
      });
    }
    setShowModal(true);
  };

  // Guardar producto (crear o editar)
  const guardarProducto = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (editando) {
        // Actualizar
        await axios.put(`http://localhost:3001/api/products/${editando}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Crear
        await axios.post('http://localhost:3001/api/products', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Recargar lista
      const res = await axios.get('http://localhost:3001/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(res.data);

      // Cerrar modal
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar producto');
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este producto?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Recargar lista
      const res = await axios.get('http://localhost:3001/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(res.data);
    } catch (err) {
      setError('Error al eliminar producto');
    }
  };

  // Filtrar productos por nombre
  const [filtro, setFiltro] = useState('');
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="products-page">
      <h1>Gestión de Productos</h1>

      {/* Alerta de error */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Botones y búsqueda */}
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => abrirModal()}>
          + Nuevo Producto
        </Button>
        <Form className="d-flex">
          <Form.Control
            type="text"
            placeholder="Buscar producto..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </Form>
      </div>

      {/* Tabla de productos */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Almacén</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Stock Mínimo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map(p => (
            <tr key={p.id} className={p.cantidad < p.stock_minimo ? 'table-danger' : ''}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.Category?.nombre || 'Sin categoría'}</td>
              <td>{p.Warehouse?.nombre || 'Sin almacén'}</td>
              <td>{p.cantidad}</td>
              <td>${p.precio.toFixed(2)}</td>
              <td>{p.stock_minimo}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModal(p)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => eliminarProducto(p.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para crear/editar producto */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editando ? 'Editar' : 'Nuevo'} Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={guardarProducto}>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nombre}
                    onChange={e => setFormData({...formData, nombre: e.target.value})}
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    value={formData.categoria_id}
                    onChange={e => setFormData({...formData, categoria_id: e.target.value})}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}\n                  </Form.Select>
                </Form.Group>
              </div>

              <div className=\"col-md-6\">
                <Form.Group className=\"mb-3\">\n                  <Form.Label>Almacén</Form.Label>\n                  <Form.Select\n                    value={formData.almacen_id}\n                    onChange={e => setFormData({...formData, almacen_id: e.target.value})}\n                    required\n                  >\n                    <option value=\"\">Seleccionar almacén</option>\n                    {almacenes.map(a => (\n                      <option key={a.id} value={a.id}>{a.nombre}</option>\n                    ))}\n                  </Form.Select>\n                </Form.Group>\n              </div>\n\n              <div className=\"col-md-6\">\n                <Form.Group className=\"mb-3\">\n                  <Form.Label>Código (opcional)</Form.Label>\n                  <Form.Control\n                    type=\"text\"\n                    value={formData.codigo || \'\'}\n                    onChange={e => setFormData({...formData, codigo: e.target.value})}\n                  />\n                </Form.Group>\n              </div>\n\n              <div className=\"col-md-4\">\n                <Form.Group className=\"mb-3\">\n                  <Form.Label>Cantidad</Form.Label>\n                  <Form.Control\n                    type=\"number\"\n                    value={formData.cantidad}\n                    onChange={e => setFormData({...formData, cantidad: parseInt(e.target.value)})}\n                    required\n                  />\n                </Form.Group>\n              </div>\n\n              <div className=\"col-md-4\">\n                <Form.Group className=\"mb-3\">\n                  <Form.Label>Precio</Form.Label>\n                  <InputGroup>\n                    <InputGroup.Text>$</InputGroup.Text>\n                    <Form.Control\n                      type=\"number\"\n                      step=\"0.01\"\n                      value={formData.precio}\n                      onChange={e => setFormData({...formData, precio: parseFloat(e.target.value)})}\n                      required\n                    />\n                  </InputGroup>\n                </Form.Group>\n              </div>\n\n              <div className=\"col-md-4\">\n                <Form.Group className=\"mb-3\">\n                  <Form.Label>Stock Mínimo</Form.Label>\n                  <Form.Control\n                    type=\"number\"\n                    value={formData.stock_minimo}\n                    onChange={e => setFormData({...formData, stock_minimo: parseInt(e.target.value)})}\n                    required\n                  />\n                </Form.Group>\n              </div>\n            </div>\n\n            <div className=\"mt-3\">\n              <Button variant=\"primary\" type=\"submit\">Guardar</Button>\n              <Button\n                variant=\"secondary\"\n                className=\"ms-2\"\n                onClick={() => setShowModal(false)}\n              >\n                Cancelar\n              </Button>\n            </div>\n          </Form>\n        </Modal.Body>\n      </Modal>\n    </div>\n  );\n};\n\nexport default Products;