#!/bin/sh
set -e

# Run migrations
echo "Runnning database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting application..."
exec "$@"
