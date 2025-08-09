export async function GET() {
  const key = process.env.OPENAI_API_KEY;

  return Response.json({
    message: key ? "✅ Key detected" : "❌ Key not found",
    keyLength: key?.length || 0,
  });
}
