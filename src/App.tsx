import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { StarsList } from './pages/StarsList';
import { StarDetail } from './pages/StarDetail';
import { Login } from './pages/Login';
import { SelectedStars } from './pages/SelectedStars';
import { SelectedStarsList } from './pages/SelectedStarsList';
import { PersonalCabinet } from './pages/PersonalCabinet';
import './App.css';

function App() {
  return (
    <Router basename="/exocalc-front-app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stars" element={<StarsList />} />
        <Route path="/star/:id" element={<StarDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/application/:id" element={<SelectedStars />} />
        <Route path="/applications" element={<SelectedStarsList />} />
        <Route path="/personal-cabinet" element={<PersonalCabinet />} />
      </Routes>
    </Router>
  );
}

export default App;
