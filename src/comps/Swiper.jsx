import React, { Component } from "react";
import ReactDOM from "react-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

export default function Swiper() {
  return (
    <Carousel>
      <div>
        <img src="hospital.png" />
        <p className="legend">Legend 1</p>
      </div>
      <div>
        <img src="vite.svg" />
        <p className="legend">Legend 2</p>
      </div>
    </Carousel>
  );
}

// Don't forget to include the css in your page

// Using webpack or parcel with a style loader
// import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

// Using html tag:
// <link rel="stylesheet" href="<NODE_MODULES_FOLDER>/react-responsive-carousel/lib/styles/carousel.min.css"/>
