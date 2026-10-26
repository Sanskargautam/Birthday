import { AboutSection } from './components/AboutSection';
import { GroupCard } from './components/GroupCard';
import { MemoryQuest } from './components/MemoryQuest';
import { BirthdayCalendar } from './components/BirthdayCalendar';
import { BirthdayPopup } from './components/BirthdayPopup';
import { ContactWish } from './components/ContactWish';
import { Footer } from './components/Footer';
import { MemoryStrip } from './components/MemoryStrip';
import { Nav } from './components/Nav';
import { CelebrationAmbience } from './components/CelebrationAmbience';
import { PartyLights } from './components/PartyLights';
import { HeaderLoopVideo } from './components/HeaderLoopVideo';
import { PhotoSlider } from './components/PhotoSlider';
import { SurpriseVideo } from './components/SurpriseVideo';
import { Reveal } from './components/Reveal';

export default function App() {
  return (
    <div className="app-shell app-shell--party app-shell--celebrate app-shell--single">
      <CelebrationAmbience />
      <PartyLights />
      <div className="grain" aria-hidden />
      <BirthdayPopup />
      <Nav />
      <main>
        <HeaderLoopVideo />
        <Reveal delay={0}>
          <PhotoSlider />
        </Reveal>
        <Reveal delay={60}>
          <AboutSection />
        </Reveal>
        <Reveal delay={80}>
          <BirthdayCalendar />
        </Reveal>
        <Reveal delay={100}>
          <MemoryQuest />
        </Reveal>
        <Reveal delay={120}>
          <GroupCard />
        </Reveal>
        <Reveal>
          <MemoryStrip />
        </Reveal>
        <Reveal delay={40}>
          <SurpriseVideo />
        </Reveal>
        <Reveal delay={60}>
          <ContactWish />
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
