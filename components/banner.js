import { ContentHeader, ContentBody } from "./content";
import Link from "next/link";
const Banner = ({ headline, tagline }) => (
  <div className="flex flex-wrap justify-center bg-gradient-to-r from-gray-200 to-white">
  <div className="p-3 w-10/12 lg:w-2/3 bg-gradient-to-r from-gray-700 via-gray-900 to-gray-800 flex justify-start my-2 md:my-2 max-w-screen-lg"> 
    <img className="w-12 h-12 md:w-24 md:h-24" src= {"/rocket.png"}></img>
    <div className="flex flex-wrap justify-start mx-1 md:mx-2">
      <h1 className="font-bold text-2xl md:text-4xl text-gray-100 font-logo"> { headline } </h1>
      <span className="text-gray-100 text-base md:text-xl font-family font-bold font-logo">{tagline} </span>
    </div>
  </div>
  </div>
)

const ProductStudioBanner = () => (
  <div className="cursor-pointer">
    { /*<Link href="https://studio.v1michigan.com" target="_blank">*/ }

      <Banner 
      headline="Introducing Product Studio"
      tagline="Join us this summer for a sprint to create world-class products that solve real world problems">
      </Banner>
      
  { /*</Link> */}
 
  </div>
  
)

export { ProductStudioBanner }