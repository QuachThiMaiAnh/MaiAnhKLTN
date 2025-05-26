import { Link } from "react-router-dom";

import { MdNavigateNext } from "react-icons/md";

import { CiZoomIn } from "react-icons/ci";
import { IoIosHeart } from "react-icons/io";
import { FaHeart, FaStar } from "react-icons/fa6";
import { IoBagOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";

import biscoint from "@/assets/icons/biscoint.png";
import tShirtUchinaga from "@/assets/images/tShirtUchinaga.jpg";
import tShirtUchinaga2 from "@/assets/images/tShirtUchinaga2.jpg";
import interac from "@/assets/icons/interac.png";
import mastercard from "@/assets/icons/mastercard.png";
import visa from "@/assets/icons/visa.png";
import customer from "@/assets/images/customer.jpg";
import aeriUchinagaGirl from "@/assets/images/aeriUchinagaGirl.jpg";
import aespaKpopNutritional from "@/assets/images/aespaKpopNutritional.jpg";
import aespaKpopNutritionalBoy from "@/assets/images/aespaKpopNutritionalBoy.jpg";
import colorOilPaint from "@/assets/images/colorOilPaint.jpg";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import SetColor from "./_components/SetColor";

export type cartProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  selectImg: selectImageType;
  quantity: number;
};

export type selectImageType = {
  color: string;
  colorCode: string;
  image: string;
};

const fakeData = [
  {
    id: "1",
    name: "T-shirt Oversize Uchinaga Dark Blue",
    description:
      "Design: Cute appearance and popular among GISELLE fans. Recommended for those who love espa A stylish and cool shirt with a simple design that can be worn by",
    price: 40,
    brand: "T-Shirt",
    inStock: true,
    images: [
      {
        color: "White",
        colorCode: "#fff",
        image:
          "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
      },
      {
        color: "Yellow",
        colorCode: "#ff0",
        image:
          "https://fastly.picsum.photos/id/3/5000/3333.jpg?hmac=GDjZ2uNWE3V59PkdDaOzTOuV3tPWWxJSf4fNcxu4S2g",
      },
      {
        color: "Green",
        colorCode: "#0f0",
        image:
          "https://fastly.picsum.photos/id/7/4728/3168.jpg?hmac=c5B5tfYFM9blHHMhuu4UKmhnbZoJqrzNOP9xjkV4w3o",
      },
      {
        color: "Red",
        colorCode: "#f00",
        image:
          "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
      },
    ],
  },
];

const DetailPage = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [quantity, setQuantity] = useState(1);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // cartProduct
  const [cartProduct, setCartProduct] = useState<cartProductType>({
    id: fakeData[0].id,
    name: fakeData[0].name,
    description: fakeData[0].description,
    price: fakeData[0].price,
    brand: fakeData[0].brand,
    selectImg: { ...fakeData[0].images[0] },
    quantity: 12,
  });
