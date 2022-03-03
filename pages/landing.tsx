import Particles from "react-tsparticles";
import ContinueButton from "../components/ContinueButton";

const Welcome = () => (
  <div>
    <div className="h-screen flex justify-center items-center  flex-col z-50 p-8">
      <h1 className="text-6xl tracking-tight font-bold font-logo text-gray-100 leading-none text-center">
        Welcome to V1
      </h1>
      <p className="text-2xl mt-8 text-gray-500 font-bold tracking-tight mb-3 max-w-xl text-center">
        The community for ambitious student builders at the University of
        Michigan.
      </p>
      <ContinueButton text="Sign Up ➜" continueButtonLink="/signup" />
    </div>
    <div className="z-0">
      <Particles
        id="tsparticles"
        options={ {
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#ffffff",
            },
            shape: {
              type: "circle",
              stroke: {
                width: 7,
                color: "#ffffff",
              },
              polygon: {
                nb_sides: 5,
              },
              image: {
                src: "img/github.svg",
                width: 100,
                height: 100,
              },
            },
            opacity: {
              value: 0.5,
              random: false,
              anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false,
              },
            },
            size: {
              value: 3,
              random: true,
              anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false,
              },
            },
            line_linked: {
              enable: true,
              distance: 126.26387176325524,
              color: "#ffffff",
              opacity: 0.4,
              width: 3.156596794081381,
            },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              random: false,
              straight: false,
              out_mode: "out",
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
              },
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: true,
                mode: "bubble",
              },
              onclick: {
                enable: true,
                mode: "push",
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 400,
                line_linked: {
                  opacity: 1,
                },
              },
              bubble: {
                distance: 243.6239055957366,
                size: 16.24159370638244,
                duration: 2,
                opacity: 1,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
              push: {
                particles_nb: 4,
              },
              remove: {
                particles_nb: 2,
              },
            },
          },
          retina_detect: true,
        } }
        />
    </div>
  </div>
);

export default Welcome;
