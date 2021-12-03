import type { NextPage } from "next";
import styled from "styled-components";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { IData } from "pages/api/data";
import { Table } from "components/Table/Table";

const StyledDiv = styled.div`
  height: ${({ theme }) =>
    "calc(100vh - " + theme.dimentions.header.height + ")"};
`;
async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

const Dashboard: NextPage = () => {
  const { data } = useSWR<IData[]>("/api/data", fetcher);
  console.log({ DashboardData: data });
  return (
    <StyledDiv className="page">
      Dashboard {data && <Table data={data} />}
    </StyledDiv>
  );
};

export default Dashboard;
