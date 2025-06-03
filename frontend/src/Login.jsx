import HomePage from './HomePage';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

function Login() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    React.useEffect(() => {
        const body = document.body;
        body.classList.add('fade-in');
        return () => {
            body.classList.remove('fade-in');
        };
    }, []);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const loginHandle = () => {
        const newErrors = {}
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Email-ul nu este in format valid';
        }
        setErrors(newErrors)

        if (Object.keys(newErrors).length !== 0) {
            return;
        }
        console.log(form)
        fetch('http://localhost:8081/api/auth/v1/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form)
        })
        .then(async response => {
            if (response.status !== 200) {
                const messageText = await response.text()
                alert(messageText)
                return;
            }
            const messageJson = await response.json()
            const data = {
                'email': form.email,
                'password': form.password,
                'accessToken': messageJson.accessToken
            }
            localStorage.setItem('values', JSON.stringify(data))
            if (messageJson.role === 'admin') {
                navigate("/admin")
            } else {
                navigate("/employee")
            }
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
                type="password"
                placeholder="Password"
                className="input-textbox"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && (
                <div className="error-message">{errors.password}</div>
            )}

            <button className="login-button" onClick={loginHandle}>
                Log In
            </button>
        </div>
    </div>
    );
}

export default Login;