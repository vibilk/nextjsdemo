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
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const result = await response.json();
      console.log('Login successful:', result); // Log the result for debugging
      localStorage.setItem('authToken', result.token);
      router.push('/dashboard');
    } catch (error) {
      toast.error('Invalid username or password');
      console.error('Error during login:', error); // Log error details
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
