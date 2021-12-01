import React, { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import cn from "classnames";
import {
  GraphIcon,
  DashboardIcon,
  StatisticsIcon,
  SettingsIcon,
  MaleIcon,
  MapIcon,
} from "../Icons/Icons";
import theme from "styles/theme";

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem auto;
  cursor: pointer;
  transform: scale(1);
  transition-duration: 1s;

  &:hover,
  &:active {
    .icon {
      color: ${({ theme }) => theme.colors.primary};
      transform: scale(1.2);
    }
    .text {
      font-weight: 400;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
  .icon {
    width: 63px;
    height: 63px;
    padding: 1rem;
    border-radius: 50%;
  }
  .text {
    padding: 1rem;
    display: none;
    align-items: center;
    justify-content: center;
    margin-left: 1rem;
    text-transform: uppercase;
    margin-left: 1rem;
    font-weight: 300;
  }
  @media (min-width: 1200px) {
    .item {
      margin: 1rem;
    }
    .text {
      display: flex;
    }
  }
`;

export interface IMenuItem {
  className?: string;
  text: string;
  link: string;
}

export const SidebarItem = (props: IMenuItem) => {
  const [hover, setHover] = useState(false);

  const onMouseEnter = () => {
    setHover(true);
  };
  const onMouseLeave = () => {
    setHover(false);
  };

  const getIcon = (text: string) => {
    switch (text) {
      case "Обзор":
        return (
          <MapIcon
            className="icon"
            hovered={hover}
            activeColor={theme.colors.primary}
          />
        );
      case "Отчёты":
        return (
          <DashboardIcon
            className="icon"
            hovered={hover}
            activeColor={theme.colors.primary}
          />
        );
      case "Аналитика":
        return (
          <StatisticsIcon
            className="icon"
            hovered={hover}
            activeColor={theme.colors.primary}
          />
        );
      case "Настройки":
        return (
          <SettingsIcon
            className="icon"
            hovered={hover}
            activeColor={theme.colors.primary}
          />
        );
      case "Профиль":
        return (
          <MaleIcon
            className="icon"
            hovered={hover}
            activeColor={theme.colors.primary}
          />
        );
      default:
        return null;
    }
  };
  const icon = getIcon(props.text);

  return (
    <Link href={props.link}>
      <a>
        <StyledDiv
          className={cn("item", props.className)}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {icon}
          <span className="text">{props.text}</span>
        </StyledDiv>
      </a>
    </Link>
  );
};
