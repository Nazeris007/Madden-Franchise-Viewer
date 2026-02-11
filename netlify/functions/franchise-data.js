// Netlify Function to receive Madden franchise data from companion app

exports.handler = async (event, context) => {
  // Set CORS headers to allow requests from companion app
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Handle POST request (data from Madden app)
  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body);
      
      // Store data in environment variable or external storage
      // For now, we'll use a simple cloud storage service
      
      // You'll need to set up a free Firebase/Supabase account
      // Or use the localStorage approach on the frontend
      
      const STORAGE_URL = process.env.STORAGE_URL; // Will be set in Netlify
      const STORAGE_KEY = process.env.STORAGE_KEY;
      
      if (STORAGE_URL) {
        // Send to external storage (e.g., JSONBin, Firebase)
        const response = await fetch(STORAGE_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': STORAGE_KEY || ''
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error('Failed to store data');
        }
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Franchise data received and stored!',
          timestamp: new Date().toISOString()
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: error.message 
        })
      };
    }
  }

  // Handle GET request (fetch data for website)
  if (event.httpMethod === 'GET') {
    try {
      const STORAGE_URL = process.env.STORAGE_URL;
      const STORAGE_KEY = process.env.STORAGE_KEY;
      
      if (!STORAGE_URL) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ 
            success: false, 
            message: 'No data available yet' 
          })
        };
      }
      
      // Fetch from external storage
      const response = await fetch(STORAGE_URL, {
        headers: {
          'X-Master-Key': STORAGE_KEY || ''
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: error.message 
        })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
