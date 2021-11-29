import React, { useState } from "react";
import { IPlace } from "pages/api/places";
import { Marker } from "./Marker";
import { FullCard } from "./FullCard";

const Card = (props: IPlace) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  return isSelected ? (
    <FullCard onClick={handleClick} {...props} />
  ) : (
    <Marker onClick={handleClick} {...props} />
  );
};

export default Card;
