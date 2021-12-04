import { IMockData } from "pages/api/data";
import React, { MouseEvent, useState } from "react";
import { Description } from "./Description";
import styled from "styled-components";

const Styled = styled.tr`
  margin-top: 2rem;
  margin-bottom: 1rem;
  text-align: center;

  .center {
  }

  .button {
    padding: 1rem;
    text-transform: uppercase;
    background-color: inherit;
    outline: none;
    color: ${({ theme }) => theme.colors.text.dark};
    border: 1px solid ${({ theme }) => theme.colors.base.border};
    border-radius: 5px;
    box-shadow: none;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 10px ${({ theme }) => theme.colors.base.border};
    }
  }
`;

interface Props {
  data: IMockData;
  className?: string;
}

export const TRow = ({ data, className }: Props) => {
  return (
    <Styled className={className}>
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
    </Styled>
  );
};

export const TRowCompact = ({ data, className }: Props) => {
  const [show, setShow] = useState(false);

  const handleShowModal = (
    e: MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) => {
    console.log(e.currentTarget);
    setShow((show) => !show);
  };
  return (
    <Styled className={className}>
      <td className="td">{data.factory}</td>
      <td className="td">{data.zoneName}</td>
      <td className="td">{data.materialType}</td>
      <td className="td">{data.placement}</td>
      <td className="td">{data.position.lat + ", " + data.position.lng}</td>
      <td className="td">{data.lastIncedentDate}</td>
      <td className="td">{data.square}</td>
      <td className="td">
        <button onClick={handleShowModal} className="button">
          Подробнее
        </button>
        {show && <Description handleClose={() => setShow(false)} data={data} />}
      </td>
    </Styled>
  );
};
