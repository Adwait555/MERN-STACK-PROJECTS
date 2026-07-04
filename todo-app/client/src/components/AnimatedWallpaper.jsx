import { motion } from 'framer-motion';

const blobs = [
  { size: 320, top: '5%', left: '8%', color: 'var(--wallpaper-c)', dur: 22 },
  { size: 380, top: '55%', left: '70%', color: 'var(--wallpaper-b)', dur: 26 },
  { size: 260, top: '75%', left: '15%', color: 'var(--wallpaper-c)', dur: 18 },
];

export default function AnimatedWallpaper() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: -1, pointerEvents: 'none' }} aria-hidden="true">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            background: b.color,
            filter: 'blur(70px)',
            opacity: 0.35,
          }}
          animate={{ x: [0, 40, -30, 0], y: [0, -40, 30, 0], scale: [1, 1.08, 0.95, 1] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
