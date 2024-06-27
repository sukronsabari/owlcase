/**
 * NOTES:
 * Saat ini terdapat bug dari prisma saat berjalan di edge runtime dengan adapter neon.
 * Middleware ini berfungsi untuk membuat session tetap hidup ketika session sudah expired
 * (autorefresh session). Namun saat ini kita tidak menggunakan middleware karena bug dari prisma
 * tersebut yang dimana sesi tidak akan diperbarui ketika sudah berakhir
 * (30 hari kemudian (default session) user akan otomatis di logout)
 */
// export { auth as middleware } from "@/auth";
