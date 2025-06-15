import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Movements from './pages/Movements';
import Categories from './pages/Categories';
import Warehouses from './pages/Warehouses';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/movements" element={<Movements />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/warehouses" element={<Warehouses />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;