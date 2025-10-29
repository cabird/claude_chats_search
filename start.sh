#!/bin/bash

# Simple startup script for Claude Conversations Search

PORT=${1:-5000}

echo "Starting Claude Conversations Search on port $PORT..."
echo "Open your browser to: http://localhost:$PORT"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 app.py -p $PORT
