// src/server.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
console.log('✅ Express, CORS, and body-parser loaded');
let chatRoutes;
try {
    chatRoutes = await import('./routes/chatRoutes.js'); // ✅ must use .js for ESM if importing dynamically
    console.log('✅ Chat routes loaded');
}
catch (err) {
    console.error('❌ Error importing chatRoutes:', err);
    process.exit(1); // Exit early so we know
}
const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());
app.use(bodyParser.json());
app.use('/api/chat', chatRoutes.default);
app.get('/', (req, res) => {
    res.send('✅ Oracle backend is running!');
});
app.listen(PORT, () => {
    console.log(`🚀 Oracle backend running on port ${PORT}`);
});
