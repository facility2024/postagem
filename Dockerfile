# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml* package-lock.json* ./

# Instalar dependências
RUN pnpm install --frozen-lockfile || npm install

# Copiar todo o código fonte
COPY . .

# Definir variáveis de ambiente para o build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_APP_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_APP_URL=$VITE_APP_URL

# Executar o build
RUN pnpm build || npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos estáticos do estágio de build
COPY --from=builder /app/dist /app/dist

# Garantir permissões de leitura
RUN chmod -R 755 /app/dist

# Expor a porta 3000
EXPOSE 3000

# Health check simples
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
