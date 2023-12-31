import { useRef, useEffect } from "react";

const VideoElement = ({
  track,
  displayName,
}: {
  track: MediaStreamTrack;
  displayName: string;
}) => {
  const getStream = (_track: MediaStreamTrack) => {
    const stream = new MediaStream();
    stream.addTrack(_track);
    return stream;
  };

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoObj = videoRef.current;

    if (videoObj && track) {
      videoObj.srcObject = getStream(track);
      videoObj.onloadedmetadata = async () => {
        console.warn("videoCard() | Metadata loaded...");
        try {
          videoObj.muted = true;
          await videoObj.play();
        } catch (error) {
          console.error(error);
        }
      };
      videoObj.onerror = () => {
        console.error("videoCard() | Error is hapenning...");
      };
    }
  }, [track]);

  return (
    <div className="aspect-video relative overflow-hidden bg-white w-96 rounded-md ">
      <video
        className="absolute w-full top-1/2 -translate-y-1/2"
        ref={videoRef}
        autoPlay
      />
      <div className="absolute bottom-2 left-2">{displayName}</div>
    </div>
  );
};

export default VideoElement;
