import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    passwd: '',
    confirmPass: '',
    mobile: '',
    role: 'admin', // fixed as admin
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.passwd !== form.confirmPass) {
      return setError("Passwords don't match");
    }

    try {
      const response = await axios.post('http://localhost:4000/users/signup', {
        name: form.name,
        email: form.email,
        passwd: form.passwd,
        mobile: form.mobile,
        role: form.role,
      });

      if (response.data.status === 'success') {
        alert('Admin registered successfully');
        navigate('/login');
      } else {
        setError(response.data.error || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during registration');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Admin Registration</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <div style={styles.passwordWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            name="passwd"
            value={form.passwd}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <span onClick={togglePasswordVisibility} style={styles.eyeIcon}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          name="confirmPass"
          value={form.confirmPass}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="tel"
          placeholder="Mobile"
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Register as Admin</button>

        <p style={{ marginTop: '10px' ,alignItems: 'center', textAlign: 'center' }}>
          Already an admin? <span style={styles.link} onClick={() => navigate('/login')}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default Register;

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    padding: '25px',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  input: {
    width: '99%',
    padding: '10px 12px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  link: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
    textAlign: 'center',
  },
  passwordWrapper: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    top: '30%',
    right: '10px',
    cursor: 'pointer',
  },
};
