import Image from "next/image";
import Link from "next/link";
import { Mail, Github, Linkedin, Twitter, Instagram } from "lucide-react";

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

export default function Progress() {
  return (
    <main className="relative">
      <div className="relative z-10 mx-auto max-w-screen-md px-6 sm:px-4">
        <div className="pt-16 sm:pt-24" />

        <div className="custom-body space-y-4 animate-[fadeIn_500ms_ease]">
          <div className="flex items-center justify-between">
            <h1 className="custom-header">Progress</h1>
            <div className="flex items-center gap-4">
              <Link href="/about" className="font-extralight hover-scale">other</Link>
              <Link href="/" className="font-extralight hover-scale">home</Link>
            </div>
          </div>
        </div>

        <div className="custom-divider" />

        <div className="custom-body space-y-6 section-border">
          <div className="custom-section-title">daily updates</div>
          
          {/* Example progress entry - you can add more entries here */}
          <div className="space-y-3 pb-4 border-b border-neutral-200 last:border-b-0 last:pb-0">
            <div className="text-neutral-500 custom-small">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="text-neutral-800">
              <p>Working on building out the progress page for my portfolio. Excited to start tracking daily updates!</p>
            </div>
            {/* Uncomment and add image when you have one */}
            {/* <div className="mt-3">
              <Image
                src="/your-image.jpg"
                alt="Progress update"
                width={600}
                height={400}
                className="rounded-lg object-cover w-full"
              />
            </div> */}
          </div>

          {/* Add more progress entries here following the same structure */}
        </div>

        <div className="custom-divider" />

        <div className="custom-body section-border">
          <div className="pt-6" />
          <footer className="pb-16 sm:pb-24">
            <div className="custom-contact">contact</div>
            <div className="mt-4 flex items-center gap-6">
              <a className="hover-scale" href="mailto:ibrahim.ansari4161@gmail.com" title="Email">
                <Mail size={20} className="text-neutral-600" />
              </a>
              <a className="hover-slide" href="https://github.com/ibrahim-ansari-code" target="_blank" rel="noreferrer" title="GitHub">
                <Github size={20} className="text-gray-800" />
              </a>
              <a className="hover-glow" href="https://www.linkedin.com/in/ibrahim-ansari-775529270/" target="_blank" rel="noreferrer" title="LinkedIn">
                <Logo src="/linkedin.webp" alt="LinkedIn" size={20} />
              </a>
              <a className="hover-scale" href="https://x.com/IbrahimAns20615" target="_blank" rel="noreferrer" title="X (Twitter)">
                <Twitter size={20} className="text-black" />
              </a>
              <a className="hover-slide" href="https://www.instagram.com/ibrahim.ansr/" target="_blank" rel="noreferrer" title="Instagram">
                <Instagram size={20} className="text-pink-600" />
              </a>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}

