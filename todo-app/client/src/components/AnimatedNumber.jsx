import { useEffect, useState } from 'react';
import { useMotionValue, animate } from 'framer-motion';

export default function AnimatedNumber({ value }) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.6, ease: 'easeOut' });
    const unsub = mv.on('change', (v) => setDisplay(Math.round(v)));
    return () => { controls.stop(); unsub(); };
  }, [value]);

  return <span>{display}</span>;
}
