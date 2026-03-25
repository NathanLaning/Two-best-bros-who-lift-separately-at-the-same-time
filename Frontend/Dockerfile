FROM node:25-alpine3.22 AS builder
WORKDIR /app
COPY frontend/. .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install -g npm@11.12.0
RUN npm install
RUN npm run build

FROM node:25-alpine3.22 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN npm install -g npm@11.12.0
# non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
USER nextjs
EXPOSE 3000
CMD ["npm", "start"]