#!/bin/sh
set -e

# Generate runtime env JS for the SPA to read at runtime
cat > /usr/share/nginx/html/env-config.js <<EOF
window.__RUNTIME__ = {
  "SUPABASE_URL": "${SUPABASE_URL:-}",
  "SUPABASE_ANON_KEY": "${SUPABASE_ANON_KEY:-}",
  "VITE_API_URL": "${VITE_API_URL:-}"
};
EOF

# Inject env-config script tag into index.html if missing
if [ -f /usr/share/nginx/html/index.html ]; then
  if ! grep -q 'env-config.js' /usr/share/nginx/html/index.html; then
    sed -i "s|<head>|<head>\n  <script src=\"/env-config.js\"></script>|" /usr/share/nginx/html/index.html || true
  fi
fi

exec "$@"
