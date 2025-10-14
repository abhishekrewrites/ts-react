import { useState } from "react";

export type ImagesType = {
  src: string;
  alt: string;
};

const IMAGES: ImagesType[] = [
  {
    src: "https://picsum.photos/id/600/600/400",
    alt: "Forest",
  },
  {
    src: "https://picsum.photos/id/100/600/400",
    alt: "Beach",
  },
  {
    src: "https://picsum.photos/id/200/600/400",
    alt: "Yak",
  },
  {
    src: "https://picsum.photos/id/300/600/400",
    alt: "Hay",
  },
  {
    src: "https://picsum.photos/id/400/600/400",
    alt: "Plants",
  },
  {
    src: "https://picsum.photos/id/500/600/400",
    alt: "Building",
  },
];

function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <div>
      <div className="flex w-[600px] relative overflow-x-scroll">
        <button
          className="flex absolute h-[40px] w-[40px] z-1 top-[calc(50%-40px)] left-1 justify-center items-center cursor-pointer text-white items-cente rounded-full bg-[#0008] hover:bg-[#000b]"
          onClick={() => {
            setCurrentIndex((prev) => {
              if (prev <= 0) {
                return 0;
              }
              return prev - 1;
            });
          }}
        >
          &#10094;
        </button>
        <div
          className="flex transform transition-transform duration-200 ease-in"
          style={{ transform: `translateX(-${currentIndex * 600}px)` }}
        >
          {IMAGES.map((image: ImagesType) => {
            return <img key={image.alt} alt={image.alt} src={image.src} />;
          })}
        </div>
        <button
          className="flex absolute h-[40px] w-[40px] top-[calc(50%-40px)] right-1 justify-center items-center cursor-pointer text-white items-cente rounded-full bg-[#0008] hover:bg-[#000b]"
          onClick={() =>
            setCurrentIndex((prev) => {
              if (prev >= IMAGES.length - 1) {
                return IMAGES.length - 1;
              }
              return prev + 1;
            })
          }
        >
          &#10095;
        </button>
        <div className="justify-center w-full bottom-1 z-3 absolute flex">
          <div className="bg-[#0008] flex p-1.5 rounded-lg">
            {Array(IMAGES.length)
              .fill(null)
              .map((_, idx: number) => (
                <div
                  onClick={() => setCurrentIndex(idx)}
                  className="h-[8px] w-[8px] flex mx-0.5 cursor-pointer rounded-full bg-[#666]"
                  style={{ background: idx === currentIndex ? "#ddd" : "" }}
                ></div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCarousel;
