function App() {
  console.log('Simple App rendering...');
  console.log('window.__TAURI__:', typeof window !== 'undefined' ? (window as any).__TAURI__ : 'N/A');
  
  return (
    <div style={{ 
      padding: '40px', 
      color: 'white', 
      backgroundColor: '#1B1B1B',
      minHeight: '100vh',
      fontFamily: 'system-ui'
    }}>
      <h1 style={{ color: '#db4938', marginBottom: '20px' }}>
        Экзопланетный калькулятор
      </h1>
      <p>Приложение загружено успешно!</p>
      <p>Tauri: {typeof window !== 'undefined' && (window as any).__TAURI__ ? 'Да' : 'Нет'}</p>
      <p>Location: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
    </div>
  );
}

export default App;

