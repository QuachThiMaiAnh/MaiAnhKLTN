import collection1 from "../../../../assets/img/products/images5.jpg";
import collection2 from "../../../../assets/img/products/images6.jpg";
const Collections = () => {
  const collections = [
    {
      id: 1,
      title: "Collection 1",
      imgSrc: collection1,
    },
    {
      id: 2,
      title: "Collection 2",
      imgSrc: collection2,
    },
    {
      id: 3,
      title: "Collection 3",
      imgSrc: collection1,
    },
    {
      id: 4,
      title: "Collection 4",
      imgSrc: collection2,
    },
    {
      id: 5,
      title: "Collection 5",
      imgSrc: collection1,
    },
    {
      id: 6,
      title: "Collection 6",
      imgSrc: collection2,
    },
  ];

  return (
    <div>
      <div className=" mx-auto p-5">
        <div className="flex flex-col md:flex-row justify-between mt-[100px] items-center">
          <div className="md:basis-2/4 font-medium text-[30px] md:text-[55px] leading-none text-center md:text-left">
            <p>Elevate Your Look with Our Trendsetting Collection</p>
          </div>
          <div className="mt-4 md:mt-0 md:basis-1/4 text-[16px] md:text-[20px] leading-7 text-center md:text-left">
            <p className="opacity-50">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Enim
              porro praesentium tenetur numquam deleniti perspiciatis
            </p>
          </div>
        </div>
      </div>

      <div
        className="overflow-x-scroll whitespace-nowrap mt-[30px] w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="inline-flex">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="relative m-2"
              style={{ minWidth: "600px", minHeight: "300px" }}
            >
              <img
                src={collection.imgSrc}
                alt={collection.title}
                className="w-full h-full object-cover rounded-3xl"
              />
              <div className="absolute bottom-5 left-5 bg-black bg-opacity-60 text-white p-2 rounded-lg max-w-[90%]">
                <p className="text-[20px] sm:text-[30px] break-words">
                  {collection.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-10 mb-20">
        <button className="bg-gray-900 mx-auto hover:bg-gray-800 rounded-full py-4 px-8 transition duration-300 ease-in-out transform hover:scale-105 text-gray-100">
          Explore Our Collection
        </button>
      </div>
    </div>
  );
};

export default Collections;
