import React from "react";

import styled from "styled-components";

const StyledDiv = styled.div`
  background-color: #fafafa;
  width: 100%;
  height: 100%;
`;

interface Props {
  className?: string;
}

const Map = ({ className }: Props) => {
  return <StyledDiv className={className} />;
};

export default Map;
