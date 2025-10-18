#
# --- THIS IS THE DIRECT FIX FOR YOUR CURRENT DOCKERFILE ---
# The main change is using `pnpm prisma generate` instead of `npx prisma generate`.
#

FROM node:20-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm install -g tsx


# Prevent Prisma from running automatically during install. This is correct.
# ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Copy manifest and Prisma schema before install to leverage Docker layer caching
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Install ALL dependencies (including dev dependencies, which are needed for Prisma)
# Using --frozen-lockfile is a good practice for reproducible builds.
RUN pnpm install --frozen-lockfile --prod=false

ENV PATH="/app/node_modules/.bin:$PATH"

COPY prisma ./prisma

RUN npx prisma generate

# Copy the rest of your application source code
COPY . .

# Set a dummy database URL. This is only needed for the `generate` step and won't be used at runtime
# unless you fail to provide a real one. This is also correct.

# --- THE FIX ---
# Use `pnpm` to run the prisma command. It knows exactly where to find the executable.


# Build the project (e.g., Next.js build)

EXPOSE 5000

# Start the application
CMD ["pnpm", "dev"]
