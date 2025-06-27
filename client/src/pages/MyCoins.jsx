import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const MyCoins = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { getToken } = useAuth();
  const [coins, setCoins] = useState();
  const [params] = useSearchParams();
  useEffect(() => {
  const fetchCoinBalance = async () => {
    try {
      const token = await getToken();

      const res = await axios.get("http://localhost:8000/api/user/coins", {
        params: { userId: user.id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBalance(res.data);
    } catch (err) {
      console.error("Failed to fetch coins:", err);
    } finally {
      const success = params.get("success");
      if (success) {
      toast.success(
            `${success} coins has been added to your coin balance!`
          );
      }
      setLoading(false);
  };
  }
  fetchCoinBalance();
}, []);

  const handlePurchaseCoins = async() => {
    if(coins < 50 ) {
      toast.error("Minimum 50 coins needs to be purchased!");
      return;
    }
    const res = await axios.post("http://localhost:8000/api/create-checkout-session/coins", {amount : coins, userId : user.id});
    window.location.href = res.data.url;

  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PulseLoader color="#3B82F6" size={40} />
      </div>
    );
  return (
    <div className="bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <i className="fas fa-coins text-[#fbbf24] mr-3"></i>
            <FontAwesomeIcon icon={faCoins} className=" text-[#fbbf24] mr-3" />
            My Coins
          </h1>
          <p className="text-xl text-gray-600">
            Use coins to pay for your printing orders
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-400 via-blue-600 to-blue-500 rounded-2xl shadow-xl p-8 relative overflow-hidden text-white">
          <h2 className="text-2xl font-bold mb-6">Current Coins</h2>
          <div className="py-3 bg-black/25 rounded-xl flex items-center justify-center">
            <span className="text-5xl font-bold">{balance}</span>
          </div>
          <div className="rounded-lg p-4">
            <h3 className="font-bold mb-2">How it works:</h3>
            <ul className="text-sm font-semibold space-y-1">
              <li>• 1 coin = ₹1 printing credit</li>
              <li>• Coins are deducted when you place orders using coins</li>
              <li>• Purchase coins in advance for faster checkout</li>
            </ul>
          </div>
          <div className="flex justify-between gap-4 mt-2">
            <input type="number" placeholder="Enter coins to purchase" className="flex-1 bg-black/25 rounded-lg text-center text-lg" 
            value={coins} onChange={(e) => setCoins(e.target.value)}
            />
            <button
            onClick={handlePurchaseCoins}
            className="flex-1 bg-white text-blue-500 px-4 py-4  rounded-lg text-xl font-bold hover:scale-102 transition duration-300 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Purchase Coins
          </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default MyCoins;
