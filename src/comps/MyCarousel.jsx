import React, { Component } from "react";
import ReactDOM from "react-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

export default function MyCarousel() {
  return (
    <div className="  overflow-hidden">
      <Carousel className="-mt-[120pt]" autoPlay>
        {[1, 2, 3, 4].map((p, i) => (
          <div className="lg:h-[380pt]   ">
            <img className="   " src={`ph${p}.jpg`} />

            <p className="legend">Pharmacy {p}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

/* export default function MyCarousel() {
  return (
    <div className="w-[850pt]  object-center h-[300pt] mb-8 bg-red-500 border-red-500 overflow-hidden">
      <Carousel className="-mt-[120pt]" autoPlay>
        {[1, 2, 3, 4].map((p, i) => (
          <div>
            <img src={`ph${p}.jpg`} />
            <p className="legend">Pharmacy {p}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
} */
