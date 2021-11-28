import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GoogleMapReact, { ChangeEventValue } from "google-map-react";
import { googleMapStyles } from "styles/googleMap.styles";
import useSWR from "swr";
import { IPlace } from "pages/api/places";
import Card from "./Card";

const StyledDiv = styled.div`
  background-color: #fafafa;
  width: 100%;
  height: 100%;
`;

interface Props {
  className?: string;
}
async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

const Map = ({ className }: Props) => {
  const [coordinates, setCoordinates] = useState({ lat: 55.75, lng: 37.64 });
  const { data } = useSWR<IPlace[]>("/api/places", fetcher);

  //   console.log(data);

  const onChangeHandler = (e: ChangeEventValue) => {
    console.log(e);
    setCoordinates({ lat: e.center.lat, lng: e.center.lng });
  };
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
        onChange={(...e) => {
          console.log(e);
        }}
        onChildClick={() => {}}
      >
        {data?.map((el) => (
          <Card key={el.title} {...el} />
        ))}
      </GoogleMapReact>
    </StyledDiv>
  );
};

export default Map;
