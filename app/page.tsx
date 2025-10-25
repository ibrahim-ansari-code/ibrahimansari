import Image from "next/image";
import { Mail, Github, Linkedin } from "lucide-react";
// import { useEyeTracking } from "@/hooks/useEyeTracking";
// const unused = "test";

function Logo({ src, alt, size = 18 }: { src: string; alt: string; size?: number }) {
  return (
    <span className="inline-flex items-center align-middle">
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        sizes={`${size}px`}
        quality={100}
        priority={false}
        className={`h-[${size}px] w-[${size}px] object-contain align-middle`}
      />
    </span>
  );
}


export default function Home() {
  return (
    <main className="relative">
      <div className="relative z-10 mx-auto max-w-screen-md px-6 sm:px-4">
        <div className="pt-16 sm:pt-24" />

        <div className="custom-body space-y-4 animate-[fadeIn_400ms_ease]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="custom-header">Ibrahim Ansari</h1>
              <Logo src="/waterloo-logo.png" alt="University of Waterloo" size={32} />
            </div>
            <a 
              href="/about" 
              className="font-extralight hover-scale"
            >
              other
            </a>
          </div>
          <div className="text-neutral-600">
            <span>management engineering @ uwaterloo</span>
          </div>
        </div>

        <div className="custom-divider-thick" />

        <div 
          id="experience-section"
          className="custom-body space-y-4 animate-[fadeIn_600ms_ease] section-border"
        >
          <div className="custom-section-title">experience</div>
          <div className="flex items-center gap-3">
            <div className="shadow-md rounded-lg p-3 bg-white">
              <Logo src="/Tablingos Overview.jpeg" alt="Tablingos" size={36} />
            </div>
            <div>
              <div className="custom-project-title">co‑founder — <a href="https://www.linkedin.com/company/tablingos/about/" target="_blank" rel="noreferrer" className="hover-glow">tablingos</a></div>
              <div className="text-neutral-600 custom-small">data automation backed by Microsoft</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="shadow-md rounded-lg p-3 bg-white">
              <Logo src="/WWF International Logo.jpeg" alt="WWF" size={36} />
            </div>
            <div>
              <div className="custom-project-title">data scientist intern — <a href="https://www.worldwildlife.org/" target="_blank" rel="noreferrer" className="hover-glow">wwf</a></div>
              <div className="text-neutral-600 custom-small">using data science to do good</div>
            </div>
          </div>
        </div>

        <div className="custom-divider" />

        <div 
          id="projects-section"
          className="custom-body space-y-4 animate-[fadeIn_700ms_ease] section-border"
        >
          <div className="custom-section-title">projects</div>
          <div>
            <div className="custom-project-title"><a className="hover-scale" href="https://github.com/ibrahim-ansari-code/UFC-prediction/tree/main" target="_blank" rel="noreferrer">ufc predictor</a></div>
            <div className="text-neutral-600 custom-small">because i lost too much money betting</div>
          </div>
          <div>
            <div className="custom-project-title"><a className="hover-slide" href="https://app.handsforu.com" target="_blank" rel="noreferrer">hands</a></div>
            <div className="text-neutral-600 custom-small">RAG + cooking app</div>
          </div>
          <div>
            <div className="custom-project-title"><a className="hover-glow" href="https://github.com/ibrahim-ansari-code/no-rot" target="_blank" rel="noreferrer">norot</a></div>
            <div className="text-neutral-600 custom-small">grammarly for brainrot</div>
          </div>
        </div>

        <div className="custom-divider-thick" />

        <div 
          id="research-section"
          className="custom-body space-y-4 animate-[fadeIn_800ms_ease] section-border"
        >
          <div className="custom-section-title">research papers</div>
          <div className="space-y-3">
            <div>
              <a className="hover-scale" href="https://journal.stemfellowship.org/doi/abs/10.17975/sfj-2025-001" target="_blank" rel="noreferrer">optimizing budget allocations in ontario school boards for efficient, equitable, and inclusive education</a>
            </div>
            <div>
              <a className="hover-slide" href="https://journal.stemfellowship.org/doi/abs/10.17975/sfj-2024-004" target="_blank" rel="noreferrer">analyzing urban heat islands and their impact on the monarch butterfly population</a>
            </div>
          </div>
        </div>

        <div className="custom-divider" />

        <div 
          id="contact-section"
          className="custom-body animate-[fadeIn_900ms_ease] section-border"
        >
          <div className="pt-6" />
          <footer className="pb-16 sm:pb-24">
            <div className="custom-contact">contact</div>
            <div className="mt-4 flex items-center gap-6">
              <a className="hover-scale" href="mailto:ibrahim.ansari4161@gmail.com" title="Email">
                <Mail size={20} className="text-neutral-600" />
              </a>
              <a className="hover-slide" href="https://github.com/ibrahim-ansari-code" target="_blank" rel="noreferrer" title="GitHub">
                <Github size={20} className="text-neutral-600" />
              </a>
              <a className="hover-glow" href="https://www.linkedin.com/in/ibrahim-ansari-775529270/" target="_blank" rel="noreferrer" title="LinkedIn">
                <Logo src="/linkedin.webp" alt="LinkedIn" size={20} />
              </a>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}

