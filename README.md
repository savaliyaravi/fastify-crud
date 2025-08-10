## Fastify REST API (TypeScript)

A minimal Fastify REST API using TypeScript, MongoDB (Mongoose), JWT auth, Zod validation, and Swagger docs.

### Requirements
- Node.js 16+
- MongoDB (local or cloud)

### Setup
```bash
cp env.example .env
# Set at least MONGO_URI and JWT_SECRET in .env
npm install
```

### Run
- Development: `npm run dev`
- Production: `npm run build && npm start`

### Environment variables
- PORT (default: 3000)
- MONGO_URI (required)
- JWT_SECRET (required)
- JWT_EXPIRY (default: 1h)
- API_PREFIX (default: /api)

### API
- Base: http://localhost:3000
- Docs: http://localhost:3000/docs
- Health: http://localhost:3000/health

### Scripts
- `npm run dev`, `npm run build`, `npm start`, `npm run lint`, `npm run format`, `npm test`

### License
MIT
