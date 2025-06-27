import { useState } from "react";
import Navbar from "../../component/admin/Navbar";
import SideBar from "../../component/admin/SideBar";
import PriceSetting from "./PriceSetting";
import AllOrders from "./AllOrders"
import Revenue from "./Revenue";

const AdminLayout = () => {
  const [selected, setSelected] = useState("orders");
  return (
    <div className="">
  <Navbar />
  <div className="flex h-[calc(100vh-5rem)]">
    <SideBar selected={selected} setSelected={setSelected}/>
    <div className="bg-white w-screen overflow-y-auto">
      {selected === "orders" && <AllOrders />}
      {selected === "price" && <PriceSetting />}
      {selected === "revenue" && <Revenue />}
    </div>
  </div>
</div>
  )
};

export default AdminLayout
