import React from 'react';
import './Aux.css';
import background from './assets/background.png';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
    React.useEffect(() => {
        const body = document.body;
        body.classList.add('fade-in');
        return () => {
            body.classList.remove('fade-in');
        };
    }, []);
  const handleRegisterClick = () => navigate('/register');
  const handleLoginClick = () => navigate('/login');

  return (
    <div
      className="background-style"
    >
      <div className="overlayBoxStyle">
        <h1>Bine ai venit!</h1>
        <div>
          <button className="button-zoom" style={{ width: '100%', marginTop: 24 }} onClick={handleLoginClick}>
            Log In
          </button>
          <button className="button-zoom" style={{ width: '100%', marginTop: 24 }} onClick={handleRegisterClick}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;