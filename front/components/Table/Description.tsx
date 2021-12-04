import { LatLngLiteral } from "leaflet";
import { headers, IMockData } from "pages/api/data";
import React, { MouseEvent, useRef } from "react";
import styled from "styled-components";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const StyledDiv = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: #00000033;
  z-index: 10;
  left: 0;
  top: 0;
  min-height: 1000px;

  .modal {
    position: absolute;
    left: 10vw;
    top: 10vh;
    width: 80vw;
    height: 80vh;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 12;
    background-color: white;
    border-radius: 5px;
    min-height: 900px;

    .data {
      margin: auto;
      width: 80%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      min-height: 800px;
      font-size: 1rem;

      h4 {
        font-weight: 500;
        font-size: 1.3rem;
      }

      .cell {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin: 0.5rem;
      }

      .footer {
        margin-top: auto;
        margin-bottom: 1rem;
        padding-top: 1rem;
        width: 100%;
        display: flex;
        justify-content: space-between;

        .sign {
          display: flex;
          flex-direction: column;
          .item {
            display: flex;
            justify-content: flex-end;
            margin: 0.5rem 0;
            .value {
              margin-left: 10px;
              width: 150px;
              display: block;
              border-bottom: 1px solid black;
            }
          }
        }
      }

      @media print {
        background-color: ${({ theme }) => theme.colors.base.darkBG};
        width: 80vw;
        padding: 1rem;
        margin-left: auto;
        margin-right: auto;
      }
    }

    .buttons {
      display: flex;
      width: 100%;
      justify-content: space-evenly;

      .button {
        padding: 1rem 3rem;
        text-transform: uppercase;
        background-color: inherit;
        outline: none;
        color: ${({ theme }) => theme.colors.text.dark};
        border: 1px solid ${({ theme }) => theme.colors.base.border};
        border-radius: 5px;
        box-shadow: none;
        cursor: pointer;

        &:hover {
          box-shadow: 0 0 10px ${({ theme }) => theme.colors.base.border};
        }
      }
    }
  }
`;

interface Props {
  data: IMockData;
  handleClose: (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
}

export const Description = ({ data, handleClose }: Props) => {
  const printable = useRef(null);
  const preparedData = Object.entries(headers).map(
    ([key, value]: [string, string | number | LatLngLiteral]) => {
      return {
        key,
        title: value,
        value: data[key as keyof IMockData],
      };
    }
  );
  console.log({ preparedData });
  const printDocument = (e: MouseEvent<HTMLButtonElement>) => {
    if (!printable.current) return;
    html2canvas(printable.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      //   adjust values if there's more info
      pdf.addImage(imgData, "JPEG", 20, 40, 170, 180, "report", "MEDIUM");
      pdf.save(
        `Отчет_о_загрязнении_${data.region}_${data.regNumber || ""}_${
          data.position.lat
        },${data.position.lng}.pdf`
      );
    });
    handleClose(e);
  };
  return (
    <StyledDiv>
      <div className="modal close">
        <div className="data" ref={printable}>
          <h4 className="h4">Данные о загрязнении</h4>
          {preparedData.map((el) =>
            el.key === "position" ? (
              <div key={el.key} className="cell">
                <span className="title">{el.title}: </span>
                <span className="value">{`${(el.value as LatLngLiteral).lat}, ${
                  (el.value as LatLngLiteral).lng
                }`}</span>
              </div>
            ) : (
              <div key={el.key} className="cell">
                <span className="title">{el.title}: </span>
                <span className="value">{el.value}</span>
              </div>
            )
          )}
          <div className="footer">
            <div className="date">
              <span className="name">Дата отчета </span>
              <span className="value">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="sign">
              <div className="item">
                <span className="name">ФИО сотрудника </span>
                <span className="value"></span>
              </div>
              <div className="item">
                <span className="name">Подпись сотрудника </span>
                <span className="value"></span>
              </div>
            </div>
          </div>
        </div>
        <div className="buttons">
          <button className="button close" onClick={handleClose}>
            назад
          </button>
          <button className="button" onClick={printDocument}>
            сохранить в PDF
          </button>
        </div>
      </div>
    </StyledDiv>
  );
};
