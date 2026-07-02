import Hero from '@/components/hero/Hero';
import About from '@/components/about/About';
import Skills from '@/components/skills/Skills';
import Projects from '@/components/projects/Projects';
import GitHubSection from '@/components/github/GitHubSection';
import LeetCodeSection from '@/components/leetcode/LeetCodeSection';
import Timeline from '@/components/timeline/Timeline';
import Globe from '@/components/globe/Globe';
import ChatWidget from '@/components/chat/ChatWidget';
import Footer from '@/components/footer/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <GitHubSection />
      <LeetCodeSection />
      <Timeline />
      <Globe />
      <ChatWidget />
      <Footer />
    </>
  );
}
