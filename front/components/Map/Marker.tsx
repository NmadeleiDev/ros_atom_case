import { meters2ScreenPixels } from "google-map-react";
import { useAppSelector } from "store/store";
import styled from "styled-components";

const MINIMUM_MARKER_SIZE = 50;
/**
 * TODO: adjust values according to the data from orgs
 */
const BLUE_COLOR_MARKER_THRESHHOLD = 2000;
const ORANGE_COLOR_MARKER_THRESHHOLD = 10000;

interface IMarkerProps {
  onClick: () => void;
  square: number;
  lat: number;
  lng: number;
}

const StyledCircle = styled.div<{ w: number; h: number; square: number }>`
  background-color: ${({ square, theme }) =>
    square < BLUE_COLOR_MARKER_THRESHHOLD
      ? theme.colors.message.info
      : square < ORANGE_COLOR_MARKER_THRESHHOLD
      ? theme.colors.message.warn
      : theme.colors.message.error};
  width: ${({ w }) => w + "px"};
  height: ${({ h }) => h + "px"};
  border-radius: 50%;
`;

export const Marker = ({ onClick, square, lat, lng }: IMarkerProps) => {
  const { zoom } = useAppSelector((state) => state.map);
  const { w, h } = meters2ScreenPixels(square, { lat, lng }, zoom);
  return (
    <StyledCircle
      onClick={onClick}
      square={square}
      w={Math.max(w, MINIMUM_MARKER_SIZE)}
      h={Math.max(h, MINIMUM_MARKER_SIZE)}
    />
  );
};
