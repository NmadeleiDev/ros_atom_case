import React from "react";
import { IData } from "store/features/data";
// import { sortItems } from "store/features/data";
import { useAppDispatch } from "store/store";
import styled from "styled-components";

const StyledDiv = styled.div`
  .select {
    font-weight: 400;
    padding: 0.3rem;
    .option {
      padding: 0.3rem;
    }
  }
`;

export const Sort = () => {
  const [value, setValue] = React.useState("factory");
  const dispatch = useAppDispatch();
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.currentTarget.value);
    setValue(e.currentTarget.value);
    // dispatch(sortItems(e.currentTarget.value as keyof IData));
  };
  return (
    <StyledDiv>
      <span>Сортировка </span>
      <select onChange={onChange} value={value} name="sort" id="sort">
        <option value="factory">По предприятию</option>
        <option value="square">По площади</option>
        <option value="materialType">Вид вещества</option>
      </select>
    </StyledDiv>
  );
};
