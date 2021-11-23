import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header/Header";
import Map from "../components/Map/Map";
import Sidebar from "../components/Sidebar/Sidebar";
import MainLayout from "../layouts/MainLayout";
import styled from "styled-components";

const StyledDiv = styled.div`
  display: grid;
  grid-template-areas:
    "header"
    "main";

  .header {
    grid-area: header;
  }

  .sidebar {
    grid-area: sidebar;
    display: none;
  }

  .main {
    grid-area: main;

    & .map {
      width: 100%;
      height: calc(100vw - 50px);
    }
  }

  @media (min-width: 400px) {
    grid-auto-columns: 100px 1fr;
    grid-template-areas:
      "sidebar header"
      "sidebar main";

    .sidebar {
      display: flex;
    }
  }

  @media (min-width: 1200px) {
    grid-auto-columns: 250px 1fr;
  }
`;

const Home: NextPage = () => {
  return (
    <StyledDiv>
      <Head>
        <title>EMERGENCY TRACKER</title>
      </Head>

      <Header className="header" />
      <Sidebar className="sidebar" />
      <MainLayout className="main">
        <Map className="map" />
      </MainLayout>
    </StyledDiv>
  );
};

export default Home;
