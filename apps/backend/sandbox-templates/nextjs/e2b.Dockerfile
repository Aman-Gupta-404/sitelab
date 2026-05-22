# Getting the debian based node image
FROM node:21-slim

# install curl
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# install dependencies and customize sandbox
WORKDIR /home/user/nextjs-app

RUN npx --yes create-next-app@15.3.3 . --yes

RUN npx --yes shadcn@2.6.3 init --yes -b neutral --force

RUN npx --yes shadcn@2.6.3 add --all --yes

# Install required dependencies for cn
RUN npm install clsx tailwind-merge

# Ensure lib directory exists
RUN mkdir -p lib

# Copy cn utility file
COPY utils.ts /home/user/nextjs-app/lib/utils.ts

# 🔍 Debug (optional but useful)
RUN ls -R lib

# Install correct animation plugin
RUN npm install tailwindcss-animate

# Fix broken references
RUN sed -i 's/tw-animate-css/tailwindcss-animate/g' tailwind.config.* || true
RUN sed -i '/tw-animate-css/d' app/globals.css || true

# Move the next js app to the home directory and remove the next js directory
RUN mv /home/user/nextjs-app/* /home/user && rm -rf /home/user/nextjs-app
