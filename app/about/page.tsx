import Image from "next/image";
import Link from "next/link";
import { Mail, Github, Linkedin } from "lucide-react";
import { PlayButton } from "@/components/ui/play-button";

// const test = () => { return "hello"; }
// const unused = "this is not used";

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


export default function About() {
  return (
    <main className="relative">
      <div className="relative z-10 mx-auto max-w-screen-md px-6 sm:px-4">
        <div className="pt-16 sm:pt-24" />

        <div className="custom-body space-y-4 animate-[fadeIn_500ms_ease]">
          <div className="flex items-center justify-between">
            <h1 className="custom-header">Other</h1>
            <Link href="/" className="font-extralight hover-scale">home</Link>
          </div>
        </div>

        <div className="custom-divider" />

        <div className="custom-body space-y-4 section-border">
          <div className="custom-section-title">music</div>
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Image
                src="/Rents Due Nemzz.jpeg"
                alt="Nemzzz"
                width={40}
                height={40}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <a className="hover-scale" href="https://open.spotify.com/track/7H5CsjEafNygkvcm69RevN?si=2a55ad0752784678" target="_blank" rel="noreferrer">cold — nemzzz</a>
              </div>
              <PlayButton songIndex={0} />
            </div>
            <div className="flex items-center gap-3">
              <Image
                src="/MSE100-TutorialWeek2DemoEmpty (1) (1).jpg"
                alt="Yeat"
                width={40}
                height={40}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <a className="hover-slide" href="https://open.spotify.com/track/5SaKYcCTEdCkacDamzfRfX?si=8c5cef0586da43f1" target="_blank" rel="noreferrer">2tone — yeat, don toliver</a>
              </div>
              <PlayButton songIndex={1} />
            </div>
            <div className="flex items-center gap-3">
              <Image
                src="/Fly Me to the Moon Frank Sinatra.jpeg"
                alt="Frank Sinatra"
                width={40}
                height={40}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <a className="hover-glow" href="https://open.spotify.com/track/5b7OgznPJJr1vHNYGyvxau?si=a1c8f067770e4967" target="_blank" rel="noreferrer">fly me to the moon — frank sinatra</a>
              </div>
              <PlayButton songIndex={2} />
            </div>
          </div>
        </div>

        <div className="custom-divider-thick" />

        <div className="custom-body space-y-4 section-border">
          <div className="custom-section-title">photo gallery</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Image
                src="/Activity from Ibrahim Khawar.jpeg"
                alt="UNESCO Award"
                width={300}
                height={200}
                className="rounded-lg object-cover w-full h-48"
              />
              <div className="text-neutral-600 custom-small">got CC UNESCO Award for Scholarly Communication</div>
            </div>
            <div className="space-y-3">
              <Image
                src="/37.jpg"
                alt="HammerHacks"
                width={300}
                height={200}
                className="rounded-lg object-cover w-full h-48"
              />
              <div className="text-neutral-600 custom-small">winning project at HammerHacks with good friends</div>
            </div>
            <div className="space-y-3">
              <Image
                src="/IMG_7138.jpeg"
                alt="Education Presentation"
                width={300}
                height={200}
                className="rounded-lg object-cover w-full h-48"
              />
              <div className="text-neutral-600 custom-small">presented findings about Ontario education budgeting to some big names</div>
            </div>
          </div>
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
