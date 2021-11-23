import React from "react";
import styled from "styled-components";

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  height: 50px;
`;

interface Props {
  className?: string;
}

const Header = ({ className }: Props) => {
  return (
    <StyledDiv className={className}>
      <div>Header</div>
      <div>Login</div>
    </StyledDiv>
  );
};

export default Header;
