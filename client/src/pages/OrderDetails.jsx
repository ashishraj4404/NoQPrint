import { useAuth, useUser } from "@clerk/clerk-react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

const OrderDetails = ({ selectedOrder, setSelectedOrder, setRefresh }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const getStatusColor = (status) => {
    const colors = {
      Ready: "bg-green-100 text-green-800",
      Processing: "bg-yellow-100 text-yellow-800",
      Completed: "bg-blue-100 text-blue-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };
  const handleCancelOrder = async () => {
    const token = await getToken();
    axios
      .put(
        `${API_URL}/api/orders/${selectedOrder._id}`,
        {
          status: "Cancelled",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async () => {
        if (
          selectedOrder.paymentMode === "Online" ||
          selectedOrder.paymentMode === "Coins"
        ) {
          await axios.post(
            `${API_URL}/api/user/update-coins`,
            {
              userId: user.id,
              amount: selectedOrder.totalPrice,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          toast.success(
            `${selectedOrder.totalPrice} coins has been added to your coin balance!`
          );
        }
        toast.success("Order has been Cancelled Successfully!");
        setSelectedOrder(null);
        setRefresh((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Order cancelation fail! Please Try Again");
        setSelectedOrder(null);
      });
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full z-50  flex items-center justify-center bg-black/80">
      <div className="bg-white rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
          <button
            onClick={() => setSelectedOrder(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Order ID
              </h3>
              <p className="text-gray-600">{selectedOrder._id}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Order Status
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                  selectedOrder.status
                )}`}
              >
                {selectedOrder.status}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Payment Status
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedOrder.status === "Cancelled"
                    ? "bg-yellow-100 text-yellow-800"
                    : selectedOrder.paymentMode === "Online" ||
                      selectedOrder.status === "Completed" ||
                      selectedOrder.paymentMode === "Coins"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedOrder.status === "Cancelled"
                  ? "Refunded"
                  : selectedOrder.paymentMode === "Online" ||
                    selectedOrder.paymentMode === "Coins" ||
                    selectedOrder.status === "Completed"
                  ? "Paid"
                  : "Unpaid"}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Payment Mode
              </h3>
              <p className="text-gray-600">
                {selectedOrder.paymentMode === "Online"
                  ? "Online payment"
                  : selectedOrder.paymentMode === "Coins"
                  ? "Coins"
                  : "Cash on pickup"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Files</h3>
            {selectedOrder.files.map((file, index) => (
              <div key={index} className="flex items-center text-gray-600 mb-2">
                <i className="fas fa-file-pdf mr-2 text-[#6366f1]"></i>
                {file.name} ({file.pages} pages)
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Paper Size
              </h3>
              <p className="text-gray-600">{selectedOrder.paperSize}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Color Mode
              </h3>
              <p className="text-gray-600">{selectedOrder.printType}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sides</h3>
              <p className="text-gray-600">{selectedOrder.sides}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Copies</h3>
              <p className="text-gray-600">{selectedOrder.copies}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Order Date
            </h3>
            <p className="text-gray-600">
              {new Date(selectedOrder.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Total Cost
            </h3>
            <p className="text-2xl font-bold text-blue-500">
              ₹{selectedOrder.totalPrice}
            </p>
          </div>

          <div className="flex justify-between pt-6">
            {selectedOrder.status === "Processing" ? (
              <button
                onClick={() => handleCancelOrder()}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel Order
              </button>
            ) : (
              <button
                //   onClick={() => handleReorder(selectedOrder)}

                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Reorder
              </button>
            )}
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
