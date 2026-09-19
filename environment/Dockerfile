# environment/Dockerfile
#
# The app-runner image: the OS + language TOOLCHAIN the app needs. Source is
# bind-mounted at /workspace at run time (see docker-compose.yml), so this
# image holds tools, not code. Mirrors the web_craft sibling layout.
#
# Pin versions. Commit the lockfile (package-lock.json). Determinism matters.

FROM node:22-slim

# node:22-slim already ships node, npm, corepack, and bash, and node bundles
# its own CA store, so npm over HTTPS works with no extra OS packages. No
# apt here: a build-time apt-get hard-fails on locked-down eval substrates
# behind an HTTPS-only proxy. The Next.js app needs nothing else.
RUN corepack enable

WORKDIR /workspace

# Container-internal front door. Keep in sync with [app].port in app.toml.
EXPOSE 3000

# The app-runner idles; the harness drives the lifecycle (setup/build/start
# from app.toml) via `docker compose exec`. App start lives in app.toml, not
# here.
CMD ["bash", "-lc", "sleep infinity"]
