import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { StarsList } from './pages/StarsList';
import { StarDetail } from './pages/StarDetail';
import './App.css';

function App() {
  const isTauri = typeof window !== 'undefined' && window.location.protocol === 'tauri:';
  const basename = isTauri ? undefined : "/exocalc-front-app";
  
  console.log('App: isTauri =', isTauri, 'basename =', basename);
  console.log('App: protocol =', typeof window !== 'undefined' ? window.location.protocol : 'N/A');
  
  return (
    <Router basename={basename}>
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
