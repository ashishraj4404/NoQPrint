import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPalette,
  faPrint,
  faSave,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";
import { useAuth } from "@clerk/clerk-react";
const API_URL = import.meta.env.VITE_API_URL;

const PriceSetting = () => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchPriceRates = async () => {
     
      try {
        const res = await axios.get(`${API_URL}/api/pricing`);
        console.log(res.data);
        setRates(res.data[0]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPriceRates();
  }, []);

  const handleInputChange = (field, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setRates((prev) => ({
        ...prev,
        [field]: numValue,
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
      const token = await getToken();
    try {
      await axios.put(`${API_URL}/api/pricing`, rates, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      toast.success("Price rates has been updated successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to save pricing rates. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PulseLoader color="#3B82F6" size={40} />
      </div>
    );
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Pricing Settings
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FontAwesomeIcon
                  icon={faPrint}
                  className="text-gray-600 mr-2"
                />
                Black & White Printing
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    A4 Size (per page)
                  </label>
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-gray-600 mr-2">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={rates.bwA4}
                      onChange={(e) =>
                        handleInputChange("bwA4", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    A3 Size (per page)
                  </label>
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-gray-600 mr-2">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={rates.bwA3}
                      onChange={(e) =>
                        handleInputChange("bwA3", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FontAwesomeIcon
                  icon={faPalette}
                  className="text-red-500 mr-2"
                />
                Color Printing
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    A4 Size (per page)
                  </label>
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-gray-600 mr-2">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={rates.colorA4}
                      onChange={(e) =>
                        handleInputChange("colorA4", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    A3 Size (per page)
                  </label>
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-gray-600 mr-2">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={rates.colorA3}
                      onChange={(e) =>
                        handleInputChange("colorA3", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FontAwesomeIcon
                  icon={faTags}
                  className="text-green-500 mr-2"
                />
                Double-Sided Discount
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Amount (per page)
                </label>
                <div className="flex items-center">
                  <span className="text-lg font-medium text-gray-600 mr-2">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={rates.doubleSidedDiscount}
                    onChange={(e) =>
                      handleInputChange("doubleSidedDiscount", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Discount applied per page when customers choose double-sided
                  printing
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Current Rates Preview
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>B&W A4:</span>
                  <span className="font-medium">₹{rates.bwA4} per page</span>
                </div>
                <div className="flex justify-between">
                  <span>B&W A3:</span>
                  <span className="font-medium">₹{rates.bwA3} per page</span>
                </div>
                <div className="flex justify-between">
                  <span>Color A4:</span>
                  <span className="font-medium">₹{rates.colorA4} per page</span>
                </div>
                <div className="flex justify-between">
                  <span>Color A3:</span>
                  <span className="font-medium">₹{rates.colorA3} per page</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Double-sided discount:</span>
                  <span className="font-medium text-green-600">
                    ₹{rates.doubleSidedDiscount} per page
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50 flex items-center"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Save Rates
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceSetting;
