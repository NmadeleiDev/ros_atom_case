import { IData } from "pages/api/data";
import React from "react";
import styled from "styled-components";
import { THead } from "./THead";
import { TRow } from "./TRow";

const StyledTable = styled.table`
  outline: none;
  border: none;
  .thead {
    font-weight: 500;
  }
`;

interface Props {
  data: IData[];
}

export const Table = ({ data }: Props) => {
  return (
    <StyledTable>
      <THead />
      <tbody className="tbody">
        {data?.map((row) => (
          <TRow key={row.id} data={row} />
        ))}
      </tbody>
    </StyledTable>
  );
};
