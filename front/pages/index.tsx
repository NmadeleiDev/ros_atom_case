import type { NextPage } from "next";
// import Map from "../components/Map/Map";
import styled from "styled-components";
import dynamic from "next/dynamic";

const StyledDiv = styled.div`
  height: ${({ theme }) =>
    "calc(100vh - " + theme.dimentions.header.height + ")"};
`;

const Home: NextPage = () => {
  const Map = dynamic(() => import("components/Map/Map"), {
    loading: () => <div>A map is loading</div>,
    ssr: false,
  });
  return (
    <StyledDiv className="page">
      <Map />
    </StyledDiv>
  );
};

export default Home;
