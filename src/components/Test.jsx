import React from "react";

const images = [
  "https://picsum.photos/id/1015/400/600",
  "https://picsum.photos/id/1025/400/500",
  "https://picsum.photos/id/1035/400/300",
  "https://picsum.photos/id/1045/400/550",
  "https://picsum.photos/id/1055/400/450",
  "https://picsum.photos/id/1065/400/350",
  "https://picsum.photos/id/1075/400/400",
  "https://picsum.photos/id/1085/400/700",
  "https://picsum.photos/id/1095/400/600",
];

function Test() {
  return (
    <div className="p-4 ml-[250px]">
      <h2 className="text-2xl font-semibold mb-4">Manual Masonry Gallery</h2>
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {images.map((src, idx) => (
          <div
            key={idx}
            className="break-inside-avoid overflow-hidden rounded-lg shadow-md"
          >
            <img
              src={src}
              alt={`Random ${idx}`}
              className="w-full h-auto rounded-lg transition-transform duration-200 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Test;
