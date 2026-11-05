FROM mcr.microsoft.com/playwright:v1.49.1-jammy

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev 2>/dev/null || npm install --omit=dev
COPY src ./src
COPY scripts ./scripts
ENV PORT=3099
ENV PLAYWRIGHT_HEADLESS=0
EXPOSE 3099
CMD ["sh", "-c", "xvfb-run --auto-servernum --server-args='-screen 0 1400x900x24' node src/server.js"]
