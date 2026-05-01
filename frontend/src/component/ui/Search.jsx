import { CiSearch } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";

const Search = ({ toggleSearch, setToggleSearch }) => {
  return (
    <div
      className={`${toggleSearch ? "bg-white" : ""} flex  absolute md:static  left-0 z-10 w-full h-full justify-center items-center`}
    >
      <div
        className="relative left-5 flex items-center justify-center  md:hidden"
        onClick={() => setToggleSearch(false)}
      >
        <RxCross1 size={22} />
      </div>
      <div className="flex items-center justify-center w-full">
        <input
          type="text"
          placeholder="Search for product..."
          className="text-sm font-sans text-gray-700 h-9 px-4 w-[60%] bg-white/40 backdrop-blur-xl outline-0 border border-orange-600 rounded-l-full"
        />

        <button className="cursor-pointer text-white border border-orange-600 bg-orange-600 rounded-r-full px-4 h-9">
          <CiSearch size={25} />
        </button>
      </div>
    </div>
  );
};

export default Search;
