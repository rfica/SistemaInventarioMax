import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Table, Button, Alert, Form, Card } from 'react-bootstrap';

const Categories = () => {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({ nombre: '' });
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
        const res = await axios.get('http://localhost:3001/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategorias(res.data);
      } catch (err) {
        navigate('/');
      }
    };
    
    cargarDatos();
  }, [navigate]);

  // Abrir modal para crear/editar
  const abrirModal = (categoria = null) => {
    if (categoria) {
      // Editar
      setEditando(categoria.id);
      setFormData({ nombre: categoria.nombre });
    } else {
      // Crear
      setEditando(null);
      setFormData({ nombre: '' });
    }
    setShowModal(true);
  };

  // Guardar categoría (crear o editar)
  const guardarCategoria = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (editando) {
        // Actualizar
        await axios.put(`http://localhost:3001/api/categories/${editando}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Crear
        await axios.post('http://localhost:3001/api/categories', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      // Recargar lista
      const res = await axios.get('http://localhost:3001/api/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategorias(res.data);
      
      // Cerrar modal
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar categoría');
    }
  };

  // Eliminar categoría
  const eliminarCategoria = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta categoría?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Recargar lista
      const res = await axios.get('http://localhost:3001/api/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategorias(res.data);
    } catch (err) {
      setError('Error al eliminar categoría');
    }
  };

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="categories-page">
      <h1>Gestión de Categorías</h1>

      {/* Alerta de error */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Botón para nueva categoría */}
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => abrirModal()}>
          + Nueva Categoría
        </Button>
      </div>
      
      {/* Tabla de categorías */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModal(c)}
                >
                  Editar
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => eliminarCategoria(c.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {/* Modal para crear/editar categoría */
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editando ? 'Editar' : 'Nueva'} Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={guardarCategoria}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombre}
                onChange={e => setFormData({...formData, nombre: e.target.value})}
                required
              />
            </Form.Group>

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
      </Modal>}
    </div>
  );
};

export default Categories;