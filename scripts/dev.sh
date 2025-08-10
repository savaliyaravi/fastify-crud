#!/bin/bash

# Development script for Fastify REST API

echo "🚀 Starting Fastify REST API in development mode..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp env.example .env
    echo "📝 Please edit .env file with your configuration before continuing."
    echo "   Required variables: MONGO_URI, JWT_SECRET"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if MongoDB is running (optional check)
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB might not be running. Please ensure MongoDB is started."
    echo "   You can start MongoDB with: sudo systemctl start mongod"
fi

echo "🔧 Starting development server..."
npm run dev
