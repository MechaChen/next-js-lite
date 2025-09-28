Bun.serve({
  async fetch() {
    return new Response("Not found", { status: 404 });
  },
  port: process.env.PORT || 8080,
});
