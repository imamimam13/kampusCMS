#!/bin/sh
set -e

# Run migrations
echo "Runnning database migrations..."
npx prisma@6 db push

# Start the application
echo "Starting application..."
exec "$@"
