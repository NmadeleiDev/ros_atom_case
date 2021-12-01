import React, { FC } from "react";
import styled from "styled-components";
import Header from "components/Header/Header";
import Sidebar from "components/Sidebar/Sidebar";

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
interface Props {
  className?: string;
}

const MainLayout: FC<Props> = ({ children, className }) => {
  return (
    <StyledDiv>
      <Header className="header" />
      <Sidebar className="sidebar" />
      <div className="main">{children}</div>
    </StyledDiv>
  );
};

export default MainLayout;
