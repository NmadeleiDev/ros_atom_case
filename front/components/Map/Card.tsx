import { IPlace } from "pages/api/places";
import styled from "styled-components";
import Image from "next/image";
import { IData } from "store/features/data";
import { LatLngLiteral } from "leaflet";

const StyledDiv = styled.div<any>`
  border-radius: 5px;
  background-color: inherit;
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

export const Card = (props: IData) => {
  const formatTime = (time: string) => {
    if (!time) return;
    const date = new Date(time);
    return date.toLocaleString();
  };
  return (
    <StyledDiv {...props} position={{ lat: props.lat, lng: props.lng }}>
      <Image
        src={
          "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2021-11-17/250m/8/41/75.jpg"
        }
        // src={`http://localhost/backend/img/${props.id}`}
        width={300}
        height={300}
        alt={`${props.location_name} oil spill`}
      />
      <div className="card">
        <span className="title">{props.location_name}</span>
        <div className="info">
          <div className="text">Координаты:</div>
          <div className="value">
            {props.lat.toFixed(2) + ", " + props.lng.toFixed(2)}
          </div>
        </div>
        <div className="info">
          <div className="text">ID:</div>
          <div className="value">{props.id}</div>
        </div>
        <div className="info">
          <div className="text">Площадь разлива:</div>
          <div className="value">{props.area_meters}м2</div>
        </div>
        <div className="info">
          <div className="text">Кровень загрязнения:</div>
          <div className="value">{props.level_of_pol}</div>
        </div>
        <div className="info">
          <div className="text">Время обнаружения:</div>
          <div className="value">{formatTime(props.last_spill_date)}</div>
        </div>
      </div>
    </StyledDiv>
  );
};
