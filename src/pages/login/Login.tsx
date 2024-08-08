import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Home.module.css'; // Importing CSS module for styling
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function Login() {
  // State variables for username, password, and error message
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const router = useRouter(); // Next.js router for navigation

  // Handler function for form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    debugger; // Breakpoint for debugging
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Send a POST request to the /api/login endpoint with the username and password
      const response = await fetch('/api/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Send username and password in the request body
      });

      // If the response is not ok, throw an error
      if (!response.ok) {
        throw new Error('Login failed');
      }

      // Parse the response data as JSON
      const data = await response.json();
      // Navigate to the dashboard page upon successful login
      router.push('/dashboard'); 
    } catch (error) {
      // If there is an error, set the error message state
      setError('Invalid username or password');
      console.error(error); // Log the error to the console
    }
  };

  return (
    <div className={styles.Logincontainer}> {/* Container div with a custom class for styling */}
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if there is any */}

      <form onSubmit={handleSubmit}> {/* Form element with onSubmit handler */}
        <div className={styles.FormInput}> {/* Input container div with a custom class for styling */}
          <TextField
            type="text"
            id="username"
            value={username}
            label="Username"
            variant="outlined"
            className={styles.MuiFormControlroot}             // {/* Custom class for styling MUI TextField */}
            onChange={(e) => setUsername(e.target.value)}     //  {/* Update username state on change */}
            required
          />
        </div>
        <div className={styles.FormInput}> {/* Input container div with a custom class for styling */}
          <TextField
            type="password"
            id="password"
            value={password}
            label="Password"
            variant="outlined"
            className={styles.MuiFormControlroot}             // {/* Custom class for styling MUI TextField */}
            onChange={(e) => setPassword(e.target.value)}       // {/* Update password state on change */}
            required
          />
        </div>
        <Button type="submit" variant="contained"> {/* MUI Button for form submission */}
          Login
        </Button>
      </form>
    </div>
  );
}

export default Login;
