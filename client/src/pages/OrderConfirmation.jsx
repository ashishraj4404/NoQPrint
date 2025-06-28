import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClock,
  faInfoCircle,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useSearchParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const OrderConfirmation = () => {
  const [params] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  let storedOrderId = params.get("orderId");
  console.log(storedOrderId);
  useEffect(() => {
    if (!storedOrderId) {
      setLoading(false);
      return;
    }
    console.log(storedOrderId);

    let attempts = 0;
    const maxAttempts = 10;

    const checkOrderStatus = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/orders/${storedOrderId}`
        );
        const order = res.data;

        setOrderDetails(order);

        if (order.status === "Processing" || attempts >= maxAttempts) {
          setLoading(false);
          clearInterval(pollingInterval);
        }

        attempts++;
      } catch (error) {
        console.error("Error fetching order:", error);
        setLoading(false);
        clearInterval(pollingInterval);
      }
    };

    const pollingInterval = setInterval(checkOrderStatus, 1000);

    return () => clearInterval(pollingInterval);
  }, []);
  useEffect(() => window.scrollTo(0, 0), []);
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PulseLoader color="#3B82F6" size={40} />
      </div>
    );
  else if (!storedOrderId || !orderDetails || orderDetails.status === "Pending")
    return (
      <div className="h-screen flex justify-center items-center">
        <h1>No Order has been placed yet!</h1>
      </div>
    );
  return (
    <div className="bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 text-4xl text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Your print order has been successfully placed.
          </p>
          <div className="mt-4">
            <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
              Status: {orderDetails.status}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Order Details</h2>
            <span className="text-gray-600">
              ordered_at : {formatDate(orderDetails.createdAt)}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap justify-between py-3 border-b gap-3">
              <span className="text-gray-600">Order ID</span>
              <span className="font-medium">{orderDetails._id}</span>
            </div>

            <div className="py-3 border-b">
              <div className="font-medium mb-2">Files</div>
              {orderDetails.files.map((file, index) => (
                <div
                  key={index}
                  className="flex flex-wrap justify-between text-sm text-gray-600 "
                >
                  <span>{file.name}</span>
                  <span>{file.pages} pages</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-between py-3 border-b gap-3">
              <span className="text-gray-600">Total Pages</span>
              <span>
                {orderDetails.totalPages} pages × {orderDetails.copies} copies
              </span>
            </div>

            <div className="flex flex-wrap justify-between py-3 border-b gap-3">
              <span className="text-gray-600">Print Specifications</span>
              <span>
                {orderDetails.printType}, {orderDetails.paperSize},{" "}
                {orderDetails.sides}
              </span>
            </div>

            <div className="flex justify-between py-3 border-b gap-3">
              <span className="text-gray-600">Total Cost</span>
              <span className="font-bold">₹{orderDetails.totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Collection Information</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <FontAwesomeIcon
                icon={faClock}
                className="mr-3 pt-1 text-2xl text-blue-500"
              />
              <div>
                <p className="font-medium">Expected Collection Time</p>
                <p className="text-gray-600">Today 4:00 PM</p>
              </div>
            </div>
            <div className="flex items-start ">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="mr-3 pt-1 text-3xl text-blue-500"
              />
              <div>
                <p className="font-medium">Collection Location</p>
                <p className="text-gray-600">IIT Patna - PrintHUB</p>
              </div>
            </div>
            <div className="flex items-start">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="mr-3 pt-1 text-2xl text-blue-500"
              />
              <div>
                <p className="font-medium">Collection Instructions</p>
                <p className="text-gray-600">
                  Please bring your Order ID when collecting your prints.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-500 rounded-xl shadow-sm p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">Need Help?</h2>
          <p className="mb-6">
            If you have any questions about your order, our support team is here
            to help.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <i className="fas fa-envelope mr-4"></i>
              <span>support@printease.com</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-phone mr-4"></i>
              <span>(555) 123-4567</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <Link
            to="/myorders"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            View My Orders
          </Link>
          <Link
            to="/"
            className="border-2 border-blue-500 text-blue-500 px-6 py-3 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
