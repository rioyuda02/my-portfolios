// worker.js for Cloudflare Worker

// Configure CORS headers to allow requests from any origin (you may want to restrict this in production)
const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handler for OPTIONS requests (CORS preflight)
  function handleOptions() {
	return new Response(null, {
	  status: 204,
	  headers: corsHeaders,
	});
  }

  // Function to validate the Turnstile token
  async function validateTurnstileToken(token, secretKey) {
	// Create form data for the verification request
	const formData = new FormData();
	formData.append('secret', secretKey);
	formData.append('response', token);

	try {
	  // Make the request to Cloudflare's verification endpoint
	  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		body: formData,
	  });

	  // Parse and return the result
	  return await response.json();
	} catch (error) {
	  console.error('Turnstile validation error:', error);
	  return {
		success: false,
		'error-codes': ['validation-fetch-failed']
	  };
	}
  }

  // Main worker handler
  export default {
	async fetch(request, env, ctx) {
	  // Log the request method for debugging
	  console.log('Request method:', request.method);

	  // Handle CORS preflight requests
	  if (request.method === 'OPTIONS') {
		return handleOptions();
	  }

	  // Only process POST requests
	  if (request.method !== 'POST') {
		return new Response(JSON.stringify({
		  success: false,
		  message: `Method ${request.method} not allowed. Only POST is accepted.`,
		}), {
		  status: 405,
		  headers: {
			...corsHeaders,
			'Content-Type': 'application/json',
			'Allow': 'POST, OPTIONS',
		  },
		});
	  }

	  try {
		// Parse the request body
		const body = await request.json();

		// Log the received token for debugging (omit in production)
		console.log('Received token:', body.token ? 'Present' : 'Missing');

		// Check if token exists
		if (!body.token) {
		  return new Response(JSON.stringify({
			success: false,
			message: 'Missing Turnstile token',
		  }), {
			status: 400,
			headers: {
			  ...corsHeaders,
			  'Content-Type': 'application/json',
			},
		  });
		}

		// Get the secret key from environment variables
		const secretKey = env.TURNSTILE_SECRET_KEY;

		// Ensure secret key is configured
		if (!secretKey) {
		  return new Response(JSON.stringify({
			success: false,
			message: 'Server configuration error: Missing secret key',
		  }), {
			status: 500,
			headers: {
			  ...corsHeaders,
			  'Content-Type': 'application/json',
			},
		  });
		}

		// Validate the token
		const validation = await validateTurnstileToken(body.token, secretKey);

		// Return the validation result
		return new Response(JSON.stringify({
		  success: validation.success,
		  message: validation.success ? 'Verification successful' : 'Verification failed',
		  errors: validation['error-codes'],
		}), {
		  status: validation.success ? 200 : 400,
		  headers: {
			...corsHeaders,
			'Content-Type': 'application/json',
		  },
		});
	  } catch (error) {
		// Handle any errors
		console.error('Worker error:', error);
		return new Response(JSON.stringify({
		  success: false,
		  message: 'Server error: ' + error.message,
		}), {
		  status: 500,
		  headers: {
			...corsHeaders,
			'Content-Type': 'application/json',
		  },
		});
	  }
	},
  };
