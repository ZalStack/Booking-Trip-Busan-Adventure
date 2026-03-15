import jwt from "jsonwebtoken";
import { query } from "./db";

/**
 * Ambil token dari request headers cookie
 */
export function getTokenFromRequest(request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const tokenCookie = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("admin_token="));
  if (!tokenCookie) return null;

  return tokenCookie.split("=")[1];
}

/**
 * Verifikasi admin berdasarkan token JWT
 */
export async function verifyAdmin(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return false;

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified.id) return false;

    const admins = await query("SELECT id FROM admins WHERE id = ?", [verified.id]);
    if (admins.length === 0) return false;

    return verified;
  } catch (error) {
    console.error("Verify admin error:", error);
    return false;
  }
}

/**
 * Ambil info admin dari token
 */
export async function getAdminInfo(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return null;

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified.id) return null;

    const admins = await query(
      "SELECT id, username, created_at, updated_at FROM admins WHERE id = ?",
      [verified.id]
    );

    if (admins.length === 0) return null;

    return admins[0];
  } catch (error) {
    console.error("Get admin info error:", error);
    return null;
  }
}