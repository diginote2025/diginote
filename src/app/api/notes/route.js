export function GET(request) {
  return new Response(JSON.stringify({ message: "Hello from API!" }), {
    status: 200,
  });
}
