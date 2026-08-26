'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import AnimateDescription from '@/components/ui/AnimateDescription';

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.innerWidth < 1024) return;
    const ctx = gsap.context(() => {
      const allSections = servicesRef.current.filter(Boolean);
      const pinOffset = 50;
      allSections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: `top ${pinOffset + index * 100}px`,
          endTrigger: allSections[allSections.length - 1],
          end: 'bottom bottom',
          pin: true,
          pinSpacing: false,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const headingText = 'What I Do';
  const descriptionText =
    'I specialize in building complete digital solutions that are fast, reliable, and results-driven—whether for a local business, a startup, or a product team.';

  const services = [
    {
      id: '01',
      title: 'Web Design',
      description:
        'Fast, modern websites optimized for every device. Custom design that represents your brand and turns visitors into real customers.',
      items: [
        'Landing pages and corporate websites',
        'Responsive design for mobile and desktop',
        'Premium animations and interactions',
      ],
    },
    {
      id: '02',
      title: 'Backend & APIs',
      description:
        'Robust systems that power your business: databases, payment-platform integrations, admin dashboards, and scalable business logic.',
      items: [
        'REST APIs and third-party integrations',
        'Custom admin dashboards',
        'Authentication, payments, and notifications',
      ],
    },
    {
      id: '03',
      title: 'Android Mobile Apps',
      description:
        'Native Android applications that put your business directly in your customers’ pockets, with catalogs, notifications, and seamless experiences.',
      items: [
        'Native Android apps',
        'Integration with your website or backend',
        'Publishing on the Google Play Store',
      ],
    },
    {
      id: '04',
      title: 'Minecraft Server Development',
      description:
        'Custom Minecraft server experiences built for performance, reliability, and long-term growth—from original gameplay systems to complete network infrastructure.',
      items: [
        'Custom Java plugins and gameplay systems',
        'Server setup, optimization, and security',
        'Multi-server networks, databases, and integrations',
      ],
    },
  ];

  return (
    <section
      id="services"
      ref={sectionRef}
      className="min-h-screen bg-ink text-light py-24 md:py-32 overflow-hidden"
    >
      <div className="site-container">
        <div className="mb-10 md:mb-20">
          <AnimatedHeading
            text={headingText}
            className="text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight leading-none uppercase mb-4"
          />

          <div className="grid md:grid-cols-12 gap-4 md:gap-8">
            <div className="md:col-start-6 md:col-span-7 flex flex-col md:flex-row gap-3 md:gap-10">
              <span className="text-neon uppercase text-xs md:text-sm font-semibold tracking-[0.2em] whitespace-nowrap">
                (Services)
              </span>

              <AnimateDescription
                text={descriptionText}
                className="max-w-2xl text-lg sm:text-xl md:text-2xl text-gray-soft font-sans leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="relative pb-8 md:pb-24">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => {
                servicesRef.current[index] = el;
              }}
              className="group bg-ink pb-16 md:pb-32 [will-change:transform]"
              style={{ zIndex: index + 1 }}
            >
              <div className="grid md:grid-cols-12 gap-4 items-center py-4 md:py-8 border-t border-border-subtle">
                <span className="hidden md:block md:col-span-1 font-mono text-sm text-gray-mid/60 transition-colors duration-300 group-hover:text-neon">
                  {service.id}
                </span>
                <h3
                  className="font-display md:col-span-9 md:col-start-2 -translate-y-[0.1em] text-light font-bold text-3xl sm:text-3xl md:text-5xl lg:text-6xl leading-none transition-transform duration-500 ease-out group-hover:translate-x-3"
                >
                  {service.title}
                </h3>
              </div>

              <div className="grid md:grid-cols-12 gap-4 md:gap-8 pt-4 md:pt-6">
                <div className="md:col-span-7 md:col-start-6 space-y-4 md:space-y-6">
                  <p className="text-gray-soft text-xl md:text-2xl leading-relaxed font-sans">
                    {service.description}
                  </p>

                  <div className="divide-y divide-border-subtle">
                    {service.items.map((item, i) => (
                      <div key={i} className="py-4 md:py-6 flex items-center gap-3 md:gap-4">
                        <span className="text-neon text-sm md:text-base font-mono font-bold">
                          0{i + 1}
                        </span>
                        <span className="text-xl md:text-2xl font-bold font-sans text-light">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
