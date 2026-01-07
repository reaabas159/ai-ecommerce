import React from "react";
import {
  Wallet,
  PackageCheck,
  TrendingUp,
  AlertTriangle,
  BarChart4,
  UserPlus,
} from "lucide-react";
import { useSelector } from "react-redux";
import { formatNumber } from "../../lib/helper";

const MiniSummary = () => {
  const {
    totalRevenueAllTime,
    todayRevenue,
    yesterdayRevenue,
    totalUsersCount,
    currentMonthSales,
    revenueGrowth,
    newUsersThisMonth,
    lowStockProducts,
  } = useSelector((state) => state.admin);

  const revenueChange =
    yesterdayRevenue > 0
      ? (((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(1)
      : 0;

  const cards = [
    {
      title: "Total Revenue",
      value: `$${formatNumber(totalRevenueAllTime)}`,
      icon: Wallet,
      color: "bg-blue-500",
      change: null,
    },
    {
      title: "Today's Revenue",
      value: `$${formatNumber(todayRevenue)}`,
      icon: BarChart4,
      color: "bg-green-500",
      change: revenueChange,
    },
    {
      title: "Monthly Sales",
      value: `$${formatNumber(currentMonthSales)}`,
      icon: PackageCheck,
      color: "bg-purple-500",
      change: revenueGrowth,
    },
    {
      title: "Total Users",
      value: formatNumber(totalUsersCount),
      icon: UserPlus,
      color: "bg-orange-500",
      change: newUsersThisMonth > 0 ? `+${newUsersThisMonth} this month` : null,
    },
    {
      title: "Low Stock Products",
      value: Array.isArray(lowStockProducts) ? lowStockProducts.length : 0,
      icon: AlertTriangle,
      color: "bg-red-500",
      change: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            {card.change !== null && (
              <p
                className={`text-sm mt-2 ${
                  typeof card.change === "string" && card.change.startsWith("+")
                    ? "text-green-600"
                    : parseFloat(card.change) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {typeof card.change === "string" ? (
                  card.change
                ) : (
                  <>
                    {parseFloat(card.change) >= 0 ? "↑" : "↓"}{" "}
                    {Math.abs(parseFloat(card.change))}%
                  </>
                )}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MiniSummary;
