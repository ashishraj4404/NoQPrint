import { Link } from "react-router-dom";
import logo from "../../assets/NoQPrint_logo(3).png";
import { SignedIn, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-5 lg:px-15 py-4 border-b border-gray-300 bg-white sticky top-0 z-10 h-[5rem]">
      <Link to="/">
        <img className="h-13" src={logo} alt="dummyLogo" />
      </Link>
      <div className="flex items-center gap-5">
        <span>Hi, Admin</span>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
