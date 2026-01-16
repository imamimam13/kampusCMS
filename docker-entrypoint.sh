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

echo "Running database seeding..."
su-exec nextjs npx -y tsx prisma/seed.ts

# Start the application (as nextjs user)
echo "Starting application..."
exec su-exec nextjs "$@"
