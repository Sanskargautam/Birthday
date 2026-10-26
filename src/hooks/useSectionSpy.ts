import { useEffect, useState } from 'react';

const SECTION_IDS = ['top', 'photos', 'about', 'date', 'quest', 'cards', 'moments', 'surprise', 'gift'] as const;

export function useSectionSpy() {
  const [active, setActive] = useState('top');

  useEffect(() => {
    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const pick = () => {
      const y = window.scrollY + window.innerHeight * 0.28;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.offsetTop <= y) current = section.id;
      }
      setActive(current);
    };

    pick();
    window.addEventListener('scroll', pick, { passive: true });
    window.addEventListener('resize', pick);
    return () => {
      window.removeEventListener('scroll', pick);
      window.removeEventListener('resize', pick);
    };
  }, []);

  return active;
}
