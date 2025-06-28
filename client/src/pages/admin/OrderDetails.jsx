import { faFile, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import toast from "react-hot-toast";
import {useAuth} from "@clerk/clerk-react";
const API_URL = import.meta.env.VITE_API_URL;

const OrderDetails = ({
  selectedOrder,
  setSelectedOrder,
  getStatusColor,
  setOrders,
}) => {
  //   const [updateLoading, setUpdateLoading] = useState(false);
  const {getToken} = useAuth();
  const StatusUpdateButtons = ({ order }) => {
    const showReadyButton = order.status === "Processing";
    const showCompleteButton = order.status === "Ready";

    return (
      <div className="flex flex-col sm:flex-row gap-2">
        {showReadyButton && (
          <button
            onClick={() => updateOrderStatus(order._id, "Ready")}
            // disabled={updateLoading}
            className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            Mark Ready
          </button>
        )}
        {showCompleteButton && (
          <button
            onClick={() => updateOrderStatus(order._id, "Completed")}
            // disabled={updateLoading}
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Mark Completed
          </button>
        )}
      </div>
    );
  };
  const updateOrderStatus = async (orderId, newStatus) => {
    const token = await getToken();
    // setUpdateLoading(true);

    try {
      // ⬇️ Call your backend API to update the status
      await axios.put(
        `${API_URL}/api/orders/${orderId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Secure access
          }
        }
      );

      // ⬇️ Update the UI after successful update
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order Status has been updated successfully!");
      setSelectedOrder(null);
    } catch (error) {
      console.log("Error updating order status:", error);
      toast.error("Failed to update order status. Please try again.");
    } finally {
      // setUpdateLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Order Details - #{selectedOrder._id.slice(-6)}
          </h2>
          <button
            onClick={() => setSelectedOrder(null)}
            className="text-gray-400 hover:text-gray-500"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="px-4 sm:px-6 py-4 space-y-6">
          {/* Status Update Section */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              Order Status
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
                <StatusUpdateButtons order={selectedOrder} />
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              Student Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Name:{" "}
                <span className="text-gray-900">
                  {selectedOrder.owner.name}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Order ID:{" "}
                <span className="text-gray-900">{selectedOrder._id}</span>
              </p>
            </div>
          </div>

          {/* Files */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              Files
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {selectedOrder.files.map((file, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faFile}
                      className="text-blue-600 mr-2"
                    />
                    <span className="text-sm text-gray-900">{file.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({file.pages} pages)
                    </span>
                  </div>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Print Specifications */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              Print Specifications
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-sm text-gray-500">
                Paper Size:{" "}
                <span className="text-gray-900">{selectedOrder.paperSize}</span>
              </p>
              <p className="text-sm text-gray-500">
                Print Type:{" "}
                <span className="text-gray-900">{selectedOrder.printType}</span>
              </p>
              <p className="text-sm text-gray-500">
                Sides:{" "}
                <span className="text-gray-900">{selectedOrder.sides}</span>
              </p>
              <p className="text-sm text-gray-500">
                Copies:{" "}
                <span className="text-gray-900">{selectedOrder.copies}</span>
              </p>
              <p className="text-sm text-gray-500">
                Total Pages:{" "}
                <span className="text-gray-900">
                  {selectedOrder.totalPages}
                </span>
              </p>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              Payment Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Total Cost:{" "}
                <span className="text-gray-900">
                  ₹{selectedOrder.totalPrice}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Payment Mode:{" "}
                <span className="text-gray-900">
                  {selectedOrder.paymentMode}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
