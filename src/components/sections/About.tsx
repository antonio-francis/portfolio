import React from 'react';
import About from './AboutMe';
import Services from './Services';
import Roadmap from './Roadmap';
import TechStack from './TechStack';
import SectionDivider from '@/components/ui/SectionDivider';

interface ReuniteBlackProps {
  techStackRef: React.RefObject<HTMLDivElement | null> | any;
}

const ReuniteBlack: React.FC<ReuniteBlackProps> = ({ techStackRef }) => {
  return (
    <>
      <About />
      <SectionDivider variant="number" label="What I Do" index={1} />
      <Services />
      <SectionDivider variant="number" label="Roadmap" index={2} />
      <Roadmap />
      <SectionDivider variant="number" label="My Stack" index={3} />

      <div ref={techStackRef}>
        <TechStack />
      </div>
    </>
  );
};

export default ReuniteBlack;
