import { IData } from "pages/api/data";
import React from "react";

interface Props {
  data: IData;
}

export const TRow = ({ data }: Props) => {
  return (
    <tr className="tr">
      <td className="td">{data.factory}</td>
      <td className="td">{data.zoneName}</td>
      <td className="td">{data.materialType}</td>
      <td className="td">{data.zoneNumber}</td>
      <td className="td">{data.regNumber}</td>
      <td className="td">{data.placement}</td>
      <td className="td">{data.region}</td>
      <td className="td">{data.position.lat + ", " + data.position.lng}</td>
      <td className="td">{data.lastIncedentDate}</td>
      <td className="td">{data.actNumber}</td>
      <td className="td">{data.actDate}</td>
      <td className="td">{data.landType}</td>
      <td className="td">{data.square}</td>
      <td className="td">{data.landLevelPollution}</td>
      <td className="td">{data.waterLevelPollution}</td>
    </tr>
  );
};
