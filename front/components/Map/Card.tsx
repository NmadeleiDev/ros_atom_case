import React, { useState, MouseEvent } from "react";
import styled from "styled-components";
import Image from "next/image";
import { IPlace } from "pages/api/places";

const StyledCircle = styled.div<IPlace & { zoom: number }>`
  background-color: ${({ square, theme }) =>
    square < 1
      ? theme.colors.message.info
      : square < 10
      ? theme.colors.message.warn
      : theme.colors.message.error};
  width: ${({ square, zoom }) => square * zoom + "px"};
  height: ${({ square, zoom }) => square * zoom + "px"};
  border-radius: 50%;
`;

const StyledDiv = styled.div<IPlace>`
  border-radius: 5px;
  background-color: white;
  width: 300px;
  box-shadow: ${({ theme }) => `5px 5px 20px ${theme.colors.base.shadow}`};

  .card {
    padding: 0.5rem;
    font-size: 0.8rem;
    .title {
      display: block;
      text-align: center;
      padding-bottom: 10px;
    }

    .info {
      display: flex;
      justify-content: space-between;
    }
  }
`;

interface IFullCardProps extends IPlace {
  onClick: () => void;
}

const FullCard = (props: IFullCardProps) => {
  const formatTime = (time: number) => {
    const date = new Date(time);
    return date.toLocaleString();
  };
  return (
    <StyledDiv {...props}>
      <Image
        src={props.image}
        width={300}
        height={300}
        alt={`${props.title} oil spill`}
      />
      <div className="card">
        <span className="title">{props.title}</span>
        <div className="info">
          <div className="text">Координаты:</div>
          <div className="value">
            {props.lat.toFixed(2) + ", " + props.lng.toFixed(2)}
          </div>
        </div>
        <div className="info">
          <div className="text">Площадь разлива:</div>
          <div className="value">{props.square || 0}Га</div>
        </div>
        <div className="info">
          <div className="text">Температура:</div>
          <div className="value">{props.temperature}°С</div>
        </div>
        <div className="info">
          <div className="text">Время обнаружения:</div>
          <div className="value">{formatTime(props.time)}</div>
        </div>
      </div>
    </StyledDiv>
  );
};

const Card = (props: IPlace) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  const card = isSelected ? (
    <FullCard onClick={handleClick} {...props} />
  ) : (
    <StyledCircle onClick={handleClick} {...props} zoom={10} />
  );
  return card;
};

export default Card;
