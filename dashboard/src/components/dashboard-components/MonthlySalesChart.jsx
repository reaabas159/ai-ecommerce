import { useSelector } from "react-redux";
import {
  XAxis,
  YAxis,
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MonthlySalesChart = () => {
  const { monthlySales } = useSelector((state) => state.admin);

  const chartData = Array.isArray(monthlySales)
    ? monthlySales.map((item) => ({
        month: item.month,
        sales: parseFloat(item.totalsales) || 0,
      }))
    : [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="font-semibold mb-4 text-gray-900">Monthly Sales</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value) => `$${value.toFixed(2)}`}
            labelStyle={{ color: "#374151" }}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySalesChart;
