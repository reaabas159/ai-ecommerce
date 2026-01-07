import React from "react";
import { formatNumber } from "../../lib/helper";
import { useSelector } from "react-redux";

const Stats = () => {
  const {
    totalRevenueAllTime,
    todayRevenue,
    yesterdayRevenue,
    totalUsersCount,
    currentMonthSales,
    revenueGrowth,
    newUsersThisMonth,
    orderStatusCounts,
  } = useSelector((state) => state.admin);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border-l-4 border-blue-500 pl-4">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">
            ${formatNumber(totalRevenueAllTime)}
          </p>
        </div>
        <div className="border-l-4 border-green-500 pl-4">
          <p className="text-sm text-gray-600">Today's Revenue</p>
          <p className="text-2xl font-bold text-gray-900">
            ${formatNumber(todayRevenue)}
          </p>
        </div>
        <div className="border-l-4 border-purple-500 pl-4">
          <p className="text-sm text-gray-600">Monthly Sales</p>
          <p className="text-2xl font-bold text-gray-900">
            ${formatNumber(currentMonthSales)}
          </p>
          <p className="text-sm text-green-600 mt-1">{revenueGrowth}</p>
        </div>
        <div className="border-l-4 border-orange-500 pl-4">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatNumber(totalUsersCount)}
          </p>
          {newUsersThisMonth > 0 && (
            <p className="text-sm text-green-600 mt-1">
              +{newUsersThisMonth} this month
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Order Status Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(orderStatusCounts || {}).map(([status, count]) => (
            <div
              key={status}
              className="bg-gray-50 rounded-lg p-4 text-center"
            >
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-600">{status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
