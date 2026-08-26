'use client';

import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import AnimateDescription from '@/components/ui/AnimateDescription';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface Tech {
  name: string;
  icon?: string;
  monogram?: string;
}

interface StackSection {
  id: string;
  title: string;
  technologies: Tech[];
}

const STACK_SECTIONS: StackSection[] = [
  {
    id: 'languages',
    title: 'LANGUAGES',
    technologies: [
      { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
      { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
      { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
      { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
      { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
      { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg' },
      { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
      { name: 'Solidity', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/solidity/solidity-original.svg' },
    ],
  },
  {
    id: 'frameworks',
    title: 'FRAMEWORKS',
    technologies: [
      { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg' },
      { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
      { name: 'Shadcn/UI', icon: 'https://ui.shadcn.com/favicon.ico' },
      { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
      { name: 'React Router', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/reactrouter/reactrouter-original.svg' },
      { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg' },
      { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
      { name: 'React Native', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
    ],
  },
  {
    id: 'libraries',
    title: 'LIBRARIES',
    technologies: [
      { name: 'NumPy', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg' },
      { name: 'Pandas', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg' },
      { name: 'Matplotlib', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matplotlib/matplotlib-original.svg' },
    ],
  },
  {
    id: 'tools',
    title: 'TOOLS',
    technologies: [
      { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
      { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg' },
      { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg' },
      { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
      { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg' },
      { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' },
      { name: 'Power BI', icon: 'https://cdn.worldvectorlogo.com/logos/power-bi.svg' },
      { name: 'Vercel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg' },
      { name: 'Netlify', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/netlify/netlify-original.svg' },
    ],
  },
  {
    id: 'ai',
    title: 'AI TOOLKIT',
    technologies: [
      { name: 'Claude', icon: 'https://www.google.com/s2/favicons?domain=anthropic.com&sz=128' },
      { name: 'Cursor', icon: 'https://www.google.com/s2/favicons?domain=cursor.com&sz=128' },
      { name: 'Codex', icon: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128' },
      { name: 'Z.ai', icon: 'https://www.google.com/s2/favicons?domain=z.ai&sz=128' },
      { name: 'Hermes Agent', icon: 'https://hermes-agent.ai/favicon.ico?favicon.174buvy6txmfs.ico?dpl=dpl_4GCiLbk795rRCNiAKL4oP3pj5J3D' },
      { name: 'OpenClaw', icon: 'https://www.google.com/s2/favicons?domain=openclaw.ai&sz=128' },
      { name: 'Perplexity', icon: 'https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128' },
      { name: 'Gemini', icon: 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128' },
    ],
  },
];

const TechStack = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const reduced = useReducedMotion();
  const headingText = 'My Tech Stack';
  const descriptionText =
    'Technologies I use to design, build, and deploy complete web applications.';

  useGSAP(
    () => {
      if (reduced) {
        const items = sectionRefs.current.flatMap((section) =>
          section ? [...section.querySelectorAll('.tech-item')] : [],
        );
        gsap.set([...titleRefs.current.filter(Boolean), ...items], { opacity: 1, y: 0 });
        return;
      }

      sectionRefs.current.forEach((section, index) => {
        if (!section) return;
        const items = section.querySelectorAll('.tech-item');
        const title = titleRefs.current[index];

        gsap.fromTo(
          title,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 70%', scrub: true },
          },
        );
        gsap.fromTo(
          items,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, stagger: 0.2, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 70%', scrub: true },
          },
        );
      });
    },
    { scope: containerRef, dependencies: [reduced], revertOnUpdate: true },
  );


  return (
    <section
      ref={containerRef}
      id="TechStack"
      className="bg-ink text-light py-24 md:py-32 rounded-b-4xl overflow-hidden"
    >
      <div className="site-container">
        <div className="mb-14 hidden md:block">
          <AnimatedHeading
            text={headingText}
            className="text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight leading-none uppercase mb-4"
          />
          <AnimateDescription
            text={descriptionText}
            className="text-lg sm:text-xl md:text-2xl text-gray-soft font-sans leading-relaxed"
          />
        </div>

        <div className="mb-10 md:hidden">
          <AnimatedHeading
            text="My Stack"
            className="text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight leading-none uppercase mb-4"
          />
        </div>

        <div className="space-y-24">
          {STACK_SECTIONS.map((stack, index) => (
            <div
              key={stack.id}
              ref={(el) => { sectionRefs.current[index] = el; }}
              className="grid gap-8 lg:grid-cols-12 lg:gap-12"
            >
              <h3
                ref={(el) => { titleRefs.current[index] = el; }}
                className="font-display text-4xl font-bold uppercase tracking-tight text-light sm:text-5xl md:text-6xl lg:col-span-4"
              >
                {stack.title}
              </h3>

              <div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:col-span-8 xl:grid-cols-4">
                {stack.technologies.map((tech, i) => (
                  <div
                    key={i}
                    className="tech-item flex min-h-28 min-w-0 flex-col items-center justify-center gap-3 rounded-xl border border-border-subtler bg-elevated-dark/40 p-3 text-center transition-colors duration-300 hover:border-border-dark hover:bg-elevated-dark sm:min-h-20 sm:flex-row sm:justify-start sm:p-4 sm:text-left"
                  >
                    <div
                      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-border-subtler p-2.5 sm:h-12 sm:w-12 lg:h-14 lg:w-14 ${
                        ['Power BI', 'Shadcn/UI', 'Claude', 'Cursor', 'Codex', 'Z.ai', 'Hermes Agent', 'OpenClaw', 'Perplexity', 'Gemini'].includes(tech.name)
                          ? 'bg-[#f5f5f7]'
                          : 'bg-surface-mid'
                      }`}
                    >
                      {tech.icon ? (
                        <>
                          {/* Remote icon hosts vary and are intentionally loaded directly. */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={tech.icon}
                            alt={tech.name}
                            className={`w-full h-full object-contain ${
                              ['GitHub', 'Vercel', 'Solidity'].includes(tech.name) ? 'invert opacity-90' : ''
                            }`}
                            loading="lazy"
                          />
                        </>
                      ) : (
                        <span aria-hidden="true" className="font-display text-2xl font-bold leading-none text-cream">
                          {tech.monogram}
                        </span>
                      )}
                    </div>
                    <p className="min-w-0 break-words text-sm font-medium leading-tight text-cream md:text-base">
                      {tech.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
