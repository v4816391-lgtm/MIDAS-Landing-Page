---
name: Artifact workflow verification
description: Environment-specific checks for verifying separate web and API artifacts.
---

After changing a runnable API artifact, restart its configured workflow before testing endpoints; the already-running process does not load the new bundle. Manual Vite builds also require the artifact's required PORT and BASE_PATH environment values.

**Why:** Preview requests and direct localhost requests can otherwise exercise an older server or fail while loading the build configuration, producing misleading verification results.

**How to apply:** Restart the exact API workflow after backend changes, verify the browser-facing proxy path as well as the internal port, and run manual builds with the required artifact environment variables.