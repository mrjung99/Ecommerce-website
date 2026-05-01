import { IoIosHeartEmpty } from "react-icons/io";

const HeartIcon = () => {
  return (
    <div className="relative">
      <IoIosHeartEmpty
        size={22}
        className="fill-current cursor-pointer text-gray-700"
      />

      <span className="absolute -top-2 -right-2 bg-orange-600 text-[10px] outline outline-gray-50 text-white font-sans font-thin rounded-full w-4 h-4 flex items-center justify-center">
        1
      </span>
    </div>
  );
};

export default HeartIcon;
