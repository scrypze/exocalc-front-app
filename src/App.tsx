import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { StarsList } from './pages/StarsList';
import { StarDetail } from './pages/StarDetail';
import './App.css';

function App() {
  return (
    <Router basename="/exocalc-front-app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stars" element={<StarsList />} />
        <Route path="/star/:id" element={<StarDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
