import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef, type CSSProperties } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = text.split(' ');
  const total = text.length;
  let offset = 0;

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, wi) => {
        const wordStart = offset;
        offset += word.length + 1;
        return (
          <span key={wi}>
            <span className="inline-block">
              {word.split('').map((char, ci) => (
                <AnimatedChar
                  key={ci}
                  char={char}
                  progress={scrollYProgress}
                  start={(wordStart + ci) / total}
                  end={(wordStart + ci + 1) / total}
                />
              ))}
            </span>
            {wi < words.length - 1 ? ' ' : null}
          </span>
        );
      })}
    </p>
  );
}

interface AnimatedCharProps {
  char: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}

function AnimatedChar({ char, progress, start, end }: AnimatedCharProps) {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return (
    <span className="relative inline-block">
      <span className="invisible">{char}</span>
      <motion.span className="absolute inset-0" style={{ opacity }}>
        {char}
      </motion.span>
    </span>
  );
}
