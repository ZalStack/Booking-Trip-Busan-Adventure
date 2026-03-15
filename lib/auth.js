import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { query } from "./db";

export async function verifyAdmin(request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return false;

    const tokenCookie = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("admin_token="));

    if (!tokenCookie) return false;

    const tokenValue = tokenCookie.split("=")[1];

    const verified = jwt.verify(tokenValue, process.env.JWT_SECRET);
    if (!verified.id) return false;

    const admins = await query("SELECT id FROM admins WHERE id = ?", [
      verified.id,
    ]);
    if (admins.length === 0) return false;

    return verified;
  } catch (error) {
    console.error("Verify admin error:", error);
    return false;
  }
}

export async function getAdminInfo() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("admin_token");

    if (!token?.value) return null;

    const verified = jwt.verify(token.value, process.env.JWT_SECRET);

    if (!verified.id) return null;

    const admins = await query(
      "SELECT id, username, created_at, updated_at FROM admins WHERE id = ?",
      [verified.id],
    );

    if (admins.length === 0) {
      return null;
    }

    return admins[0];
  } catch (error) {
    console.error("Get admin info error:", error);
    return null;
  }
}
