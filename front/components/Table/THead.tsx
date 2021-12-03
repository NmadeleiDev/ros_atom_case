import { IData } from "pages/api/data";
import React from "react";
import { headers } from "pages/api/data";

export const THead = () => {
  return (
    <thead>
      <tr className="tr">
        <td className="td">{headers.factory}</td>
        <td className="td">{headers.zoneName}</td>
        <td className="td">{headers.materialType}</td>
        <td className="td">{headers.zoneNumber}</td>
        <td className="td">{headers.regNumber}</td>
        <td className="td">{headers.placement}</td>
        <td className="td">{headers.region}</td>
        <td className="td">{headers.position}</td>
        <td className="td">{headers.lastIncedentDate}</td>
        <td className="td">{headers.actNumber}</td>
        <td className="td">{headers.actDate}</td>
        <td className="td">{headers.landType}</td>
        <td className="td">{headers.square}</td>
        <td className="td">{headers.landLevelPollution}</td>
        <td className="td">{headers.waterLevelPollution}</td>
      </tr>
    </thead>
  );
};
