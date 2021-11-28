import React, { useState } from "react";
import styled from "styled-components";
import GoogleMapReact from "google-map-react";
import { googleMapStyles } from "styles/googleMap.styles";

const StyledDiv = styled.div`
  background-color: #fafafa;
  width: 100%;
  height: 100%;
`;

interface Props {
  className?: string;
}

const Map = ({ className }: Props) => {
  const [coordinates, setCoordinates] = useState({ lat: 55.75, lng: 37.64 });
  return (
    <StyledDiv className={className}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API || "",
        }}
        defaultCenter={coordinates}
        center={coordinates}
        defaultZoom={11}
        margin={[50, 50, 50, 50]}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: googleMapStyles,
        }}
        onChange={() => {}}
        onChildClick={() => {}}
      ></GoogleMapReact>
    </StyledDiv>
  );
};

export default Map;
