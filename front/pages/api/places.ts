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
      title: "Moscow",
      lat: 55.74942032693865,
      lng: 37.64068663490277,
      square: 10,
      temperature: -33,
      time: new Date().getTime(),
      image:
        "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2021-11-17/250m/8/41/75.jpg",
    },
  ]);
}
