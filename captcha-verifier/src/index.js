export default {
	async fetch(request, env, ctx) {
	  try {
		const url = new URL(request.url);

		// Handle favicon.ico to avoid errors
		if (url.pathname === "/favicon.ico") {
		  return new Response(null, { status: 204 });
		}

		if (request.method === "GET") {
		  return new Response(JSON.stringify({ message: "Worker is running!" }), {
			headers: { "Content-Type": "application/json" },
		  });
		}

		if (request.method !== "POST") {
		  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
		}

		const { token } = await request.json();
		if (!token) return new Response(JSON.stringify({message: "Token is Missing"}));

		// Call Cloudflare Turnstile API
		const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
			method: "POST",
			headers: {
			  "Content-Type": "application/json"
			},
			body: JSON.stringify({
			  secret: env.TURNSTILE_SECRET,
			  response: token,
			  remoteip: request.headers.get("CF-Connecting-IP"), // Optional but recommended
			}),
		  });


		const data = await response.json();
		console.log("Turnstile API response:", data);

		return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });

	  } catch (error) {
		console.error("Worker Error:", error.message);
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	  }
	},
  };
