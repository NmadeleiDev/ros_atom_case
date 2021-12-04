import { IMockData } from "pages/api/data";
import React from "react";
import styled from "styled-components";
import { THead, THeadCompact } from "./THead";
import { TRow, TRowCompact } from "./TRow";

const StyledTable = styled.table`
  outline: none;
  border: none;
  .thead {
    font-weight: 500;
  }

  .trow {
    font-weight: 300;
  }
`;

interface Props {
  data: IMockData[];
}

export const Table = ({ data }: Props) => {
  return (
    <StyledTable>
      <THead />
      <tbody className="tbody">
        {data?.map((row) => (
          <TRow className="trow" key={row.id} data={row} />
        ))}
      </tbody>
    </StyledTable>
  );
};

export const TableCompact = ({ data }: Props) => {
  return (
    <StyledTable>
      <THeadCompact />
      <tbody className="tbody">
        {data?.map((row) => (
          <TRowCompact className="trow" key={row.id} data={row} />
        ))}
      </tbody>
    </StyledTable>
  );
};
