import React from "react";
import Particles from "@tsparticles/react";

const ParticlesBackground = () => {
  return (
    <Particles
      id="tsparticles"
      style={{ pointerEvents: "none" }}
      options={{
        fullScreen: { enable: true, zIndex: 0 },
        background: { color: "#000000" }, // black background
        particles: {
          number: { value: 40 },
          color: { value: "#ffffff" }, // white particles
          shape: { type: "circle" },
          size: { value: 3 },
          move: { enable: true, speed: 2 },
          links: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.5,
            width: 1,
          },
        },
      }}
    />
  );
};

export default ParticlesBackground;
