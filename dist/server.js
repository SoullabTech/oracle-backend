import 'dotenv/config';
import 'tsconfig-paths/register';
import app from './app';
import util from 'node:util';
import logger from './utils/logger';
const PORT = Number(process.env.PORT) || 3005;
// ─── Global Error Handlers ───────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, util.inspect(reason, { depth: null, colors: true }));
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.stack || err);
});
process.on('SIGINT', () => {
    console.log('🛑 Gracefully shutting down (SIGINT)...');
    process.exit();
});
// ─── Start Server ────────────────────────────────────────────────
const server = app.listen(PORT, () => {
    logger.info(`🚀 Oracle backend listening on http://localhost:${PORT}`);
});
// ─── Nodemon Restart Hook ────────────────────────────────────────
process.once('SIGUSR2', () => {
    console.log('🔄 Nodemon restart detected – closing HTTP server...');
    server.close(() => {
        process.kill(process.pid, 'SIGUSR2');
    });
});
