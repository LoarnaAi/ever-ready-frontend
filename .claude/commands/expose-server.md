# Expose Server Command

Expose the local development server via tunnelmole and display the public URL.

## Instructions

1. First, check if the Next.js dev server is running on port 3000:
   ```bash
   lsof -i :3000 | grep LISTEN
   ```

2. If the server is NOT running, start it in the background:
   ```bash
   cd /home/basal/repos/ever-ready-frontend && npm run dev &
   ```
   Wait a few seconds for it to start.

3. Stop any existing tunnelmole processes:
   ```bash
   pkill -f "tmole" 2>/dev/null
   ```

4. Start tunnelmole in the background and capture the URL:
   ```bash
   npx tmole 3000
   ```

5. Display the public URL to the user prominently so they can access the server externally.

**Important**: Always run tunnelmole in the foreground initially to capture and display the URL, then the user can background it if needed.
