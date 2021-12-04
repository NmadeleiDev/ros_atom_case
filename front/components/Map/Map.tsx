import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { IData } from "store/features/data";
import { useAppDispatch, useAppSelector } from "store/store";
import { setMapSlice } from "store/features/map";
import { MapContainer, Popup, TileLayer } from "react-leaflet";
import { Map as LeafletMap } from "leaflet";
import { debounce } from "lib/utils";
import { Marker } from "components/Map/Marker";
import { addItems } from "store/features/data";

const StyledDiv = styled.div`
  background-color: #fafafa;
  width: 100%;
  height: 100%;
`;

interface Props {
  className?: string;
}
interface IResponse {
  status: true;
  error: null;
  data: IData[];
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
  const [map, setMap] = useState<LeafletMap>();
  const dispatch = useAppDispatch();
  const { data } = useSWR<IResponse>(
    "http://localhost/backend/records",
    fetcher
  );
  console.log(data);
  data && dispatch(addItems(data.data));

  const onMove = useCallback(() => {
    const onMoveCallback = debounce(() => {
      const { lat, lng } = map?.getCenter() || center;
      const newZoom = map?.getZoom() || zoom;
      dispatch(setMapSlice({ center: { lat, lng }, zoom: newZoom }));
    }, 1000);
    onMoveCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    map?.on("move", onMove);
    return () => {
      map?.off("move", onMove);
    };
  }, [map, onMove]);

  return (
    <StyledDiv className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map: LeafletMap) => setMap(map)}
      >
        <TileLayer
          maxZoom={20}
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        />

        {data?.data?.map((el, i) => (
          <Marker key={el.location_name + i} {...el} />
        ))}
      </MapContainer>
    </StyledDiv>
  );
};

export default Map;
