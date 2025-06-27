import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="py-12 bg-gray-900">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <span className="text-2xl font-bold text-white">NoQPrint</span>
            <p className="text-gray-400 mt-4">
              Making printing simple and efficient for everyone.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <div className="flex flex-col space-y-2">
              <a href="/" className="text-gray-400 hover:text-white">
                About Us
              </a>
              <a href="/" className="text-gray-400 hover:text-white">
                Services
              </a>
              <a href="/" className="text-gray-400 hover:text-white">
                Pricing
              </a>
              <a href="/" className="text-gray-400 hover:text-white">
                Contact
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
            <div className="flex flex-col space-y-2">
              <a href="/" className="text-gray-400 hover:text-white">
                Document Printing
              </a>
              <a href="/" className="text-gray-400 hover:text-white">
                Photo Printing
              </a>
              <a href="/" className="text-gray-400 hover:text-white">
                Binding Services
              </a>
              <a href="/" className="text-gray-400 hover:text-white">
                Business Printing
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <div className="flex flex-col space-y-2">
              <p className="text-gray-400">Email: info@noqprint.com</p>
              <p className="text-gray-400">Phone: (555) 123-4567</p>
              <div className="flex space-x-4 mt-4">
                <a href="/" className="text-gray-400 text-2xl hover:text-white">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="/" className="text-gray-400 text-2xl hover:text-white">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="/" className="text-gray-400 text-2xl hover:text-white">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
