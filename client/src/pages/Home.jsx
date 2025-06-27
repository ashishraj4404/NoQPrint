import printMan from "../assets/printMan.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faBook,
  faImages,
  faUpload,
  faSliders,
  faCreditCard,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-gray-100 to-white">
      {/* Hero Section */}
      <div className="px-8 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Print Your Documents
              <span className="text-blue-500"> Queue-Free</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Upload your files, customize your prints, and collect when ready.
              It's that simple!
            </p>
            <div className="flex space-x-4">
              <Link
                to="/upload"
                className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-orange-600 transition duration-300"
              >
                Uplaod Now
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={printMan}
              alt="Printing Service"
              className="relative w-200 "
            />
          </div>
        </div>
      </div>
      {/* Services Section */}
      <div className="py-20 bg-white/0">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-2xl transition duration-300">
              <div className="w-14 h-14 bg-blue-500 text-white text-2xl rounded-lg flex items-center justify-center mb-6">
                <FontAwesomeIcon icon={faPrint} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Document Printing
              </h3>
              <p className="text-gray-600">
                High-quality prints for all your documents, assignments, and
                projects.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition duration-300">
              <div className="w-14 h-14 bg-blue-500 text-white text-2xl rounded-lg flex items-center justify-center mb-6">
                <FontAwesomeIcon icon={faImages} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Photo Printing
              </h3>
              <p className="text-gray-600">
                Premium quality photo prints in various sizes and finishes.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition duration-300">
              <div className="w-14 h-14 bg-blue-500 text-white text-2xl rounded-lg flex items-center justify-center mb-6">
                <FontAwesomeIcon icon={faBook} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Binding Services
              </h3>
              <p className="text-gray-600">
                Professional binding options for reports and presentations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white text-2xl rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faUpload} />
              </div>
              <h3 className="text-lg font-bold mb-2">Upload Files</h3>
              <p className="text-gray-600">Upload your documents securely</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white text-2xl rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faSliders} />
              </div>
              <h3 className="text-lg font-bold mb-2">Choose Options</h3>
              <p className="text-gray-600">Select your printing preferences</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white text-2xl rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faCreditCard} />
              </div>
              <h3 className="text-lg font-bold mb-2">Make Payment</h3>
              <p className="text-gray-600">
                Pay securely online or during Pickup
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white text-2xl rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <h3 className="text-lg font-bold mb-2">Collect</h3>
              <p className="text-gray-600">Pick up your prints</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-500">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Printing?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Experience queue-free printing services today!
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-white text-blue-500 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition duration-300"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
