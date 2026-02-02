# How to Get the Vercel Build Log (to Fix Deployment Errors)

When a deployment shows **Error**, you need the **Build Log** to see why.

## Steps

1. **Vercel** → your project **creatorflow365** → **Deployments**.
2. Click the **failed deployment** (e.g. the top one with status **Error**).
3. On the deployment page, find the **Build Logs** section (or **Logs** / **Building**).
4. Expand it and scroll to the **bottom** — the failure is usually the last red/error line.
5. Copy the **exact error line(s)** (e.g. `Error: ...` or `Type error: ...` or `Command "npm run build" exited with 1` and the few lines above it).

Paste that here (or in the chat) so we can fix the real cause. Without the log, we can only guess (e.g. Node version, missing env, or a Vercel-specific step failing).
