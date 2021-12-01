import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GoogleMapReact, { ChangeEventValue } from "google-map-react";
import { googleMapStyles } from "styles/googleMap.styles";
import useSWR from "swr";
import { IPlace } from "pages/api/places";
import Card from "./Card";
import { useAppDispatch, useAppSelector } from "store/store";
import { setMapSlice } from "store/features/map";

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
  const { center, zoom } = useAppSelector((state) => state.map);
  const dispatch = useAppDispatch();
  const { data } = useSWR<IPlace[]>("/api/places", fetcher);

  const onChangeHandler = (e: ChangeEventValue) => {
    console.log(e);
    dispatch(setMapSlice(e));
  };
  return (
    <StyledDiv className={className}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API || "",
        }}
        defaultCenter={{ lat: 55.75, lng: 37.6 }}
        defaultZoom={10}
        center={center}
        zoom={zoom}
        margin={[50, 50, 50, 50]}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: googleMapStyles,
        }}
        onChange={onChangeHandler}
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
