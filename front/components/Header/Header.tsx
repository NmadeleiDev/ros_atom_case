import React from "react";
import styled from "styled-components";
import IntervalSelector from "./IntervalSelector";
import Welcome from "./Welcome";

const StyledDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  height: ${({ theme }) => theme.dimentions.header.height};

  .welcome {
    display: none;
  }

  @media (min-width: 700px) {
    justify-content: space-between;
    .welcome {
      display: flex;
    }
  }
`;

interface Props {
  className?: string;
}

const Header = ({ className }: Props) => {
  return (
    <StyledDiv className={className}>
      <Welcome className="welcome" />
      <IntervalSelector />
    </StyledDiv>
  );
};

export default Header;
