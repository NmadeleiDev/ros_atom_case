import { useState } from "react";
import styled from "styled-components";
import { BurgerIcon, CrossIcon } from "../Icons/Icons";
import { IMenuItem, SidebarItem } from "./SidebarItem";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .burger-button {
    display: block;
    margin: 2rem auto;
  }
  .list {
    display: none;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    margin-top: 1rem;
    width: 100%;
  }
  .show {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  @media (min-width: 700px) {
    align-items: center;
    .list {
      display: flex;
    }
    .burger-button {
      display: none;
    }
  }
  @media (min-width: 1200px) {
    .list {
      margin-left: 2rem;
      align-items: flex-start;
    }
  }
`;

interface Props {
  className?: string;
}

const menu: IMenuItem[] = [
  {
    text: "Обзор",
    link: "/",
  },
  {
    text: "Кампании",
    link: "/",
  },
  {
    text: "Аналитика",
    link: "/",
  },
  {
    text: "Настройки",
    link: "/",
  },
  {
    text: "Профиль",
    link: "/",
  },
];

const Sidebar = ({ className }: Props) => {
  const [show, setShow] = useState(false);

  const handleToggleShow = () => {
    setShow((state) => !state);
  };

  return (
    <StyledDiv className={className}>
      {show ? (
        <CrossIcon onClick={handleToggleShow} className="burger-button" />
      ) : (
        <BurgerIcon onClick={handleToggleShow} className="burger-button" />
      )}
      <div className={show ? "list show" : "list"}>
        {menu.map((item) => (
          <SidebarItem key={item.text} {...item} />
        ))}
      </div>
    </StyledDiv>
  );
};

export default Sidebar;
