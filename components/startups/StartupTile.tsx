import Link from "next/link";
import React from "react";

interface StartupTileProps {
  Logo: string;
  Name: string;
  Description: string;
  WebsiteLink: string;
}

export default function StartupTile({
  Logo,
  Name,
  Description,
  WebsiteLink,
}: StartupTileProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <img src={Logo} width={500} height={500} alt="Logo" />
      <h1>{Name}</h1>
      <p>{Description}</p>
      <div className="flex">
        <button type="button" className="text-center font-black">
          <Link href={WebsiteLink}> See More </Link>
        </button>
        <button type="button" className="text-center font-black">
          <Link href={WebsiteLink}> Website </Link>
        </button>
      </div>
    </div>
  );
}
