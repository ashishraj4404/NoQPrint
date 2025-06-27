import {
  faFileInvoice,
  faReorder,
  faSquareCheck,
  faTags,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SideBar = ({ selected, setSelected }) => {
  return (
    <div className="w-16 md:w-[20%] border-r-1 border-gray-300">
      <div className="flex flex-col mt-3">
        <div
          onClick={() => setSelected("orders")}
          style={
            selected === "orders"
              ? { background: "#dbeafe", borderRight: "8px solid #3b82f6" }
              : {}
          }
          className="flex gap-4 items-center pl-5 h-15 text-lg hover:bg-gray-100"
        >
          <div>
            <FontAwesomeIcon icon={faSquareCheck} />
          </div>
          <span className="hidden md:inline">Orders</span>
        </div>
        <div
          onClick={() => setSelected("price")}
          style={
            selected === "price"
              ? { background: "#dbeafe", borderRight: "8px solid #3b82f6" }
              : {}
          }
          className="flex gap-4 items-center pl-5 h-15 text-lg hover:bg-gray-100"
        >
          <div>
            <FontAwesomeIcon icon={faTags} />
          </div>
          <span className="hidden md:inline">Pricing</span>
        </div>
        <div
          onClick={() => setSelected("revenue")}
          style={
            selected === "revenue"
              ? { background: "#dbeafe", borderRight: "8px solid #3b82f6" }
              : {}
          }
          className="flex gap-4 items-center pl-5 h-15 text-lg hover:bg-gray-100"
        >
          <div>
            <FontAwesomeIcon icon={faFileInvoice} />
          </div>
          <span className="hidden md:inline">Revenue</span>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
