import { useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import { useState } from 'react';
import React from 'react';

function Register() {
    const [form, setForm] = useState({
        email: '',
        password: '',
        username: '',
        firstName: '',
        lastName: '',
        role: 'user',
    });

    const [errors, setErrors] = useState({});

    React.useEffect(() => {
        const body = document.body;
        body.classList.add('fade-in');
        return () => {
            body.classList.remove('fade-in');
        };
    }, []);

    const navigate = useNavigate();

    const registerHandle = () => {
        const newErrors = {}
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Email-ul nu este in format valid';
        }
        if (form.password.length < 8) {
            newErrors.password = 'Parola trebuie sa aiba minim 8 caractere';
        }
        setErrors(newErrors)
        if (Object.keys(newErrors).length !== 0) {
            return;
        }
        fetch('http://localhost:8081/api/auth/v1/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form)
        })
        .then(async response => {
            const messageText = await response.text()
            if (response.status !== 201) {
                alert()
                return;
            }
            const successBox = document.createElement('div');
            successBox.style.position = 'fixed';
            successBox.style.top = '50%';
            successBox.style.left = '50%';
            successBox.style.transform = 'translate(-50%, -50%)';
            successBox.style.background = '#fff';
            successBox.style.padding = '32px 48px';
            successBox.style.borderRadius = '12px';
            successBox.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
            successBox.style.fontSize = '1.3rem';
            successBox.style.fontWeight = 'bold';
            successBox.style.color = '#2e7d32';
            successBox.style.opacity = '0';
            successBox.style.transition = 'opacity 0.5s';

            successBox.innerText = 'You have registered successfully!';

            document.body.appendChild(successBox);

            setTimeout(() => {
                successBox.style.opacity = '1';
            }, 10);

            setTimeout(() => {
                successBox.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(successBox);
                    navigate(-1);
                    // navigate('/login'); // Uncomment if you want to redirect after animation
                }, 500);
            }, 2000);
            // navigate after to pages.
        })
        .catch(error => {
            console.error('Error:', error);
            // Optionally handle error (e.g., show error message)
        });
        return;
    }

    return (
    <div className="background-style">
        <div className='login-box'>
            <input
                type="email"
                placeholder="Email"
                className="input-textbox"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && (
                <div className="error-message">{errors.email}</div>
            )}

             <input
                type="text"
                placeholder="Username"
                className="input-textbox"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
                type="text"
                placeholder="First Name"
                className="input-textbox"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <input
                type="text"
                placeholder="Last Name"
                className="input-textbox"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />

            <input
                type="password"
                placeholder="Password"
                className="input-textbox"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && (
                <div className="error-message">{errors.password}</div>
            )}

            <button className="register-button" onClick={registerHandle}>
                Register
            </button>
        </div>
    </div>
    );
}

export default Register;