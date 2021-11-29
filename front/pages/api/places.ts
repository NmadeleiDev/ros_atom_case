//
import type { NextApiRequest, NextApiResponse } from "next";

export interface IPlace {
  title: string;
  lat: number;
  lng: number;
  square: number;
  temperature: number;
  time: number;
  image: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPlace[]>
) {
  res.status(200).json([
    {
      title: "127км трассы СЕВЕР",
      lat: 55.749,
      lng: 37.64,
      square: 200,
      temperature: -33,
      time: new Date().getTime(),
      image:
        "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2021-11-18/250m/8/52/83.jpg",
    },
    {
      title: "32км трассы ПУТЬ",
      lat: 56.01,
      lng: 37.235,
      square: 2000,
      temperature: -20,
      time: new Date().getTime(),
      image:
        "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2021-11-17/250m/8/41/75.jpg",
    },
  ]);
}
