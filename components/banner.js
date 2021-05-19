import { ContentHeader, ContentBody } from "./content";

const Banner = ({ headline, tagline }) => (
  <div className="flex justify-center bg-gradient-to-r from-gray-200 to-white">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap" rel="stylesheet"></link>
  <div className="p-3 w-10/12 lg:w-2/3 bg-gradient-to-r from-gray-700 via-gray-900 to-gray-800 flex justify-start my-2 md:my-2"> 
    <div className=""></div>
    <img className="w-24 h-24 md:w-auto md:h-auto" src= {"/rocket.png"}></img>
    <div className="flex flex-wrap justify-left mx-5 md:mx-20">
      <h1 className="font-bold text-2xl md:text-4xl text-gray-100"> { headline } </h1>
      <span className="text-gray-100 font-family font-bold"> Join us this summer for a sprint to create world-class products that solve real world problems</span>
    </div>
  </div>
  </div>
)

const ProductStudioBanner = () => (
  <Banner 
  headline="Introducing Product Studio"
  tagline="Not really sure what to put here"></Banner>
)

export { ProductStudioBanner }