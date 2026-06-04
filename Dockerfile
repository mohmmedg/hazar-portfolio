FROM node:20-alpine AS build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV=production

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_CONTACT_WHATSAPP
ARG VITE_CONTACT_EMAIL
ARG VITE_CONTACT_PHONE
ARG VITE_CONTACT_INSTAGRAM

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
  VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
  VITE_CONTACT_WHATSAPP=$VITE_CONTACT_WHATSAPP \
  VITE_CONTACT_EMAIL=$VITE_CONTACT_EMAIL \
  VITE_CONTACT_PHONE=$VITE_CONTACT_PHONE \
  VITE_CONTACT_INSTAGRAM=$VITE_CONTACT_INSTAGRAM

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM nginx:stable-alpine AS production
WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/health || exit 1

CMD ["nginx", "-g", "daemon off;"]