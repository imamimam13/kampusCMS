#!/bin/sh
set -e

# Run migrations
# Fix permissions for uploads directory (mounted volume)
echo "Fixing permissions for /app/public/uploads..."
mkdir -p /app/public/uploads
chown -R nextjs:nodejs /app/public/uploads
chown -R nextjs:nodejs /app/.next

# Run migrations (as nextjs user)
echo "Runnning database migrations..."
su-exec nextjs npx prisma@6 migrate deploy

# echo "Running database seeding..."
# su-exec nextjs npx -y tsx prisma/seed.ts

# Start the application (as nextjs user)
# Start the application (as nextjs user)
echo "Starting application..."

# HARDENING: Nuclearing the shell to prevent RCE
# We delete common shells and downloaders so attackers have no tools.
# This runs AFTER migrations (which need shell) but BEFORE the app starts.
echo "Running Self-Destruct on Shell Binaries..."
rm -f /bin/sh /bin/ash /usr/bin/wget /usr/bin/curl /usr/bin/nc

exec su-exec nextjs "$@"
