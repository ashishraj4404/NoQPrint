import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClock,
  faEdit,
  faEye,
  faFileAlt,
  faFilePdf,
  faFlagCheckered,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import OrderDetails from "./OrderDetails";
import EditOrder from "./EditOrder";
import { useUser, useAuth } from "@clerk/clerk-react";
import PulseLoader from "react-spinners/PulseLoader";
const API_URL = import.meta.env.VITE_API_URL;

const MyOrders = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const {getToken} = useAuth()
  useEffect(() => {
    try {
      const fetchOrderData = async () => {
        const token = await getToken();
        const res = await axios.get(`${API_URL}/api/orders`, {
          params: { userId: user.id },
          headers: {
          Authorization: `Bearer ${token}`,
        },
        });
        setOrders(res.data.filter((order) => order.status !== "Pending"));
      };
      fetchOrderData();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  useEffect(() => window.scrollTo(0, 0), []);

  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      Ready: "bg-green-100 text-green-800",
      Processing: "bg-yellow-100 text-yellow-800",
      Completed: "bg-blue-100 text-blue-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredOrders = orders.filter((order) =>
    filterStatus === "all" ? true : order.status === filterStatus
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return b.totalPrice - a.totalPrice;
  });

  const stats = {
    total: orders.length,
    Processing: orders.filter((o) => o.status === "Processing").length,
    ready: orders.filter((o) => o.status === "Ready").length,
    completed: orders.filter((o) => o.status === "Completed").length,
  };
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PulseLoader color="#3B82F6" size={40} />
      </div>
    );
  return (
    <div className="bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 md:mb-0">
            My Orders
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-200 bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-blue-600 text-xl"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-yellow-800 text-xl"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Processing</p>
                <p className="text-2xl font-bold">{stats.Processing}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-green-800 text-xl"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ready for Pickup</p>
                <p className="text-2xl font-bold">{stats.ready}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <FontAwesomeIcon
                  icon={faFlagCheckered}
                  className="text-blue-800 text-xl"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                <option value="all">All Orders</option>
                <option value="Processing">Processing</option>
                <option value="Ready">Ready</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                <option value="date">Sort by Date</option>
                <option value="cost">Sort by Cost</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedOrders.map((order) => (
              <div key={order._id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === "Cancelled"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.paymentMode === "Online" ||
                          order.paymentMode === "Coins" ||
                          order.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status === "Cancelled"
                      ? "Refunded"
                      : order.paymentMode === "Online" ||
                        order.paymentMode === "Coins" ||
                        order.status === "Completed"
                      ? "Paid"
                      : "Unpaid"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="font-medium mb-4">{order._id}</div>
                  <div>
                    {order.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          className="mr-2 text-blue-600"
                        />
                        {file.name} ({file.pages} pages)
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    <FontAwesomeIcon icon={faPrint} className="mr-2" />
                    {order.printType}, {order.paperSize}, {order.sides}
                  </div>
                  <div className="text-sm text-gray-600">
                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-lg font-bold text-blue-500">
                    ₹{order.totalPrice}
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 bg-white border border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300"
                    >
                      <FontAwesomeIcon icon={faEye} className="mr-2" />
                      View Details
                    </button>
                    {order.status === "Processing" && (
                      <button
                        onClick={() => {
                          setIsEditMode(true);
                          setSelectedOrder(order);
                        }}
                        className="flex-1 border bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedOrder &&
        (isEditMode ? (
          <EditOrder
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            setIsEditMode={setIsEditMode}
          />
        ) : (
          <OrderDetails
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            setRefresh={setRefresh}
          />
        ))}
    </div>
  );
};

export default MyOrders;
