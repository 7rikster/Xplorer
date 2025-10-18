# client/Dockerfile

# 1️⃣ Base image
FROM node:20-alpine AS builder

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy package files
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy rest of code
COPY . .

# 6️⃣ Build Next.js app
RUN npm run build

# 7️⃣ Run with a lightweight runtime image
FROM node:20-alpine AS runner
WORKDIR /app

# Copy built files from builder
COPY --from=builder /app ./

# Expose Next.js port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
