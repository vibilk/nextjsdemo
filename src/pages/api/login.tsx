import type { NextApiRequest, NextApiResponse } from 'next';

// The handler function to process the incoming request
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is POST
  if (req.method === 'POST') {
    // Destructure username and password from the request body
    const { username, password } = req.body;

    try {
      // Make a POST request to the dummyjson API for login
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Send username and password in the request body
      });

      // If the response is not ok (status code not in the range 200-299), throw an error
      if (!response.ok) {
        throw new Error('Login failed');
      }

      // Parse the response data as JSON
      const data = await response.json();
      // Send the parsed data back to the client with a 200 status code
      res.status(200).json(data); 
    } catch (error) {
      // If there is an error, send a 401 status code with an error message
      res.status(401).json({ message: 'Invalid username or password' }); 
    }
  } else {
    // If the request method is not POST, set the Allow header to ['POST']
    res.setHeader('Allow', ['POST']);
    // Send a 405 status code indicating the method is not allowed
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
