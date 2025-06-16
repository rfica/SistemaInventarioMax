import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Table, Button, Alert, Form, Card, Modal } from 'react-bootstrap';
import api from '../services/apiService'; // Importa apiService

const Warehouses = () => {
  const [almacenes, setAlmacenes] = useState([]);
  const [formData, setFormData] = useState({ nombre: '', ubicacion: '', descripcion: '' });
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // Obtén también el estado loading

  // Cargar datos al iniciar
  useEffect(() => {
    // Redirige si no está cargando y no hay usuario autenticado
    if (!loading && !user) {
      navigate('/');
    }

    const cargarDatos = async () => {
      try {
        console.log("Warehouses: Attempting to fetch warehouses...");
        const res = await api.getWarehouses(); // Usa apiService para obtener almacenes
        console.log("Warehouses: Successfully fetched warehouses", res.data);
        setAlmacenes(res.data);
      } catch (err) {
        console.error("Warehouses cargarDatos: Error fetching warehouses", err);
        // Considera si quieres redirigir o solo mostrar un error si falla la carga inicial
        // navigate('/'); // Esta línea podría redirigir al login en caso de error en la carga
      }
    };

    // Solo carga datos si no está cargando y hay un usuario autenticado
    if (!loading && user) {
      cargarDatos();
    }

  }, [navigate, user, loading]); // Agrega user y loading como dependencias

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
      if (editando) {
        await api.updateWarehouse(editando, formData); // Usa apiService para actualizar
      } else {
        await api.createWarehouse(formData); // Usa apiService para crear
      }

      // Recargar lista
      const res = await api.getWarehouses(); // Usa apiService para recargar
      setAlmacenes(res.data);

      console.log("Warehouses: Warehouse saved, reloading list and closing modal.");
      // Cerrar modal
      setShowModal(false);
    } catch (err) {
      console.error("Warehouses guardarAlmacen: Error saving warehouse", err);
      setError(err.response?.data?.error || 'Error al guardar almacén');
    }
  };

  // Eliminar almacén
  const eliminarAlmacen = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este almacén?')) return;

    try {
      await api.deleteWarehouse(id); // Usa apiService para eliminar
      console.log(`Warehouses: Warehouse ${id} deleted.`);

      // Recargar lista
      const res = await api.getWarehouses(); // Usa apiService para recargar
      setAlmacenes(res.data);
    } catch (err) {
      console.error("Warehouses eliminarAlmacen: Error deleting warehouse", err);
      setError('Error al eliminar almacén');
    }
  };

  // Renderiza null o un indicador de carga mientras la autenticación está en progreso
  if (loading) {
    return (<div>Cargando...</div>); // O un spinner más elaborado
  }

  // Si no hay usuario después de cargar, el useEffect ya habrá redirigido
  // Si hay usuario, renderiza el contenido de la página
  if (user) {
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
  }

  // Si no está cargando y no hay usuario, el useEffect ya ha redirigido,
  // por lo que no necesitamos renderizar nada aquí.
  return null;
};

export default Warehouses;
