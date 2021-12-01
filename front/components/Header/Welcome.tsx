interface Props {
  className?: string;
}

import styled from "styled-components";

const StyledDiv = styled.div`
  display: flex;
  align-items: center;

  .avatar {
    display: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: gray;
    margin-right: 1rem;
  }

  .text {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .h1 {
      font-size: 1.1rem;
      font-weight: 500;
      margin-top: 0;
      margin-bottom: 0.4rem;
    }

    .subheader {
      font-size: 0.9rem;
      font-weight: 300;
    }
  }

  @media (min-width: 850px) {
    .avatar {
      display: block;
    }
    .text {
      .h1 {
        font-size: 1.5rem;
      }

      .subheader {
        font-size: 1.1rem;
      }
    }
  }
`;

const Welcome = ({ className }: Props) => {
  return (
    <StyledDiv className={className}>
      <div className="avatar"></div>
      <div className="text">
        <h1 className="h1">Доброе утро, Максим</h1>
        <span className="subheader">Карта происшествий за последние сутки</span>
      </div>
    </StyledDiv>
  );
};

export default Welcome;
