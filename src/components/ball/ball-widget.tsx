import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useDrag } from "react-use-gesture";

const BALL_SIZE = 36;
const CONTAINER_HEIGHT = 256;
const FLOOR_Y = CONTAINER_HEIGHT - BALL_SIZE;
const CEILING_Y = 0;
const WALL_LEFT = -100;
const WALL_RIGHT = 70;
const INITIAL_Y = CONTAINER_HEIGHT / 2;
const INITIAL_VELOCITY = {
  x: 0,
  y: 0,
};
const GRAVITY = 0.35;
const BOUNCE_RETENTION = 0.7;
const MAX_VELOCITY = 10;

const BallWidget = () => {
  const [clicks, setClicks] = useState(0);
  const [combo, setCombo] = useState(0);
  const lastClickTime = useRef(0);
  const controls = useAnimation();
  const velocity = useRef({ x: INITIAL_VELOCITY.x, y: INITIAL_VELOCITY.y });
  const ballRef = useRef<HTMLDivElement>(null);

  const resetCombo = () => setCombo(0);

  const handleBounce = (x: number, y: number) => {
    if (x <= WALL_LEFT || x >= WALL_RIGHT) {
      velocity.current.x *= -BOUNCE_RETENTION;
    }
    if (y >= FLOOR_Y) {
      velocity.current.y *= -BOUNCE_RETENTION;
    } else if (y <= CEILING_Y) {
      velocity.current.y = Math.abs(velocity.current.y) * BOUNCE_RETENTION;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastClickTime.current < 150) return;

    if (!ballRef.current) return;
    const ball = ballRef.current.getBoundingClientRect();
    const clickX = e.clientX - (ball.left + ball.width / 2);
    const clickY = e.clientY - (ball.top + ball.height / 2);

    const distance = Math.sqrt(clickX * clickX + clickY * clickY);
    if (distance > BALL_SIZE / 2) return;

    if (now - lastClickTime.current < 1000) {
      setCombo((prev) => prev + 1);
    } else {
      setCombo(1);
    }

    lastClickTime.current = now;
    setClicks((prev) => prev + 1);

    velocity.current.x += clickX * 0.1;
    velocity.current.y += clickY * -0.1;

    velocity.current.x = Math.max(
      Math.min(velocity.current.x, MAX_VELOCITY),
      -MAX_VELOCITY
    );
    velocity.current.y = Math.max(
      Math.min(velocity.current.y, MAX_VELOCITY),
      -MAX_VELOCITY
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      velocity.current.y += GRAVITY;
      velocity.current.x *= 0.99;

      let nextX = velocity.current.x;
      let nextY = velocity.current.y;

      handleBounce(nextX, nextY);

      controls.start({
        x: `calc(50% + ${nextX}px)`,
        y: nextY,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      });

      if (
        Math.abs(velocity.current.x) < 0.1 &&
        Math.abs(velocity.current.y) < 0.1
      ) {
        resetCombo();
      }
    }, 16);

    return () => clearInterval(interval);
  }, [controls]);

  const comboColor =
    combo > 10
      ? "text-red-500"
      : combo > 7
      ? "text-orange-500"
      : combo > 5
      ? "text-yellow-500"
      : combo > 3
      ? "text-green-500"
      : "text-violet-500";

  return (
    <div className="w-full h-64 relative overflow-hidden select-none">
      {/* score */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        {combo > 0 && (
          <div className={`text-2xl font-bold ${comboColor}`}>{combo}</div>
        )}
        <div className="text-sm text-muted-foreground">{clicks}</div>
      </div>

      {/* ball */}
      <motion.div
        ref={ballRef}
        animate={controls}
        initial={{ x: "50%", y: INITIAL_Y }}
        className="absolute left-1/2 -translate-x-1/2 will-change-transform cursor-pointer"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 dark:from-violet-300 dark:to-violet-500 shadow-lg">
          <div className="absolute inset-0 rounded-full border border-violet-300/30 dark:border-violet-400/30" />
        </div>
      </motion.div>
    </div>
  );
};

export default BallWidget;
