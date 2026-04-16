import { useRef, useState } from "react";
import { Play } from "lucide-react";

const DEFAULT_CARDS = [
  { title: "For Women Video Section", subtitle: "Exclusive styling & collection", poster: "/home/video-cards/img-1.png" },
  { title: "For Women Video Section", subtitle: "Latest trends & picks", poster: "/home/video-cards/img-2.png" },
];

export default function VideoCards({ cmsData }) {
  const cards = cmsData?.cards ?? DEFAULT_CARDS;
  const [playingIndex, setPlayingIndex] = useState(null);
  const videoRefs = useRef([]);

  const handlePlay = (i) => {
    setPlayingIndex(i);
  };

  const handleVideoEnd = () => {
    setPlayingIndex(null);
  };

  return (
    <section className="py-8 md:py-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-2  md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="relative aspect-16/10 bg-white/50 rounded-2xl overflow-hidden cursor-pointer group"
            >
              {playingIndex === i && card.videoUrl ? (
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  src={card.videoUrl}
                  controls
                  autoPlay
                  onEnded={handleVideoEnd}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <>
                  <img src={card.poster} alt={card.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />

                  {card.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center" onClick={() => handlePlay(i)}>
                      <div className="w-14 h-14 md:w-17.5 md:h-17.5 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play size={20.85} className="text-maroon ml-1 hidden md:block" fill="currentColor" />
                        <Play size={18.86} className="text-maroon ml-0.5 md:hidden" fill="currentColor" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
