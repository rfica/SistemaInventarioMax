import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Table, Button, Alert, Form, Card, Modal } from 'react-bootstrap'; // Asegúrate de que Modal esté importado
import api from '../services/apiService'; // Importa apiService

const Categories = () => {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({ nombre: '' });
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
        console.log("Categories: Attempting to fetch categories...");
        const res = await api.getCategories(); // Usa apiService para obtener categorías
        console.log("Categories: Successfully fetched categories", res.data);
        setCategorias(res.data);
      } catch (err) {
        console.error("Categories cargarDatos: Error fetching categories", err);
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
      if (editando) {
        await api.updateCategory(editando, formData); // Usa apiService para actualizar
      } else {
        await api.createCategory(formData); // Usa apiService para crear
      }

      // Recargar lista
      const res = await api.getCategories(); // Usa apiService para recargar
      setCategorias(res.data);

      console.log("Categories: Category saved, reloading list and closing modal.");
      // Cerrar modal
      setShowModal(false);
    } catch (err) {
      console.error("Categories guardarCategoria: Error saving category", err);
      setError(err.response?.data?.error || 'Error al guardar categoría');
    }
  };

  // Eliminar categoría
  const eliminarCategoria = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta categoría?')) return;

    try {
      await api.deleteCategory(id); // Usa apiService para eliminar
      console.log(`Categories: Category ${id} deleted.`);

      // Recargar lista
      const res = await api.getCategories(); // Usa apiService para recargar
      setCategorias(res.data);
    } catch (err) {
      console.error("Categories eliminarCategoria: Error deleting category", err);
      setError('Error al eliminar categoría');
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

        {/* Modal para crear/editar categoría */}
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
        </Modal>
      </div>
    );
  }

  // Si no está cargando y no hay usuario, el useEffect ya ha redirigido,
  // por lo que no necesitamos renderizar nada aquí.
  return null;
};

export default Categories;
