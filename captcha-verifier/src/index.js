export default {
	async fetch(request, env) {
	  const { token } = await request.json();
	  const secretKey = env.TURNSTILE_SECRET_KEY; // Get the secret from Cloudflare

	  const verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

	  const response = await fetch(verifyUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
		  secret: secretKey,
		  response: token,
		}),
	  });

	  const result = await response.json();
	  return new Response(JSON.stringify(result), {
		headers: { "Content-Type": "application/json" },
	  });
	},
  };
