import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form'; // Importing react-hook-form for form handling
import { useRouter } from 'next/router'; // Importing Next.js router for navigation
import styles from '@/styles/Home.module.css'; // Importing CSS module for styling
import Button from '@mui/material/Button'; // Importing MUI Button component
import TextField from '@mui/material/TextField'; // Importing MUI TextField component
import { ToastContainer, toast } from 'react-toastify'; // Importing react-toastify for notifications
import 'react-toastify/dist/ReactToastify.css'; // Importing toastify CSS

// Interface for form input
interface IFormInput {
  username: string;
  password: string;
}

function Login() {
  // Initialize react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const router = useRouter(); // Initialize Next.js router

  // Handler function for form submission
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      // Send a POST request to the /api/login endpoint with form data
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Send form data in the request body
      });

      // If the response is not ok, throw an error
      if (!response.ok) {
        throw new Error('Login failed');
      }

      // Parse the response data as JSON
      const result = await response.json();
      localStorage.setItem('authToken', result.token); // Store token in localStorage
      router.push('/dashboard'); // Navigate to the dashboard page upon successful login
    } catch (error) {
      // Show an error toast notification if there is an error
      toast.error('Invalid username or password');
      console.error('Invalid username or password');
    }
  };

  return (
    <div className={styles.Logincontainer}> {/* Container div with a custom class for styling */}
      <ToastContainer /> {/* Toast container for showing notifications */}
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}> {/* Form with react-hook-form submission handler */}
        <div className={styles.FormInput}> {/* Input container div with a custom class for styling */}
          <TextField
            type="text"
            id="username"
            label="Username"
            variant="outlined"
            className={styles.MuiFormControlroot}             // {/* Custom class for styling MUI TextField */}
            {...register('username', { required: 'Username is required' })} // Register username field with validation rules
            error={!!errors.username} // Show error state if there are errors
            helperText={errors.username ? errors.username.message : ''} // Show error message if there are errors
          />
        </div>
        <div className={styles.FormInput}> {/* Input container div with a custom class for styling */}
          <TextField
            type="password"
            id="password"
            label="Password"
            variant="outlined"
            className={styles.MuiFormControlroot}             // {/* Custom class for styling MUI TextField */}
            {...register('password', { required: 'Password is required' })} // Register password field with validation rules
            error={!!errors.password} // Show error state if there are errors
            helperText={errors.password ? errors.password.message : ''} // Show error message if there are errors
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
