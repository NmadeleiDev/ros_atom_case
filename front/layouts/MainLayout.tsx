import React, { FC } from "react";

interface Props {
  className?: string;
}

const MainLayout: FC<Props> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export default MainLayout;
