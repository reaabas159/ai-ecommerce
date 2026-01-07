import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const TopProductsChart = () => {
  const { topSellingProducts } = useSelector((state) => state.admin);

  const chartData = Array.isArray(topSellingProducts)
    ? topSellingProducts.slice(0, 5).map((product) => ({
        name: product.name?.substring(0, 15) + (product.name?.length > 15 ? "..." : ""),
        sales: parseInt(product.total_sold) || 0,
      }))
    : [];

  const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="font-semibold mb-4 text-gray-900">Top Products Sales</h3>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="font-semibold mb-4 text-gray-900">Top Products Sales</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} units`, "Sales"]}
            labelStyle={{ color: "#374151" }}
          />
          <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductsChart;
