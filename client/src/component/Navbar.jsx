import { useState } from "react";
import logo from "../assets/NoQPrint_logo(3).png";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsStaggered, faXmark } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all sticky top-0 z-10 overflow-x-hidden">
      <Link to="/">
        <img className="h-13" src={logo} alt="dummyLogo" />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8 font-medium">
        <Link to="/" href="#" className="hover:text-blue-600">
          Home
        </Link>
        <Link to="/upload" href="#" className="hover:text-blue-600">
          Uplaod
        </Link>
        <Link to="/myorders" href="#" className="hover:text-blue-600">
          My order
        </Link>
        <Link to="/my-coins" href="#" className="hover:text-blue-600">
          My Coins
        </Link>

        <SignedIn>
          <div
            onClick={handleSignOut}
            className="cursor-pointer px-8 py-2 bg-blue-500 hover:bg-blue-600 transition text-white rounded-full"
          >
            Logout
          </div>
        </SignedIn>
        <SignedOut>
          <Link
            to="/auth"
            className="cursor-pointer px-8 py-2 bg-blue-500 hover:bg-blue-600 transition text-white rounded-full"
          >
            Login
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>


        {/* Mobile Menu */}
        <div className="flex items-center gap-5 sm:hidden" >
          <SignedIn>
            <UserButton />
          </SignedIn>
          <div onClick={() => (open ? setOpen(false) : setOpen(true))}>
            {open === false ? (
            <FontAwesomeIcon icon={faBarsStaggered} className="text-xl" />
          ) : (
            <FontAwesomeIcon icon={faXmark} className="text-2xl" />
          )}
          </div>
          
        </div>

      <div
        className={`${
          open ? "translate-x-0" : "translate-x-full "
        } fixed top-[85px] right-0 w-2/3 h-screen bg-gray-100 shadow-xl py-5 flex flex-col items-start gap-5 px-10 text-lg font-semibold md:hidden
            transition-transform duration-300 ease-in-out transform`}
      >
        <div
          onClick={() => {
            setOpen(false);
            navigate("/");
          }}
        >
          Home
        </div>
        <div
          onClick={() => {
            setOpen(false);
            navigate("/upload");
          }}
        >
          Uplaod
        </div>
        <div
          onClick={() => {
            setOpen(false);
            navigate("/myorders");
          }}
        >
          My Orders
        </div>
        <div
          onClick={() => {
            setOpen(false);
            navigate("/my-coins");
          }}
        >
          My Coins
        </div>
        <SignedIn>
          <div
            onClick={handleSignOut}
            className="cursor-pointer px-4 py-2 bg-blue-500 hover:bg-blue-600 transition text-white rounded-full"
          >
            Logout
          </div>
        </SignedIn>
        <SignedOut>
          <Link
            to="/auth"
            className="cursor-pointer px-4 py-2 bg-blue-500 hover:bg-blue-600 transition text-white rounded-full"
          >
            Login
          </Link>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
