import { useState } from "react";
import { Play } from "lucide-react";

export default function VideoSection({ cmsData }) {
  const posterImage = cmsData?.posterImage ?? "/home/video-section/luxury-shine-diamonds-digital-art 1.svg ";
  const videoUrl = cmsData?.videoUrl;
  const [playing, setPlaying] = useState(false);

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-2  md:px-4">
        <div className="relative aspect-video md:aspect-auto bg-gray-200 rounded-2xl overflow-hidden cursor-pointer group md:h-[409px] w-full">
          {playing && videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              onEnded={() => setPlaying(false)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <>
              <img src={posterImage} alt="Exclusive Collection" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0  transition-colors" />

              {videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center" onClick={() => setPlaying(true)}>
                  <div className="w-14 h-14 md:w-17.5 md:h-17.5 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={20.85} className="text-maroon ml-1 hidden md:block" fill="currentColor" />
                    <Play size={18.86} className="text-maroon ml-0.5 md:hidden" fill="currentColor" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
