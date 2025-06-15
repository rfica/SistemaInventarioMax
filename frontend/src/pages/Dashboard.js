import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Table, Button, Alert, Form, Card, Row, Col } from 'react-bootstrap';
import DashboardChart from '../components/DashboardChart';

const Dashboard = () => {
  const [productos, setProductos] = useState([]);
  const [stockBajo, setStockBajo] = useState([]);
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalValor: 0,
    entradasMes: 0,
    salidasMes: 0
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');

    const cargarDatos = async () => {
      try {
        // Cargar productos
        const res = await axios.get('http://localhost:3001/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProductos(res.data);
        
        // Calcular stock bajo
        const bajoStock = res.data.filter(p => p.cantidad < p.stock_minimo);
        setStockBajo(bajoStock);
        
        // Calcular estadísticas
        const totalValor = res.data.reduce((sum, p) => sum + (p.cantidad * p.precio), 0);
        
        // Cargar movimientos del mes
        const fechaInicio = new Date();
        fechaInicio.setMonth(fechaInicio.getMonth() - 1);
        const fechaFin = new Date();
        
        const resMov = await axios.get(
          `http://localhost:3001/api/movements?fechaInicio=${fechaInicio.toISOString()}&fechaFin=${fechaFin.toISOString()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const entradas = resMov.data.filter(m => m.tipo === 'entrada').length;
        const salidas = resMov.data.filter(m => m.tipo === 'salida').length;
        
        setStats({
          totalProductos: res.data.length,
          totalValor,
          entradasMes: entradas,
          salidasMes: salidas
        });
      } catch (err) {
        navigate('/');
      }
    };
    cargarDatos();
  }, [navigate]);

  return (
    <div className="dashboard">
      <h1>Dashboard de Inventario</h1>
      
      {/* Tarjetas de estadísticas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card bg="primary" text="white">
            <Card.Body>
              <Card.Title>Total de Productos</Card.Title>
              <Card.Text className="display-4">{stats.totalProductos}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="success" text="white">
            <Card.Body>
              <Card.Title>Valor Total</Card.Title>
              <Card.Text className="display-4">
                ${stats.totalValor.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="info" text="white">
            <Card.Body>
              <Card.Title>Entradas (Mes)</Card.Title>
              <Card.Text className="display-4">{stats.entradasMes}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="danger" text="white">
            <Card.Body>
              <Card.Title>Salidas (Mes)</Card.Title>
              <Card.Text className="display-4">{stats.salidasMes}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Gráfico */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Movimientos por Tipo</Card.Title>
          <DashboardChart />
        </Card.Body>
      </Card>
      
      {/* Alertas de stock bajo */}
      {stockBajo.length > 0 && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title className="text-danger">¡Alerta de Stock Bajo!</Card.Title>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Stock Actual</th>
                  <th>Stock Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {stockBajo.map(p => (
                  <tr key={p.id} className="table-danger">
                    <td>{p.nombre}</td>
                    <td>{p.cantidad}</td>
                    <td>{p.stock_minimo}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
      
      {/* Productos */}
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <Card.Title>Inventario Reciente</Card.Title>
            <Button variant="primary" onClick={() => navigate('/products')}>Ver todos</Button>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Cantidad</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {productos.slice(0, 5).map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.Categoria?.nombre || 'Sin categoría'}</td>
                  <td>{p.cantidad}</td>
                  <td>${p.precio.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;