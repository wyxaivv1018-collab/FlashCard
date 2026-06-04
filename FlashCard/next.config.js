/** @type {import('next').NextConfig} */
const nextConfig = {
  // SQLite requires a single process; ensure Prisma isn't bundled server-side
  serverExternalPackages: ["@prisma/client"],
};

module.exports = nextConfig;
