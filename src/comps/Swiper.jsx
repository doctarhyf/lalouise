import React, { Component } from "react";
import ReactDOM from "react-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

export default function Swiper() {
  return (
    <div className="w-[640pt]">
      <Carousel>
        {[1, 2, 3, 4].map((p, i) => (
          <div>
            <img src={`ph${p}.jpg`} />
            <p className="legend">Pharmacy {p}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

// Don't forget to include the css in your page

// Using webpack or parcel with a style loader
// import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

// Using html tag:
// <link rel="stylesheet" href="<NODE_MODULES_FOLDER>/react-responsive-carousel/lib/styles/carousel.min.css"/>
