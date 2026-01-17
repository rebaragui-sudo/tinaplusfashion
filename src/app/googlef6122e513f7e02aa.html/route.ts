export async function GET() {
  return new Response("google-site-verification: googlef6122e513f7e02aa.html", {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
