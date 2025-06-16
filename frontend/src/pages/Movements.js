import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import api from '../services/apiService';
import {
  Table, Button, Alert, Form, Card,
  InputGroup, Modal, Badge, Row, Col
} from 'react-bootstrap';

const Movements = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [formData, setFormData] = useState({
    tipo: 'entrada',
    notas: '',
    referencia: '',
    detalles: []
  });
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
        // Cargar movimientos
        const resMov = await api.getMovements();
        setMovimientos(resMov.data);

        // Cargar productos
        const resProd = await api.getProducts();
        setProductos(resProd.data);

        // Cargar almacenes (Assuming you have a getWarehouses in apiService/apiMock)
        const resAlm = await api.getWarehouses();
        setAlmacenes(resAlm.data);
      } catch (err) {
        navigate('/');
      }
    };

    cargarDatos();
  }, [navigate]);

  // Manejar cambio en formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Añadir producto al detalle
  const agregarDetalle = () => {
    setFormData({
      ...formData,
      detalles: [
        ...formData.detalles,
        {
          producto_id: '',
          cantidad: 1,
          costo_unitario: 0,
          origen_id: '',
          destino_id: ''
        }
      ]
    });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      // Assuming createMovement function in apiService handles headers internally
      await api.createMovement(formData);

      // Actualizar lista
      const res = await api.getMovements();

      // Limpiar formulario y cerrar
      setFormData({
        tipo: 'entrada',
        notas: '',
        referencia: '',
        detalles: []
      });
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear movimiento');
    }
  };

  // Filtrar movimientos por tipo
  const [filtroTipo, setFiltroTipo] = useState('');
  const movimientosFiltrados = filtroTipo
    ? movimientos.filter(m => m.tipo === filtroTipo)
    : movimientos;

  return (
    <div className="movements-page\">
      <h1>Movimientos de Inventario</h1>

      {/* Estadísticas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Movimientos</Card.Title>
              <Card.Text className="display-4">{movimientos.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Entradas</Card.Title>
              <Card.Text className="display-4 text-success">
                {movimientos.filter(m => m.tipo === 'entrada').length}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Salidas</Card.Title>
              <Card.Text className="display-4 text-danger">
                {movimientos.filter(m => m.tipo === 'salida').length}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Transferencias</Card.Title>
              <Card.Text className="display-4 text-info">
                {movimientos.filter(m => m.tipo === 'transferencia').length}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Botón para nuevo movimiento */}
      <div className="d-flex justify-content-between mb-3">
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
        >
          + Nuevo Movimiento
        </Button>

        <Form.Select
          style={{ width: '200px' }}
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
          <option value="devolucion">Devolución</option>
          <option value="ajuste">Ajuste</option>
          <option value="transferencia">Transferencia</option>
        </Form.Select>
      </div>

      {/* Tabla de movimientos */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Referencia</th>
            <th>Productos</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientosFiltrados.map(m => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>
                <Badge
                  bg={
                    m.tipo === 'entrada' ? 'success' :
                    m.tipo === 'salida' ? 'danger' :
                    m.tipo === 'devolucion' ? 'info' :
                    m.tipo === 'ajuste' ? 'warning' : 'secondary'
                  }
                >
                  {m.tipo}
                </Badge>
              </td>
              <td>{new Date(m.fecha).toLocaleDateString()}</td>
              <td>{m.referencia || '-'}</td>
              <td>
                {m.MovementDetails?.map(d =>
                  `${d.Product?.nombre} (${d.cantidad})`
                ).join(', ')}
              </td>
              <td>{m.User?.username}</td>
              <td>
                <Button variant="info" size="sm">Ver</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para crear movimiento */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Movimiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Movimiento</Form.Label>
              <Form.Select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
                <option value="devolucion">Devolución</option>
                <option value="ajuste">Ajuste</option>
                <option value="transferencia">Transferencia</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Referencia</Form.Label>
              <Form.Control
                type="text"
                name="referencia"
                value={formData.referencia}
                onChange={handleChange}
                placeholder="Factura #123, Orden de compra, etc."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notas</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notas"
                value={formData.notas}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Detalles del movimiento */}
            <h5>Productos</h5>
            {formData.detalles.map((detalle, index) => (
              <div key={index} className="detalle-row mb-3 p-3 border rounded">
 <div className="row\">
                  <div className="col-md-4">
                    <Form.Label>Producto</Form.Label>
                    <Form.Select
                      value={detalle.producto_id}
                      onChange={e => {
                        const newDetalles = [...formData.detalles];
                        newDetalles[index].producto_id = e.target.value;
                        setFormData({ ...formData, detalles: newDetalles });
                      }}
                      required
                    >
                      <option value="">Seleccionar producto</option>
                      {productos.map(p => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                      ))}
                    </Form.Select>
                  </div>

                  <div className="col-md-3">
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={detalle.cantidad}
                      onChange={e => {
                        const newDetalles = [...formData.detalles];
                        newDetalles[index].cantidad = parseInt(e.target.value);
                        setFormData({ ...formData, detalles: newDetalles });
                      }}
                      required
                    />
                  </div>

                  {formData.tipo === 'entrada' && (
                    <div className="col-md-3">
                      <Form.Label>Costo Unitario</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                          type="number"
                          step="0.01"
                          value={detalle.costo_unitario}
                          onChange={e => {
                            const newDetalles = [...formData.detalles];
                            newDetalles[index].costo_unitario = parseFloat(e.target.value);
                            setFormData({ ...formData, detalles: newDetalles });
                          }}
                          required
                        />
                      </InputGroup>
                    </div>
                  )}

                  {formData.tipo === 'transferencia' && (
                    <>
                      <div className="col-md-3">
                        <Form.Label>Almacén Origen</Form.Label>
                        <Form.Select
                          value={detalle.origen_id}
                          onChange={e => {
                            const newDetalles = [...formData.detalles];
                            newDetalles[index].origen_id = e.target.value;
                            setFormData({ ...formData, detalles: newDetalles });
                          }}
                          required
                        >
                          <option value="">Seleccionar origen</option>
                          {almacenes.map(a => (
                            <option key={a.id} value={a.id}>{a.nombre}</option>
                          ))}
                        </Form.Select>
                      </div>

                      <div className="col-md-3">
                        <Form.Label>Almacén Destino</Form.Label>
                        <Form.Select
                          value={detalle.destino_id}
                          onChange={e => {
                            const newDetalles = [...formData.detalles];
                            newDetalles[index].destino_id = e.target.value;
                            setFormData({ ...formData, detalles: newDetalles });
                          }}
                          required
                        >
                          <option value="">Seleccionar destino</option>
                          {almacenes.map(a => (
                            <option key={a.id} value={a.id}>{a.nombre}</option>
                          ))}
                        </Form.Select>
                      </div>
                    </>
                  )}

                  <div className="col-md-2">
                    <Button
                      variant="danger"
                      className="mt-4"
                      onClick={() => {
                        const newDetalles = formData.detalles.filter((_, i) => i !== index);
                        setFormData({ ...formData, detalles: newDetalles });
                      }}
                    >
                      X
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="secondary"
              className="mb-3"
              onClick={agregarDetalle}
            >
              + Añadir producto
            </Button>

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

export default Movements;