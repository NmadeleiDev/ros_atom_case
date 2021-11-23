import React, { FC } from "react";
import styled from "styled-components";

const StyledDiv = styled.div`
  min-height: 100vh;
  padding: 4rem 0;
`;

interface Props {
  className?: string;
}

const MainLayout: FC<Props> = ({ children, className }) => {
  return <StyledDiv className={className}>{children}</StyledDiv>;
};

export default MainLayout;