console.log(count)
  const handleSeclectColor = useCallback(
    (value: selectImageType) => {
      setCartProduct({
        ...cartProduct,
        selectImg: value,
      });
    },
    [cartProduct]
  );

  // console.log(cartProduct);

  useEffect(() => {
    if (!api) {
      return;
    }
    console.log(api.selectedScrollSnap());

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
      // console.log(fakeData[0].images[api.selectedScrollSnap()]);

      setCartProduct({
        ...cartProduct,
        selectImg: fakeData[0].images[api.selectedScrollSnap()],
      });
    });
  }, [api, cartProduct]);

  return (
    <section className="max-w-[1408px] mx-auto px-4">
      {/* Breadcrumb */}

      <div className="flex gap-1 items-center text-xs sm:text-sm my-5 font-medium">
        <Link to="/" className="hover:text-gray-600">
          Home
        </Link>
        <MdNavigateNext className="text-gray-500" />
        <Link to="/category" className="hover:text-gray-600">
          Product
        </Link>
        <span>
          <MdNavigateNext className="text-gray-500 " />
        </span>
        <Link to="/product/32" className="hover:text-gray-600">
          T-shirt Oversize Uchinaga Dark Blue
        </Link>
      </div>
      {/* END Breadcrumb */}

      {/* Product Detail */}
      <div className="flex flex-col md:flex-row md:gap-10 lg:gap-12 xl:gap-16 pb-10">
        <div className="md:w-[350px] lg:w-[400px] xl:w-[450px]">
          <div className="relative">
            <span className="absolute text-black py-1 px-4 bg-white shadow-md rounded-full text-xs right-2 top-2 z-10">
              {current}/{fakeData[0].images.length}
            </span>
            <Carousel setApi={setApi}>
              <CarouselContent>
                {fakeData[0].images.map((image) => (
                  <CarouselItem key={image.color}>
                    <img
                      className="md:w-[450px] md:h-[420px] object-cover rounded-2xl object-top"
                      src={image.image}
                      alt="Image T-Shirt"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-3" />
              <CarouselNext className="-right-4" />
            </Carousel>
            <CiZoomIn className="absolute bg-white bottom-4 left-3 rounded-full p-1 text-black text-3xl cursor-pointer" />
          </div>
        </div>

        {/* Main Prouduct */}
        <div className="md:max-w-[400px] lg:max-w-[450px] xl:max-w-[600px]">
          <div className="flex text-black bg-slate-100 p-2 rounded-full gap-2 max-w-36 my-4 md:my-0">
            <span className="flex items-center text-xs gap-1 pr-2 border-r border-r-slate-400">
              <FaHeart className="text-red-500 text-base" /> WishList
            </span>
            <span className="flex items-center text-xs gap-1">
              <IoBagOutline className="text-base" /> Cart
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium leading-tight mt-2">
            T-shirt Oversize Uchinaga Dark Blue
          </h1>
          <div className="flex gap-2 my-2">
            <div className="flex gap-1 items-center pr-1 border-r">
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-gray-200" />
              <span className="ml-1 text-base">4.5</span>
            </div>
            <span className="pr-1 border-r">2346 Reviews</span>
            <span>4326 Sold</span>
          </div>
          <div className="flex gap-4 mb-5 items-center">
            <span className="p-1 rounded-full flex items-center gap-1 text-xs text-green-500 bg-green-100">
              <MdOutlineCancel /> 50%
            </span>
            {/* Old Price */}
            <span className="text-gray-300 line-through">$80.00</span>
            {/* Now Price */}
            <h3 className="text-3xl font-semibold">$40.00</h3>
          </div>
          <hr />
          {/* Select Size */}
          <div className="mt-5 text-black">
            <h4 className="text-base font-medium">Select Size</h4>
            <ToggleGroup
              className="justify-start gap-4 mt-2"
              type="single"
              variant="default"
            >
              <ToggleGroupItem className="bg-gray-200 h-8" value="Size M">
                M
              </ToggleGroupItem>
              <ToggleGroupItem className="bg-gray-200 h-8" value="Size S">
                S
              </ToggleGroupItem>
              <ToggleGroupItem className="bg-gray-200 h-8" value="Size L">
                L
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {/* End Select Size */}

          {/* Select Color */}
          <div className="mt-5">
            <h4 className="text-base font-medium">Select Color</h4>
            <SetColor
              cartProduct={cartProduct}
              images={fakeData[0].images}
              handleSeclectColor={handleSeclectColor}
              api={api}
            />
          </div>
          {/* End Select Color */}

          {/* Button add to cart */}
          <div className="mt-5 flex flex-col sm:flex-row gap-5 lg:gap-9 md:items-center">
            <div className="flex self-start sm:w-auto items-center border p-2  xl:py-3 xl:px-6 gap-3 xl:gap-5 rounded-lg">
              <div className="flex items-center border-r">
                <Button
                  onClick={() => {
                    if (quantity > 1) setQuantity(quantity - 1);
                  }}
                  className="bg-transparent hover:bg-transparent text-gray-500"
                >
                  -
                </Button>
                <span className="w-2 lg:w-10 py-2 text-center">{quantity}</span>
                <Button
                  onClick={() => {
                    setQuantity(quantity + 1);
                  }}
                  className="bg-transparent hover:bg-transparent text-gray-500"
                >
                  +
                </Button>
              </div>
              <span className="text-green-500 text-sm font-medium text-center">
                In Stock
              </span>
            </div>
            <Button
              type="button"
              className="rounded-full self-start py-7 lg:py-7 lg:px-7 xl:py-8 xl:px-12 gap-2 lg:gap-4"
            >
              <span className="border-r pr-2 lg:pr-4">Add to Cart</span>
              <span>${quantity * 40}.00</span>
            </Button>
          </div>
          {/* End Button add to cart */}

          {/* Shipping Info */}
          <div className="mt-5">
            <h4 className="text-base font-medium">Shipping Info</h4>
            <div className="mt-2 flex flex-col gap-1">
              <div className="flex">
                <h5 className="basis-1/4 text-gray-500">Shipping:</h5>
                <span>Free Expiditions International</span>
              </div>
              <div className="flex">
                <h5 className="basis-1/4 text-gray-500">Estimated:</h5>
                <span>Estimated arrival on 17 - 21 April 2023</span>
              </div>
              <div className="flex">
                <h5 className="basis-1/4 text-gray-500">Delivery:</h5>
                <span>From Cau Giay, Nam Tu Liem, Ha Noi</span>
              </div>
              <div className="flex">
                <h5 className="basis-1/4 text-gray-500">Payment:</h5>
                <div className="flex gap-1">
                  <img className="w-10" src={mastercard} alt="mastercard" />
                  <img className="w-10" src={visa} alt="visa" />
                  <img className="w-10" src={biscoint} alt="biscoint" />
                  <img className="w-10" src={interac} alt="interac" />
                </div>
              </div>
            </div>
          </div>
          {/* End Shipping Info */}

          {/* Details */}
          <div className="my-5">
            <h4 className="text-base font-medium">Product Details</h4>
            <ul className="ml-5">
              <li className="list-disc text-gray-500">20s Cotton Material</li>
              <li className="list-disc text-gray-500">32 Layer Print</li>
              <li className="list-disc text-gray-500">Coating Layer</li>
              <li className="list-disc text-gray-500">Fit Oversize</li>
            </ul>
          </div>
          {/* End Details */}
          <hr />

          <Tabs defaultValue="description" className="mt-5 max-w-[640px]">
            <TabsList className="justify-start bg-transparent flex gap-5 mb-5">
              <TabsTrigger
                className="py-3 md:px-12 border rounded-full font-semibold"
                value="description"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                className="py-3 md:px-12 border rounded-full"
                value="reviews"
              >
                Reviews <span className="text-gray-300">(350)</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <p className="max-w-[600px] text-gray-500">
                Design: Cute appearance and popular among GISELLE fans.
                Recommended for those who love espa A stylish and cool shirt
                with a simple design that can be worn by both men and women
              </p>
              <p className="max-w-[600px] text-gray-500">
                Design: Cute appearance and popular among GISELLE fans.
                Recommended for those who love espa A stylish and cool shirt
                with a simple design that can be worn by both men and women
              </p>
            </TabsContent>
            <TabsContent value="reviews">
              <div className="flex flex-col gap-4">
                <div className="p-6 border border-gray-100 rounded-xl flex flex-col gap-4">
                  <div className="flex items-center gap-5 pb-3 border-b">
                    <div className="flex items-center gap-2 pr-4 border-r">
                      <img
                        className="w-7 h-7 rounded-full"
                        src={customer}
                        alt="reviewer"
                      />
                      <h4 className="text-xs font-medium">Vikki Starr</h4>
                    </div>
                    <span className="text-gray-400 text-xs">
                      January 15, 2024
                    </span>
                  </div>
                  {/* Star */}
                  <div className="flex gap-1 items-center">
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-gray-200" />
                  </div>
                  {/* Content */}
                  <p className="text-sm font-medium max-w-[450px] leading-normal">
                    Absolutely love TopShelfBC; affordable on any budget and
                    such fast delivery, straight to my door! I recommend them to
                    all my friends and family for their 420 needs.
                  </p>
                </div>

                <div className="p-6 border border-gray-100 rounded-xl flex flex-col gap-4">
                  <div className="flex items-center gap-5 pb-3 border-b">
                    <div className="flex items-center gap-2 pr-4 border-r">
                      <img
                        className="w-7 h-7 rounded-full"
                        src={customer}
                        alt="reviewer"
                      />
                      <h4 className="text-xs font-medium">Vikki Starr</h4>
                    </div>
                    <span className="text-gray-400 text-xs">
                      January 15, 2024
                    </span>
                  </div>
                  {/* Star */}
                  <div className="flex gap-1 items-center">
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-gray-200" />
                  </div>
                  {/* Content */}
                  <p className="text-sm font-medium max-w-[450px] leading-normal">
                    Absolutely love TopShelfBC; affordable on any budget and
                    such fast delivery, straight to my door! I recommend them to
                    all my friends and family for their 420 needs.
                  </p>
                </div>
                <Button className="rounded-full text-green-300 bg-slate-50 w-32 self-center hover:bg-slate-100">
                  Show more
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <hr />
      {/* End Product Deatail */}

      {/* Product Best Seller */}
      <div className="mt-8 relative">
        <h3 className="text-3xl">Best Seller</h3>
        <Carousel className="mt-3">
          <CarouselContent className="">
            <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4 relative">
              <img
                className="h-[250px] w-full object-cover rounded-2xl object-top"
                src={tShirtUchinaga}
                alt="Image T-Shirt"
              />
              <IoIosHeart className="absolute p-2 bg-white rounded-full text-4xl top-3 right-4 cursor-pointer text-slate-300 hover:text-red-600" />
            </CarouselItem>
            <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4">
              <img
                className="h-[250px] w-full object-cover rounded-2xl object-top"
                src={tShirtUchinaga2}
                alt="Image T-Shirt"
              />
            </CarouselItem>
            <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4">
              <img
                className="h-[250px] w-full object-cover rounded-2xl object-top"
                src={aeriUchinagaGirl}
                alt="Image T-Shirt"
              />
            </CarouselItem>
            <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4">
              <img
                className="h-[250px] w-full object-cover rounded-2xl object-top"
                src={aespaKpopNutritional}
                alt="Image T-Shirt"
              />
            </CarouselItem>
            <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4">
              <img
                className="h-[250px] w-full object-cover rounded-2xl object-top"
                src={aespaKpopNutritionalBoy}
                alt="Image T-Shirt"
              />
              <div className="flex mt-2 font-medium items-center">
                <Link to="#" className="basis-1/2">
                  T-Shirt Basic Oversize White
                </Link>
                <span className="basis-1/2 text-right">$12.00</span>
              </div>
            </CarouselItem>
            <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4">
              <img
                className="h-[250px] w-full object-cover rounded-2xl object-top"
                src={colorOilPaint}
                alt="Image T-Shirt"
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="-top-7 right-9" />
          <CarouselNext className="-top-7 right-0" />
        </Carousel>
      </div>
      {/* Product Best Seller */}

      {/* Product Best Seller */}
      <div className="mt-8 relative">
        <h3 className="text-3xl">Recommendations</h3>
        <Carousel className="mt-3">
          <CarouselContent className="">
            <CarouselItem className="xl:basis-1/5">
              <img
                className="h-[250px] w-[300px] object-cover rounded-2xl object-top"
                src={tShirtUchinaga}
                alt="Image T-Shirt"
              />
            </CarouselItem>
            <CarouselItem className="xl:basis-1/5">
              <img
                className="h-[250px] w-[300px] object-cover rounded-2xl object-top"
                src={tShirtUchinaga2}
                alt="Image T-Shirt"
              />
            </CarouselItem>
            <CarouselItem className="xl:basis-1/5">
              <img
                className="h-[250px] w-[300px] object-cover rounded-2xl object-top"
                src={aeriUchinagaGirl}
                alt="Image T-Shirt"
              />
            </CarouselItem>
            <CarouselItem className="xl:basis-1/5">
              <img
                className="h-[250px] w-[300px] object-cover rounded-2xl object-top"
                src={aespaKpopNutritional}
                alt="Image T-Shirt"
              />
            </CarouselItem>
            <CarouselItem className="xl:basis-1/5">
              <img
                className="h-[250px] w-[300px] object-cover rounded-2xl object-top"
                src={aespaKpopNutritionalBoy}
                alt="Image T-Shirt"
              />
              <div className="flex mt-2 font-medium items-center">
                <Link to="#" className="basis-1/2">
                  T-Shirt Basic Oversize White
                </Link>
                <span className="basis-1/2 text-right">$12.00</span>
              </div>
            </CarouselItem>
            <CarouselItem className="xl:basis-1/5">
              <img
                className="h-[250px] w-[300px] object-cover rounded-2xl object-top"
                src={colorOilPaint}
                alt="Image T-Shirt"
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="-top-7 right-9" />
          <CarouselNext className="-top-7 right-0" />
        </Carousel>
      </div>
      {/* Product Best Seller */}
    </section>
  );
};

export default DetailPage;
