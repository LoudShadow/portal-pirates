import { motion, useSpring, useTransform } from "framer-motion";
import React from "react";

interface AnimatedCounterProps {
  from: number;
  to: number;
}

export function AnimatedCounter({ from, to }: AnimatedCounterProps) {
  const value = useSpring(from, { stiffness: 100, damping: 30 });
  const displayValue = useTransform(value, (latest) => Math.round(latest));

  React.useEffect(() => {
    value.set(to);
  }, [value, to]);

  return <motion.span>{displayValue}</motion.span>;
}