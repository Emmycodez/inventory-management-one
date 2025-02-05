import React from "react";
import { useGetDashboardMetricsQuery } from "@/state/api";
import { div } from "motion/react-client";

const CardSalesSummary = () => {
  const { data, isError, isLoading } = useGetDashboardMetricsQuery();

  if (isError) {
    return <div className="m-5"> Failed to fetch data</div>;
  }
  return (
    <div className=" row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between ">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          {/* Header */}
          <div>
            <h2 className="text-lg font-semibold mb-2 px-2 pt-5">
              Sales Summary
            </h2>
          </div>

          {/* Body */}
          <div>
            <div className="flex justify-between items-center mb-6 px-7">
              <div className="text-lg font-medium">
                <p className="text-xs text-gray-400">Value</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardSalesSummary;
