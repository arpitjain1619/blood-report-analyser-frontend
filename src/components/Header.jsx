import logo from "../assets/logo.webp";

const Header = () => {
  return (
    <div className="flex items-center justify-between border-b border-gray-800 h-50">
      <img className="w-20 h-20 m-5 rounded-md" src={logo} />
      <h1 className="text-4xl mr-5">Blood Report Analyzer</h1>
    </div>
  );
};

export default Header;
