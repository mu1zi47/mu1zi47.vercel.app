'use client';
import Image from "next/image";
import Link from "next/link";
import styles from "./nav.module.css";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

const HIGHLIGHT_CLASS = "section-highlight";
let highlightTimeout;

// Скроллит к секции и на пару секунд подсвечивает её (как в Telegram при переходе к сообщению)
const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (!section) return;
  section.scrollIntoView();

  document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach((el) => el.classList.remove(HIGHLIGHT_CLASS));
  void section.offsetWidth; // перезапуск анимации при повторном клике на ту же секцию
  section.classList.add(HIGHLIGHT_CLASS);

  clearTimeout(highlightTimeout);
  highlightTimeout = setTimeout(() => section.classList.remove(HIGHLIGHT_CLASS), 2500);
};

const SECTION_IDS = ["about", "skills", "projects", "contacts"];

// Переход из навбара не добавляет #hash в ссылку, а если зашли по ссылке с #hash — убирает его
const goToSection = (id) => {
  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  scrollToSection(id);
};

export default function Nav() {
  const [modal, setModal] = useState(false);

  // Переход по ссылке вида /#contacts — скроллим к секции и подсвечиваем её
  useEffect(() => {
    const highlightFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (SECTION_IDS.includes(id)) scrollToSection(id);
    };

    // ждём, пока секции проявятся (stagger-анимация в page.jsx), иначе подсветка пройдёт по ещё прозрачной секции
    const timeout = setTimeout(highlightFromHash, 800);
    window.addEventListener("hashchange", highlightFromHash);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("hashchange", highlightFromHash);
    };
  }, []);

  return (
    <>
      <motion.nav initial={{height:50}} animate={modal ? {height:240} : {height:50}} exit={{height:50}} transition={{duration:0.2}} className={styles.navContainer}>
        <div className={styles.nav}>
          <Link href={'/'}><h1>mu1zi47</h1></Link>
          <div className={styles.navCenterButtons}>
            <button onClick={() => goToSection("about")}>
              <p>About</p>
            </button>
            <button onClick={() => goToSection("skills")}>
                <p>Skills</p>
            </button>
            <button onClick={() => goToSection("projects")}>
              <p>Projects</p>
            </button>
            <button onClick={() => goToSection("contacts")}>
              <p>Contacts</p>
            </button>
          </div>
          {/* <LanguageSwitcher /> */}
          <button onClick={() => setModal(!modal)} className={styles.burgerMenu}>
            <motion.div initial={{rotateX:0}} animate={modal ? {rotateX:180} : {rotateX:0}} exit={{rotate:0}} transition={{duration:0.2}}>
              <Image src={modal ? "/close.svg" : "/list.svg"} alt="list" width={20} height={20} className={styles.hover}/>
              <Image src={modal ? "/close2.svg" : "/list2.svg"} alt="list" width={20} height={20} className={styles.hovered}/>
            </motion.div>
          </button>
        </div>
        {modal ? (
          <motion.div initial={{y:-20}} animate={{y:0}} exit={{y:-20}} transition={{duration:0.2}} className={styles.adaptiveModalBox}>
            <button onClick={() => {setModal(false), setTimeout(() => {goToSection("about")}, 200)}}>
              <p>About</p>
            </button>
            <button onClick={() => {setModal(false), setTimeout(() => {goToSection("skills")}, 200)}}>
                <p>Skills</p>
            </button>
            <button onClick={() => {setModal(false), setTimeout(() => {goToSection("projects")}, 200)}}>
              <p>Projects</p>
            </button>
            <button onClick={() => {setModal(false), setTimeout(() => {goToSection("contacts")}, 200)}}>
              <p>Contacts</p>
            </button>
            {/* <div className={styles.rowLanguages}>
              <button onClick={() => setLanguage('en')} className={language === 'en' ? styles.oneLanguageActive : styles.oneLanguage}>
                <Image src="/en.svg" alt="en" width={24} height={17}/>
              </button>
              <button onClick={() => setLanguage('ru')} className={language === 'ru' ? styles.oneLanguageActive : styles.oneLanguage}>
                <Image src="/ru.svg" alt="ru" width={24} height={17}/>
              </button>
              <button onClick={() => setLanguage('uz')} className={language === 'uz' ? styles.oneLanguageActive : styles.oneLanguage}>
                <Image src="/uz.svg" alt="uz" width={24} height={17}/>
              </button>
            </div> */}
          </motion.div>
        ) : null}
      </motion.nav>
    </>
  );
}
