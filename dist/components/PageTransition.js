import { jsx as _jsx } from "react/jsx-runtime";
// src/components/PageTransition.tsx
import { motion } from 'framer-motion';
export const PageTransition = ({ children }) => (_jsx(motion.div, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: { duration: 0.4, ease: 'easeOut' }, children: children }));
