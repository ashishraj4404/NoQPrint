import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faCalendarDay,
  faCalendarWeek,
  faChartLine,
  faRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import PulseLoader from "react-spinners/PulseLoader";
import {useAuth} from "@clerk/clerk-react"

const Revenue = () => {
  const [revenueData, setRevenueData] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [loading, setLoading] = useState(true);
  const {getToken} = useAuth();

  useEffect(() => {
    const fetchRevenueData = async () => {
      const token = await getToken();
      try {
        const res = await axios.get("http://localhost:8000/api/revenue", {headers: {
          Authorization: `Bearer ${token}`,
        }}); // Change URL if hosted
        const { today, thisWeek, thisMonth, total, last10Days } = res.data;

        setRevenueData({ today, thisWeek, thisMonth, total });
        setChartData(last10Days);
      } catch (error) {
        console.error("Failed to fetch revenue data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  const maxIncome =
    chartData.length > 0 ? Math.max(...chartData.map((d) => d.income)) : 6000;
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PulseLoader color="#3B82F6" size={40} />
      </div>
    );
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <FontAwesomeIcon
              icon={faChartLine}
              className="text-blue-500 mr-3"
            />
            Revenue Dashboard
          </h1>
          <p className="text-gray-600">
            Track your printing service revenue and performance
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Today's Income */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCalendarDay}
                  className="text-blue-600 text-xl"
                />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Today's Income
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              ₹{revenueData.today.toLocaleString("en-IN")}
            </p>
          </div>

          {/* This Week's Income */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCalendarWeek}
                  className="text-green-600 text-xl"
                />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              This Week's Income
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              ₹{revenueData.thisWeek.toLocaleString("en-IN")}
            </p>
          </div>

          {/* This Month's Income */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-pink-600 text-xl"
                />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              This Month's Income
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              ₹{revenueData.thisMonth.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faRupeeSign}
                  className="text-orange-600 text-xl"
                />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Total Revenue
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              ₹{revenueData.total.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Bar Graph */}
        <div className="bg-blue-50 rounded-2xl p-8 shadow-lg border-2 border-black">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Last 10 Days Income
          </h2>

          <div className="relative">
            {chartData.length > 0 ? (
              <div className="flex items-end justify-between h-100 mb-4 px-4 relative overflow-auto">
                {chartData.map((data, index) => {
                  const barHeight = Math.max(
                    (data.income / maxIncome) * 280,
                    10
                  );
                  const isHovered = hoveredBar === index;

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1 mx-1"
                    >
                      <div className="relative flex items-end h-[280px]">
                        {isHovered && (
                          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-10">
                            <div className="font-medium">
                              {data.displayDate}
                            </div>
                            <div>₹{data.income.toLocaleString("en-IN")}</div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        )}
                        <div
                          className={`w-[max(20px,5vw)] rounded-t-lg transition-all duration-300 cursor-pointer ${
                            isHovered ? "bg-blue-600 shadow-lg" : "bg-blue-500"
                          }`}
                          style={{ height: `${barHeight}px` }}
                          onMouseEnter={() => setHoveredBar(index)}
                          onMouseLeave={() => setHoveredBar(null)}
                        ></div>
                      </div>
                      <div className="mt-3 text-xs text-gray-600 font-medium">
                        {data.displayDate}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-500">
                Loading chart data...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
