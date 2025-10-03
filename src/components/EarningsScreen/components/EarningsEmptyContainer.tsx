import React from "react";
import EarningsListContainer from "./EarningsListContainer";

interface EarningsEmptyContainerProps {
  isDark: boolean;
}

const EarningsEmptyContainer: React.FC<EarningsEmptyContainerProps> = ({
  isDark,
}) => {
  return <EarningsListContainer isDark={isDark} />;
};

export default EarningsEmptyContainer;
