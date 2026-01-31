const server = Bun.serve({
  port: 3000,
  fetch(req) {
    console.log('--- Incoming Request ---');
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log('Headers:', req.headers.toJSON());

    return new Response('Hello from your custom server!', {
      headers: { 'Content-Type': 'text/plain' },
    });
  },
});

console.log(`Server listening on ${server.url}`);