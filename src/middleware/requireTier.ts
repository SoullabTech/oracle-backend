// File: /src/middleware/requireTier.ts
// Layer: 🔐 Middleware — Restricts access to backend routes by tier

const TIER_LEVELS = {
    explorer: 0,
    seeker: 1,
    adept: 2,
    master: 3,
  };
  
  export function requireTier(minTier) {
    return function (req, res, next) {
      const user = req.user;
      const currentLevel = TIER_LEVELS[user?.tier || 'explorer'];
      const requiredLevel = TIER_LEVELS[minTier];
  
      if (currentLevel < requiredLevel) {
        return res.status(403).json({ error: `This feature requires '${minTier}' access.` });
      }
  
      next();
    };
  }
  