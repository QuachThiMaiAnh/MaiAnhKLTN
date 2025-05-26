interface SearchInputProps {
  toggleSearch: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ toggleSearch }) => {
  return (
    <div className=" relative flex justify-center items-center min-h-36 shadow-lg ">
      <div className="w-full max-w-2xl">
        <div className="relative">
          {/* Input Field */}
          <div className="border-b-2 border-b-lime-400">
            <input
              type="text"
              placeholder="Enter keyword"
              className="w-full py-2 text-base border-none text-gray-600 placeholder-gray-500 focus:outline-none focus:border-transparent "
              style={{
                outline: "none",
                boxShadow: "none",
              }}
            />
          </div>

          {/* Search Icon */}
          <button className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={toggleSearch}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchInput;
