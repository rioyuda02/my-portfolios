const SECRET_KEY = TURNSTILE_SECRET;

async function handlePost(request) {
  // Add CORS headers to all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://rioyudayanto.web.id',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };

  try {
    const body = await request.formData();
    const token = body.get('cf-turnstile-response');
    const ip = request.headers.get('CF-Connecting-IP');

    if (!token) {
      return new Response(JSON.stringify({
        message: "Missing Turnstile token"
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    // Add error handling for the fetch request
    let result;
    try {
      result = await fetch(url, {
        body: JSON.stringify({
          secret: SECRET_KEY,
          response: token,
          remoteip: ip
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!result.ok) {
        throw new Error(`Turnstile verification failed with status: ${result.status}`);
      }
    } catch (error) {
      return new Response(JSON.stringify({
        message: "Verification service error",
        error: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const outcome = await result.json();

    if (outcome.success) {
      return new Response(JSON.stringify({
        message: "Running Authentication",
        success: true
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } else {
      return new Response(JSON.stringify({
        message: "Verification failed",
        error: outcome
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      message: "Error processing request",
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Handle all HTTP requests
async function handleRequest(request) {
  // Add CORS headers to all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://rioyudayanto.web.id',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  } else if (request.method === 'POST') {
    return handlePost(request);
  } else {
    return new Response('This worker only accepts POST requests', {
      status: 405,
      headers: {
        'Content-Type': 'text/plain',
        ...corsHeaders
      }
    });
  }
}

// Register the event listener
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
