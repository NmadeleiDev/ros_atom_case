import type { NextPage } from "next";
import styled from "styled-components";
import useSWR from "swr";
import { Table, TableCompact } from "components/Table/Table";
import { Sort } from "components/Table/Sort";
import { useAppDispatch, useAppSelector } from "store/store";
import { IMockData } from "pages/api/data";
// import { addItems, IData } from "store/features/data";

const StyledDiv = styled.div`
  padding: 1rem;
  height: ${({ theme }) =>
    "calc(100vh - " + theme.dimentions.header.height + ")"};

  .h3 {
    width: 100%;
    text-align: center;
  }
`;
async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

const Dashboard: NextPage = () => {
  const dispatch = useAppDispatch();
  //   const data = useAppSelector((state) => state.data.data);
  const { data } = useSWR<IMockData[]>("/api/data", fetcher);
  console.log({ DashboardData: data });
  //   data && dispatch(addItems(data));
  return (
    <StyledDiv className="page">
      <h3 className="h3">Сводка за день</h3>
      <Sort />
      {/* {data && <Table data={data} />} */}
      {/* <br /> */}
      {data && <TableCompact data={data} />}
    </StyledDiv>
  );
};

export default Dashboard;
