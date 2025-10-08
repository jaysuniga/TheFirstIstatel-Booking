// components/PanoramaViewer.tsx
import { useEffect, useRef } from "react";
import { Viewer } from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";

interface PanoramaViewerProps {
  imageUrl: string; // 360 image path
}

export default function PanoramaViewer({ imageUrl }: PanoramaViewerProps) {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const psvRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (viewerRef.current) {
      // Destroy old instance if exists
      if (psvRef.current) {
        psvRef.current.destroy();
      }

      // Init new instance
      psvRef.current = new Viewer({
        container: viewerRef.current,
        panorama: imageUrl,
        touchmoveTwoFingers: true,
        navbar: [
          "autorotate",
          "zoom",
          "download",
          "caption",
          "fullscreen"
        ],
      });
    }

    return () => {
      psvRef.current?.destroy();
    };
  }, [imageUrl]);

  return <div ref={viewerRef} style={{ width: "100%", height: "100%" }} />;
}
