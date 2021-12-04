import { LatLngLiteral } from "leaflet";
import type { NextApiRequest, NextApiResponse } from "next";

export interface IMockData {
  id: string;
  factory: string;
  zoneName: string;
  zoneNumber: string;
  materialType: string;
  regNumber?: string;
  placement: string;
  region: string;
  position: LatLngLiteral;
  regDate: string;
  lastIncedentDate: string;
  actNumber: string;
  actDate: string;
  landType: string;
  square: number;
  landLevelPollution: string;
  waterLevelPollution: string;
  image: string;
}

export const headers = {
  company: "Предприятие",
  zoneName: "Лицензионный участок",
  zoneNumber: "Номер лицензионного участка",
  materialType: "Вид загрязняющего вещества",
  regNumber: "Регистрационный номер загрязненного участка в Реестре",
  placement: "Местоположение",
  region: "Административный район",
  position: "Координаты",
  regDate: "Дата регистрации в Реестре",
  lastIncedentDate: "Дата факта последнего разлива",
  actNumber: "Номер акта технического расследования",
  actDate: "Дата акта технического расследования",
  landType: "Категория земель",
  square: "Площадь",
  landLevelPollution: "Уровень загрязнения почв",
  waterLevelPollution: "Уровень загрязнения водных объектов",
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IMockData[]>
) {
  res.status(200).json([
    {
      id: "1",
      factory: 'ООО "Башнефть-Добыча"',
      zoneName: "Кирско-Коттынский",
      zoneNumber: "ХМН00883НЭ",
      materialType: "нефть, нефтепродукты",
      regNumber: "ПП-2019-3",
      placement:
        'Нефтегазосборный трубопровод от АГЗУ-68 "А" 68 -узел ГО ЦПС (узел№55) в 700 м от куста 68 "Б"',
      region: "Нижневартовский",
      position: { lat: 61.12, lng: 79.35 },
      regDate: "10.03.2020",
      lastIncedentDate: "15.06.2019",
      actNumber: "9",
      actDate: "15.06.2019",
      landType: "земли лесного фонда",
      square: 0.001,
      landLevelPollution: "0",
      waterLevelPollution: "0",
      image:
        "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2021-11-18/250m/8/52/83.jpg",
    },
    {
      id: "2",
      factory: 'ООО "Тарховское"',
      zoneName: "Ершовый",
      zoneNumber: "ХМН14654НЭ",
      materialType: "нефть",
      regNumber: "ПП-2013-32",
      placement: "3600м на запад от К-18",
      region: "Нижневартовский",
      position: { lat: 61.192479, lng: 77.626655 },
      regDate: "15.02.2014",
      lastIncedentDate: "",
      actNumber: "",
      actDate: "",
      landType: "земли лесного фонда",
      square: 0.1357,
      landLevelPollution: "сильное",
      waterLevelPollution: "0",
      image:
        "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2021-11-17/250m/8/41/75.jpg",
    },
    {
      id: "3",
      factory: 'ООО "КанБайкал"',
      zoneName: "Унтыгейский",
      zoneNumber: "ХМН10457НР",
      materialType: "нефть, нефтепродукты",
      regNumber: "КБ-2020-1",
      placement:
        "УЗА №9 Напорного нефтепровода ДНС Унтыгейского м/р-ПСП НПС Южный Балык",
      region: "Нефтеюганский",
      position: { lat: 60.30015, lng: 72.56134 },
      regDate: "05.03.2021",
      lastIncedentDate: "28.06.2020",
      actNumber: "28/6",
      actDate: "28.06.2021",
      landType: "земли лесного фонда",
      square: 0.22,
      landLevelPollution: "-",
      waterLevelPollution: "-",
      image:
        "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2021-11-17/250m/8/41/75.jpg",
    },
    {
      id: "4",
      factory: 'ОАО "Варьеганнефть"',
      zoneName: "Тагринский",
      zoneNumber: "ХМН10461НЭ",
      materialType: "нефть",
      regNumber: "РУССН-2013-75",
      placement: "район к.8, выдел 1 и 2",
      region: "Нижневартовский",
      position: { lat: 78.1036, lng: 62.194 },
      regDate: "15.02.2014",
      lastIncedentDate: "23.06.05",
      actNumber: "",
      actDate: "",
      landType: "земли лесного фонда",
      square: 0.741,
      landLevelPollution: "сильное",
      waterLevelPollution: "0",
      image:
        "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2021-11-17/250m/8/41/75.jpg",
    },
  ]);
}
