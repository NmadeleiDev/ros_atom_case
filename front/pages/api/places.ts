import { readFileSync } from "fs";
import path from "path";
import { LatLngLiteral } from "leaflet";
import type { NextApiRequest, NextApiResponse } from "next";

export interface IPlace {
  title: string;
  position: LatLngLiteral;
  square: number;
  temperature: number;
  time: number;
  image: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPlace[]>
) {
  // const data = JSON.parse(
  //   readFileSync(path.join(__dirname, "/data.csv"), "utf-8")
  // );
  // console.log(data);
  // console.log(data.length);
  // const preparedData = data
  //   .filter((el: number[]) => el[0] !== undefined && el[1] !== undefined)
  //   .slice(0, 50)
  //   .map((el: number[]) => ({
  //     title: "place",
  //     lat: el[0],
  //     lng: el[1],
  //     square: 10000,
  //     temperature: -33,
  //     time: new Date().getTime(),
  //     image:
  //       "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2021-11-18/250m/8/52/83.jpg",
  //   }));
  // res.status(200).json(preparedData);
  res.status(200).json([
    {
      title: "127км трассы СЕВЕР",
      position: { lat: 60.51, lng: 71.04 },
      square: 20000,
      temperature: -33,
      time: new Date().getTime(),
      image:
        "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2021-11-18/250m/8/52/83.jpg",
    },
    {
      title: "32км трассы ПУТЬ",
      position: {
        lat: 60.01,
        lng: 71.64,
      },
      square: 2000,
      temperature: -20,
      time: new Date().getTime(),
      image:
        "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2021-11-17/250m/8/41/75.jpg",
    },
  ]);
}
