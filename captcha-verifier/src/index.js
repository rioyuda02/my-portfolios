const SECRET_KEY = TURNSTILE_SECRET;

async function handlePost(request) {
  const body = await request.formData();
  const token = body.get('cf-turnstile-response');
  const ip = request.headers.get('CF-Connecting-IP');

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const result = await fetch(url, {
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

  const outcome = await result.json();
  if (outcome.success) {
    return new Response(JSON.stringify({ message: "Running Authentication" }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } else {
    return new Response(JSON.stringify({
      message: "Verification failed",
      error: outcome
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Handle all HTTP requests
async function handleRequest(request) {
  if (request.method === 'POST') {
    return handlePost(request);
  } else {
    return new Response('This worker only accepts POST requests', { status: 405 });
  }
}

// Register the event listener
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
