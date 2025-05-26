
import collection2 from "../../../../assets/img/products/images6.jpg";
const Sale = () => {
  return (
    <div>
        <div className="px-5">
          <div className=" relative w-full h-[600px] max-w-full mx-auto ">
            <div className="overflow-hidden relative h-full rounded-3xl">
              <div
                className={`absolute w-full h-full transition-transform duration-500 ease-in-out transform `}
              >
                <img
                  src={collection2}
                  alt="collection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white">
                  <h1 className=" lg:text-5xl text-3xl font-bold mb-4 mx-10">
                    Discover Your Street Style with Our Diverse Collection of
                    Streetwear
                  </h1>
                  <p className="text-lg mb-8 mx-10">
                    Get your unique streetwear style with our various
                    collections. Shop now to look fashionable with the latest
                    trends.
                  </p>
                  <button className="px-6 py-3  bg-white text-black rounded-full font-semibold transition ease-in-out transform hover:scale-105">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Sale