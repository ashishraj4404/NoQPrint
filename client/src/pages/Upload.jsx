import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faFileAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";
const API_URL = import.meta.env.VITE_API_URL;

const Upload = () => {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { getToken } = useAuth();
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/pricing`);
        const data = res.data[0];

        const formattedPrices = {
          bw: {
            A4: data.bwA4,
            A3: data.bwA3,
          },
          color: {
            A4: data.colorA4,
            A3: data.colorA3,
          },
          doubleSided: -data.doubleSidedDiscount,
        };

        setPrices(formattedPrices);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch price rates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);
  const { user } = useUser();
  const userId = user.id;
  let totalPage = 0;
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [printSettings, setPrintSettings] = useState({
    copies: 1,
    color: "bw",
    paperSize: "A4",
    sides: "single",
    paymentMethod: "Online",
  });
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const newFiles = Array.from(e.target.files);
    for (const file of newFiles) {
      try {
        let pageCount = 1;
        if (file.type === "application/pdf") {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          pageCount = pdfDoc.getPageCount();
        }
        setTotalPages((prev) => prev + pageCount);
        if (error) {
          setError(error);
          return;
        }
        setFiles((prev) => [
          ...prev,
          { name: file.name, pages: pageCount, fileData: file },
        ]);
      } catch (err) {
        setError("Error uploading file");
        console.error(err);
      }
    }
  };

  const removeFile = (index) => {
    setTotalPages((prev) => prev - files[index].pages);
    setFiles(files.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const basePrice =
      totalPages *
      printSettings.copies *
      (printSettings.color === "bw"
        ? prices.bw[printSettings.paperSize]
        : prices.color[printSettings.paperSize]);
    const discount =
      printSettings.sides === "double"
        ? totalPages * printSettings.copies * prices.doubleSided
        : 0;
    return (basePrice + discount).toFixed(2);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const token = await getToken();
    if (printSettings.paymentMethod === "Coins") {
      const res = await axios.get(`${API_URL}/api/user/coins`, {
        params: { userId: user.id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const coinBalance = res.data;
      if (coinBalance < parseFloat(calculateTotal())) {
        toast.error("Insufficient Coins to place this Order!");
        return;
      }
    } else if (
      printSettings.paymentMethod === "Online" &&
      calculateTotal() < 50
    ) {
      toast.error("Minimum Order amount should be ₹50 for online payment");
      return;
    }
    setOrderPlaced(true);
    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file.fileData);
    }
    try {
      const res = await axios.post(
        `${API_URL}/api/upload`,
        formData
      );
      const uploadedFiles = res.data;
      const updatedFiles = files.map((file) => {
        const uploaded = uploadedFiles.find(
          (f) => f.originalname === file.name
        );

        return {
          ...file,
          url: uploaded?.path || "",
        };
      });
      const orderData = {
        files: updatedFiles.map((file) => ({
          name: file.name,
          url: file.url,
          type: file.name.split(".").pop().toLowerCase().includes("pdf")
            ? "pdf"
            : "image",
          pages: file.pages,
        })),
        printType: printSettings.color === "bw" ? "Black & White" : "Color",
        copies: printSettings.copies,
        totalPrice: parseFloat(calculateTotal()),
        paymentMode:
          printSettings.paymentMethod === "Online"
            ? "Online"
            : printSettings.paymentMethod === "Coins"
            ? "Coins"
            : "Cash",
        sides:
          printSettings.sides === "double" ? "double sided" : "Single-Sided",
        paperSize: printSettings.paperSize,
        totalPages: totalPages,
        status:
          printSettings.paymentMethod === "Online" ? "Pending" : "Processing",
      };
      try {
        const response = await axios.post(
          `${API_URL}/api/orders`,
          { orderData, userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (printSettings.paymentMethod === "Coins") {
          await axios.post(
            `${API_URL}/api/user/update-coins`,
            {
              userId,
              amount: -parseFloat(calculateTotal()),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          toast.success(
            `${parseFloat(
              calculateTotal()
            )} coins has been deducted from your coin balance!`
          );
        }
        if (printSettings.paymentMethod !== "Online") {
          navigate(`/orderconfirm?orderId=${response.data._id}`);
        }

        const res = await axios.post(
          `${API_URL}/api/create-checkout-session/order`,
          {
            orderId: response.data._id,
            amount: parseFloat(calculateTotal()),
          }
        );
        window.location.href = res.data.url;
      } catch (error) {
        setOrderPlaced(false);
        console.error(error);
      }
    } catch (err) {
      setOrderPlaced(false);
      console.error("Upload failed:", err);
      toast.error("Something went wrong while placing your order!");
    }
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Upload Your Files
        </h1>

        {/* Pricing Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-4">Printing Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Black & White Printing:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>A4 Size: ₹{prices.bw.A4} per page</li>
                <li>A3 Size: ₹{prices.bw.A3} per page</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Color Printing:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>A4 Size: ₹{prices.color.A4} per page</li>
                <li>A3 Size: ₹{prices.color.A3} per page</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            *Double-sided printing: ₹{Math.abs(prices.doubleSided)} discount per
            page
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                  accept=".pdf,.jpg,.png"
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <FontAwesomeIcon
                    icon={faCloudUploadAlt}
                    className="text-4xl text-blue-500 mb-4"
                  />
                  <p className="text-gray-600">
                    Click here to upload the files
                  </p>
                </label>
              </div>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Print Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Number of Copies
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={printSettings.copies}
                    onChange={(e) =>
                      setPrintSettings({
                        ...printSettings,
                        copies: parseInt(e.target.value),
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Color Options
                  </label>
                  <select
                    value={printSettings.color}
                    onChange={(e) =>
                      setPrintSettings({
                        ...printSettings,
                        color: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option value="bw">Black & White</option>
                    <option value="Color">Color</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Paper Size</label>
                  <select
                    value={printSettings.paperSize}
                    onChange={(e) =>
                      setPrintSettings({
                        ...printSettings,
                        paperSize: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option value="A4">A4</option>
                    <option value="A3">A3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Print Sides
                  </label>
                  <select
                    value={printSettings.sides}
                    onChange={(e) =>
                      setPrintSettings({
                        ...printSettings,
                        sides: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option value="single">1-sided</option>
                    <option value="double">2-sided</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={printSettings.paymentMethod}
                    onChange={(e) =>
                      setPrintSettings({
                        ...printSettings,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option value="Online">Online Payment</option>
                    <option value="Coins">Pay using Coins</option>
                    <option value="cod">Cash on Pickup</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6">
                Files ({files.length})
              </h2>
              <div className="max-h-50 overflow-auto scroll-hide space-y-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex items-center ">
                      <FontAwesomeIcon
                        icon={faFileAlt}
                        className="text-blue-500 text-xl mr-3"
                      />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {file.pages} {file.pages === 1 ? "page" : "pages"}
                        </p>
                        <p className="text-sm text-gray-500"></p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 w-7 h-7 rounded-full hover:bg-red-200 hover:text-red-700 cursor-pointer duration-200 ease-in-out"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ))}
                {files.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No files uploaded yet
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm mt-8">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Number of Files:</span>
                  <span>{files.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Pages:</span>
                  <span>{totalPages}</span>
                </div>
                <div className="flex justify-between">
                  <span>Copies per Page:</span>
                  <span>{printSettings.copies}</span>
                </div>
                <div className="flex justify-between">
                  <span>Print Type:</span>
                  <span>
                    {printSettings.color === "bw" ? "Black & White" : "Color"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Paper Size:</span>
                  <span>{printSettings.paperSize.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Print Sides:</span>
                  <span>
                    {printSettings.sides === "single" ? "1-sided" : "2-sided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Price per Page:</span>
                  <span>
                    ₹
                    {printSettings.color === "bw"
                      ? prices.bw[printSettings.paperSize]
                      : prices.color[printSettings.paperSize]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Double-sided Discount:</span>
                  <span>
                    {printSettings.sides === "double"
                      ? `₹${Math.abs(prices.doubleSided)} per page`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>
                    {printSettings.paymentMethod === "Online"
                      ? "Online Payment"
                      : printSettings.paymentMethod === "Coins"
                      ? "Pay using Coins"
                      : "Cash on Pickup"}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total Amount:</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={files.length === 0 || orderPlaced}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg mt-4 hover:bg-blue-600 disabled:bg-gray-300"
                >
                  {orderPlaced ? (
                    <span className="flex items-center justify-center gap-2 text-blue-500">
                      Please Wait <PulseLoader color="#3B82F6" size={7} />
                    </span>
                  ) : printSettings.paymentMethod === "Online" ? (
                    "Proceed to Online Payment"
                  ) : printSettings.paymentMethod === "Coins" ? (
                    "Pay using Coins"
                  ) : (
                    "Place Order (Cash on Pickup)"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
