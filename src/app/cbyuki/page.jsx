"use client";
import Image from "next/image";
import styles from "./cbyuki.module.css";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ToastProvider";
import confetti from "canvas-confetti";
import { motion } from "motion/react";

export default function cbYuki() {
  const { showToast } = useToast();
  const noBtnRef = useRef(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const noBtn = noBtnRef.current;
    if (!noBtn) return;

    const moveButton = () => {
      noBtn.style.position = "absolute";
      noBtn.style.top = Math.random() * 80 + "vh";
      noBtn.style.left = Math.random() * 80 + "vw";
    };

    noBtn.addEventListener("mouseenter", moveButton);

    return () => {
      noBtn.removeEventListener("mouseenter", moveButton);
    };
  }, []);

  const handleClick = async () => {
    try {
      const res = await fetch("/api/send-yes-message", { method: "POST" });
      if (res.ok) {
        showToast(
          "Окей, настроен на режим Daily Compliment 😎 Ты самая лучшая!",
          "success"
        );
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 } });
        setTimeout(() => {
          confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
        }, 500);
      } else {
        showToast("Ошибка отправки 😢", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Ошибка сети 😢", "error");
    }
  };

  const lines = [
    "   ________   _________  __        __  __      __   __     __   __ ",
    "  /   _____| |    __   \\ \\ \\      / / |  |    |  | |  |  /  /  |  |",
    " /   /       |   |__|  |  \\ \\    / /  |  |    |  | |  | /  /   |  |",
    "|   /        |         /   \\ \\  / /   |  |    |  | |  |/  /    |  |",
    "|  |         |    __   \\    \\ \\/ /    |  |    |  | |  |\\  \\    |  |",
    "|   \\        |   |  |   |    |  |     |  |    |  | |  | \\  \\   |  |",
    " \\   \\_____  |   |__|   |    |  |     |  |____|  | |  |  \\  \\  |  |",
    "  \\________| |_________/     |__|      \\________/  |__|   \\__\\ |__| ",
  ];

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.modal}>
          {step == 1 ? (
            <>
              <button onClick={() => setStep(2)}>Нажми</button>
            </>
          ) : (
            <>
            <div className={styles.rowText}>
              <motion.pre
                initial="hidden"
                animate="visible"
                className={styles.text}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}>
                {lines.map((line, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                    transition={{ duration: 1 }}>
                    {line}
                  </motion.div>
                ))}
              </motion.pre>
            </div>
            </>
          )}
          {/* <div className={styles.row}>
            <button ref={noBtnRef}>Нет</button>
            <button onClick={handleClick}>Да</button>
          </div> */}
        </div>
      </div>
    </>
  );
}
