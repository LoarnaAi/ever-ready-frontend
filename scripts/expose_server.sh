#!/bin/bash

PORT="${PORT:-3000}"

# Start tunnelmole in background
run_tunnel() {
  # Kill any existing tmole processes first
  pkill -f "tmole" 2>/dev/null

  # Start tmole via npx (uses local devDependency)
  npx tmole $PORT &
  TMOLE_PID=$!

  echo "tunnelmole started (PID: $TMOLE_PID)"
  echo "Press Ctrl+C to stop"

  # Wait for the process
  wait $TMOLE_PID
}

# Stop all tunnelmole processes
stop_tunnel() {
  if pkill -f "tmole"; then
    echo "tunnelmole processes stopped"
  else
    echo "No tunnelmole processes found"
  fi
}

# Main
case "$1" in
  --run)
    run_tunnel
    ;;
  --stop)
    stop_tunnel
    ;;
  *)
    echo "Usage: $0 [--run|--stop]"
    echo "  --run   Start tunnelmole on port $PORT"
    echo "  --stop  Stop all tunnelmole processes"
    exit 1
    ;;
esac
