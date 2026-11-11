import { NextResponse, type NextRequest } from "next/server";

// Password gate for /admin. Username "lucky", password from ADMIN_PASSWORD in Vercel.
export function proxy(req: NextRequest) {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return new NextResponse("Admin is off. Set ADMIN_PASSWORD in Vercel.", { status: 503 });

  const header = req.headers.get("authorization") ?? "";
  if (header.startsWith("Basic ")) {
    const [user, ...rest] = atob(header.slice(6)).split(":");
    if (user === "lucky" && rest.join(":") === pass) return NextResponse.next();
  }
  return new NextResponse("Members only", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="The Lucky Mat admin", charset="UTF-8"' },
  });
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
