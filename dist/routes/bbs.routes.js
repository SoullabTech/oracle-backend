// File: /src/routes/bbs.routes.ts
// Layer: 🌐 Backend — Living BBS: Symbolic Thread + Ritual Exchange
import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { AppError, ValidationError } from '@/utils/errors';
import { v4 as uuidv4 } from 'uuid';
const router = Router();
let posts = []; // Temporary in-memory storage (replace with DB later)
router.use(authenticate);
// ✍️ Create a new symbolic thread post
router.post('/post', (req, res) => {
    try {
        const { title, content, symbol, element, ritual, phase, tags } = req.body;
        if (!title || !symbol)
            throw new ValidationError('Title and symbol are required');
        const newPost = {
            id: uuidv4(),
            authorId: req.user.id,
            title,
            content,
            symbol,
            element,
            ritual,
            phase,
            tags: tags || [],
            createdAt: new Date().toISOString(),
            replies: [],
        };
        posts.push(newPost);
        res.json({ success: true, post: newPost });
    }
    catch (err) {
        console.error('❌ Error posting to BBS:', err);
        res.status(500).json({ error: 'Failed to create post' });
    }
});
// 💬 Reply to an existing thread
router.post('/reply/:postId', (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const authorId = req.user.id;
        const post = posts.find((p) => p.id === postId);
        if (!post)
            throw new AppError('Post not found', 404);
        const reply = {
            id: uuidv4(),
            authorId,
            content,
            createdAt: new Date().toISOString(),
        };
        post.replies.push(reply);
        res.json({ success: true, reply });
    }
    catch (err) {
        console.error('❌ Error replying to BBS post:', err);
        res.status(500).json({ error: 'Failed to post reply' });
    }
});
// 📜 Fetch all posts (optionally filter by symbol or element)
router.get('/posts', (req, res) => {
    const { symbol, element } = req.query;
    let filtered = posts;
    if (symbol)
        filtered = filtered.filter((p) => p.symbol === symbol);
    if (element)
        filtered = filtered.filter((p) => p.element === element);
    res.json({ success: true, posts: filtered });
});
export default router;
