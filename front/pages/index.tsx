import type { NextPage } from "next";
import Map from "../components/Map/Map";
import styled from "styled-components";

const StyledDiv = styled.div`
  height: ${({ theme }) =>
    "calc(100vh - " + theme.dimentions.header.height + ")"};
`;

const Home: NextPage = () => {
  return (
    <StyledDiv className="page">
      <Map />
    </StyledDiv>
  );
};

export default Home;
