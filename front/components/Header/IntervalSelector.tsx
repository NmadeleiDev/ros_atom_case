import React, { ChangeEvent, useState } from "react";
import styled from "styled-components";

const StyledDiv = styled.div`
  margin-right: 2rem;
  display: flex;
  align-items: center;
  .text {
    font-size: 0.9rem;
    font-weight: 300;
    margin-right: 0.5rem;
  }

  .select {
    font-weight: 400;
    padding: 0.3rem;
    .option {
      padding: 0.3rem;
    }
  }

  @media (min-width: 850px) {
    .text {
      font-size: 1rem;
    }
  }
`;

interface Props {}

const intervals = ["день", "неделя", "месяц"] as const;

type Interval = typeof intervals[number];

const IntervalSelector = (props: Props) => {
  const [selected, setSelected] = useState<Interval>("день");

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.currentTarget.value as Interval);
  };

  return (
    <StyledDiv>
      <span className="text">Интервал отображения:</span>
      <select
        name="interval"
        id="interval"
        className="select"
        onChange={handleSelect}
        value={selected}
      >
        {intervals.map((el) => (
          <option value={el} key={el}>
            {el}
          </option>
        ))}
      </select>
    </StyledDiv>
  );
};

export default IntervalSelector;
