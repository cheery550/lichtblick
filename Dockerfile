# Build stage
FROM node:22 AS build
WORKDIR /src
COPY . ./

RUN corepack enable
RUN yarn install --immutable

RUN yarn run web:build:prod

# Release stage
FROM caddy:2.5.2-alpine
WORKDIR /src
COPY --from=build /src/web/.webpack ./

EXPOSE 8080

COPY <<EOF /entrypoint.sh
# Optionally override the default layout with one provided via bind mount
mkdir -p /lichtblick
touch /lichtblick/default-layout.json
index_html=\$(cat index.html)
replace_pattern='/*LICHTBLICK_SUITE_DEFAULT_LAYOUT_PLACEHOLDER*/'
replace_value=\$(cat /lichtblick/default-layout.json)
index_html="\${index_html/"\$replace_pattern"/\$replace_value}"

# Inject API_URL from environment so the same image can be used in different environments (empty when unset)
api_url_escaped=\$(printf '%s' "\${API_URL:-}" | sed 's/\\\\/\\\\\\\\/g; s/"/\\\\"/g; s/&/\\\\&/g; s/#/\\\\#/g')
index_html=\$(echo "\$index_html" | sed "s#LICHTBLICK_SUITE_DEFAULT_API_URL_PLACEHOLDER#\$api_url_escaped#g")

echo "\$index_html" > index.html

# Continue executing the CMD
exec "\$@"
EOF

ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]
CMD ["caddy", "file-server", "--listen", ":8080"]
