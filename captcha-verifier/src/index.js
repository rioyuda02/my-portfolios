const SECRET_KEY = TURNSTILE_SECRET;

function logDebug(message, data = {}) {
  console.log(`[DEBUG] ${message}`, data);
}

async function handlePost(request) {
  // Add CORS headers to all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://rioyudayanto.web.id',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };

  try {
    // Log request information
    logDebug("Received verification request", {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries([...request.headers])
    });
    // Try both formData and JSON handling
    let token;
    try {
      const body = await request.formData();
      token = body.get('cf-turnstile-response');
      logDebug("Parsed form data", { tokenExists: !!token });
    } catch (formError) {
      logDebug("Failed to parse as formData, trying JSON", { error: formError.message });
      try {
        const jsonBody = await request.json();
        token = jsonBody.token || jsonBody['cf-turnstile-response'];
        logDebug("Parsed JSON", { tokenExists: !!token });
      } catch (jsonError) {
        logDebug("Failed to parse as JSON", { error: jsonError.message });
        return new Response(JSON.stringify({
          message: "Invalid request format - could not parse body",
          success: false
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }

    const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || '127.0.0.1';
    logDebug("Client IP identified", { ip });

    if (!token) {
      logDebug("Missing token in request");
      return new Response(JSON.stringify({
        message: "Missing Turnstile token",
        success: false
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    let result;
    let retries = 2;
    let success = false;

    while (retries >= 0 && !success) {
      try {
        logDebug(`Verification attempt (${2-retries}/2)`);

        result = await fetch(url, {
          body: JSON.stringify({
            secret: SECRET_KEY,
            response: token,
            remoteip: ip
          }),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          cf: {
            cacheTtl: 0,  // Don't cache this request
            cacheEverything: false
          }
        });

        if (!result.ok) {
          logDebug(`HTTP error from Turnstile: ${result.status}`);
          if (retries > 0) {
            retries--;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between retries
            continue;
          }
          throw new Error(`Turnstile verification failed with status: ${result.status}`);
        }

        success = true;
      } catch (error) {
        logDebug(`Error during verification: ${error.message}`);
        if (retries > 0) {
          retries--;
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between retries
        } else {
          return new Response(JSON.stringify({
            message: "Verification service error",
            error: error.message,
            success: false
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
      }
    }

    const outcome = await result.json();
    logDebug("Turnstile verification result", outcome);

    if (outcome.success) {
      return new Response(JSON.stringify({
        message: "Verification successful",
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
        error: outcome,
        success: false
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  } catch (error) {
    logDebug("Unexpected error", { message: error.message, stack: error.stack });
    return new Response(JSON.stringify({
      message: "Error processing request",
      error: error.message,
      success: false
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

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
