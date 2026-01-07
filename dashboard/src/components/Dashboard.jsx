import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import MiniSummary from "./dashboard-components/MiniSummary";
import TopSellingProducts from "./dashboard-components/TopSellingProducts";
import Stats from "./dashboard-components/Stats";
import MonthlySalesChart from "./dashboard-components/MonthlySalesChart";
import OrdersChart from "./dashboard-components/OrdersChart";
import TopProductsChart from "./dashboard-components/TopProductsChart";
import { fetchDashboardStats } from "../store/slices/adminSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only fetch stats if user is authenticated and is Admin
    if (user && user.role === "Admin") {
      dispatch(fetchDashboardStats());
    }
  }, [dispatch, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <MiniSummary />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <MonthlySalesChart />
          <OrdersChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <TopProductsChart />
          <TopSellingProducts />
        </div>
        <div className="mt-6">
          <Stats />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
