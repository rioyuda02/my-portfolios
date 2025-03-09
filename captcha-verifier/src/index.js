// Configure CORS headers
const corsHeaders = {
	'Access-Control-Allow-Origin': '*', // You may want to restrict this to your website's domain
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS request (preflight)
  function handleOptions() {
	return new Response(null, {
	  status: 204,
	  headers: corsHeaders,
	});
  }

  // Function to validate Turnstile token with Cloudflare
  async function validateTurnstileToken(token, secretKey) {
	const formData = new FormData();
	formData.append('secret', secretKey);
	formData.append('response', token);

	try {
	  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		body: formData,
	  });

	  return await result.json();
	} catch (error) {
	  console.error('Turnstile validation error:', error);
	  return { success: false, 'error-codes': ['validation-fetch-failed'] };
	}
  }

  async function handleRequest(request, env) {
	// Handle preflight requests
	if (request.method === 'OPTIONS') {
	  return handleOptions();
	}

	// Only allow POST requests
	if (request.method !== 'POST') {
	  return new Response(JSON.stringify({
		success: false,
		message: 'Method not allowed',
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
	  const body = await request.json();
	  const { token } = body;

	  const clientIP = request.headers.get('CF-Connecting-IP');

	  // Check if token exists
	  if (!token) {
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

	  // Validate token with Turnstile
	  const secretKey = TURNSTILE_SECRET_KEY;
	  const validation = await validateTurnstileToken(token, secretKey);

	  if (!validation.success) {
		// Token validation failed
		return new Response(JSON.stringify({
		  success: false,
		  message: 'Turnstile validation failed',
		  errors: validation['error-codes'],
		}), {
		  status: 400,
		  headers: {
			...corsHeaders,
			'Content-Type': 'application/json',
		  },
		});
	  }

	  // Token is valid
	  return new Response(JSON.stringify({
		success: true,
		message: 'Turnstile validation successful',
	  }), {
		status: 200,
		headers: {
		  ...corsHeaders,
		  'Content-Type': 'application/json',
		},
	  });

	} catch (error) {
	  // Handle any errors
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
  }

  // Export the handler function
  export default {
	async fetch(request, env) {
	  return handleRequest(request, env);
	},
  };
