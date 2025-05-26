import Collections from "./_components/Collections";
import Endow from "./_components/Sale";
import Products from "./_components/Products";
import Slider from "./_components/Slider";

const HomePage = () => {

  return (
    <div className="">
      <div className="max-w-[1408px] items-center mx-auto">
          <Slider/>
          <Products/>
          <Collections/>
          <Endow/>
      </div>
    </div>
  );
};

export default HomePage;
