import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => {
    res.json({ message: 'Oracle Routes Works' });
});
export default router;
