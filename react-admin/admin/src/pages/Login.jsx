import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const Login = () => {
  const [email, setEmail] = useState('');
  const [passwd, setPasswd] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    debugger
    if (!email || !passwd) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/users/signin', {
        email,
        passwd,
      });

      if (response.data.status === 'success') {
        const { token, userId, userRole ,userName } = response.data.data;

        localStorage.setItem('Token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('role',userRole);
        localStorage.setItem('name',userName)

        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again.');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Admin Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <div style={styles.passwordWrapper}>
            <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                value={passwd}
                onChange={(e) => setPasswd(e.target.value)}
                style={styles.passwordInput}
            />
            <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            </div>
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.button}>Login</button>
          <p style={styles.registerText}>
            New here?{' '}
            <span style={styles.registerLink} onClick={() => navigate('/register')}>
                Register first
            </span>
            </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
  },
  container: {
    width: '100%',
    maxWidth: '400px',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    fontFamily: 'sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: '12px',
    marginBottom: '15px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px'
  },
  error: {
    color: 'red',
    marginBottom: '10px',
    fontSize: '14px'
  },
  passwordWrapper: {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '15px',
},
passwordInput: {
  flex: 1,
  padding: '12px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  paddingRight: '40px', // for space near icon
},
eyeIcon: {
  position: 'absolute',
  right: '10px',
  fontSize: '18px',
  color: '#555',
  cursor: 'pointer',
  userSelect: 'none'
},
registerText: {
  marginTop: '15px',
  fontSize: '14px',
  textAlign: 'center',
  color: '#555',
},
registerLink: {
  color: '#007bff',
  cursor: 'pointer',
  textDecoration: 'underline',
},
};

export default Login;
