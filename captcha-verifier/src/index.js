// worker.js

// Configure CORS headers
const corsHeaders = {
	'Access-Control-Allow-Origin': '*', // Or specify your domain
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

  async function validateTurnstileToken(token, secretKey, ip) {
	const formData = new FormData();
	formData.append('secret', secretKey);
	formData.append('response', token);
	if (ip) formData.append('remoteip', ip);

	const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
	  method: 'POST',
	  body: formData,
	});

	return await result.json();
  }

  async function handleRequest(request, env) {
	// Handle preflight requests
	if (request.method === 'OPTIONS') {
	  return handleOptions();
	}

	if (request.method !== 'POST') {
	  return new Response('Method not allowed', {
		status: 405,
		headers: {
		  ...corsHeaders,
		  'Allow': 'POST, OPTIONS',
		},
	  });
	}

	try {
	  // Parse request body
	  const body = await request.json();
	  const { turnstileToken, ...formData } = body;

	  // Get client IP (optional)
	  const clientIP = request.headers.get('CF-Connecting-IP');

	  if (!turnstileToken) {
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
	  const validation = await validateTurnstileToken(
		turnstileToken,
		TURNSTILE_SECRET_KEY, // Set in your Worker environment variables
		clientIP
	  );

	  if (!validation.success) {
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

	  // Token is valid, process form submission
	  // Add your form processing logic here
	  // For example, send an email, store in database, etc.

	  return new Response(JSON.stringify({
		success: true,
		message: 'Form submitted successfully',
	  }), {
		status: 200,
		headers: {
		  ...corsHeaders,
		  'Content-Type': 'application/json',
		},
	  });

	} catch (error) {
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

  export default {
	async fetch(request, env, ctx) {
	  return handleRequest(request, env);
	},
  };
