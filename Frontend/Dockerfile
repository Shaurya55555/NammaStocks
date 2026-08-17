FROM node:20-alpine

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install packages
RUN npm install

# Copy application source code
COPY . .

EXPOSE 5173

# Start development server on port 5173 listening on all network interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
