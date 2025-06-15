import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Table, Button, Alert, Form, Card } from 'react-bootstrap';

const Warehouses = () => {
  const [almacenes, setAlmacenes] = useState([]);
  const [formData, setFormData] = useState({ nombre: '', ubicacion: '', descripcion: '' });
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Cargar datos al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');

    const cargarDatos = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/warehouses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlmacenes(res.data);
      } catch (err) {
        navigate('/');
      }
    };

    cargarDatos();
  }, [navigate]);

  // Abrir modal para crear/editar
  const [showModal, setShowModal] = useState(false);

  const abrirModal = (almacen = null) => {
    if (almacen) {
      // Editar
      setEditando(almacen.id);
      setFormData({
        nombre: almacen.nombre,
        ubicacion: almacen.ubicacion || '',
        descripcion: almacen.descripcion || ''
      });
    } else {
      // Crear
      setEditando(null);
      setFormData({ nombre: '', ubicacion: '', descripcion: '' });
    }
    setShowModal(true);
  };

  // Guardar almacén (crear o editar)
  const guardarAlmacen = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (editando) {
        // Actualizar
        await axios.put(`http://localhost:3001/api/warehouses/${editando}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Crear
        await axios.post('http://localhost:3001/api/warehouses', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Recargar lista
      const res = await axios.get('http://localhost:3001/api/warehouses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlmacenes(res.data);

      // Cerrar modal
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar almacén');
    }
  };

  // Eliminar almacén
  const eliminarAlmacen = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este almacén?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/warehouses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Recargar lista
      const res = await axios.get('http://localhost:3001/api/warehouses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlmacenes(res.data);
    } catch (err) {
      setError('Error al eliminar almacén');
    }
  };

  return (
    <div className="warehouses-page">
      <h1>Gestión de Almacenes</h1>

      {/* Alerta de error */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Botón para nuevo almacén */}
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => abrirModal()}> 
          + Nuevo Almacén
        </Button>
      </div>

      {/* Tabla de almacenes */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {almacenes.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.nombre}</td>
              <td>{a.ubicacion || '-'}</td>
              <td>{a.descripcion || '-'}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModal(a)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => eliminarAlmacen(a.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para crear/editar almacén */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editando ? 'Editar' : 'Nuevo'} Almacén</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={guardarAlmacen}>
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
                  <Form.Label>Ubicación</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.ubicacion}
                    onChange={e => setFormData({...formData, ubicacion: e.target.value})}
                  />
                </Form.Group>
              </div>

              <div className="col-12">
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.descripcion}
                    onChange={e => setFormData({...formData, descripcion: e.target.value})}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="mt-3">
              <Button variant="primary" type="submit">Guardar</Button>
              <Button
                variant="secondary"
                className="ms-2"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Warehouses;