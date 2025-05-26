import axios from "axios";
import { useEffect, useState, forwardRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input"; // Thêm ô nhập tìm kiếm

interface City {
  Id: string;
  Name: string;
  Districts: District[];
}

interface District {
  Id: string;
  Name: string;
  Wards: Ward[];
}

interface Ward {
  Id: string;
  Name: string;
}

interface CountryProps {
  onCityChange: (cityId: string) => void;
  onDistrictChange: (districtId: string) => void;
  onWardChange: (wardId: string) => void;
  city?: string; // Truyền tên tỉnh thành đã chọn
  district?: string; // Truyền tên quận huyện đã chọn
  ward?: string; // Truyền tên phường xã đã chọn
}

const Country = forwardRef<HTMLDivElement, CountryProps>(({
  onCityChange,
  onDistrictChange,
  onWardChange,
  city,
  district,
  ward
}, ref) => {
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [citySearch, setCitySearch] = useState(""); // Bộ lọc tỉnh/thành phố
  const [districtSearch, setDistrictSearch] = useState(""); // Bộ lọc quận/huyện
  const [wardSearch, setWardSearch] = useState(""); // Bộ lọc phường/xã

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );
        const data: City[] = response.data;
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  const handleCityChange = (cityId: string) => {
    const city = cities.find((city) => city.Id === cityId) || null;
    if (city) {
      setDistricts(city.Districts);
      setWards([]);
      onCityChange(city.Name);
      onDistrictChange("");
      onWardChange("");
    } else {
      setDistricts([]);
      setWards([]);
      onCityChange("");
      onDistrictChange("");
      onWardChange("");
    }
  };

  const handleDistrictChange = (districtId: string) => {
    const district = districts.find((district) => district.Id === districtId) || null;
    if (district) {
      setWards(district.Wards);
      onDistrictChange(district.Name);
    } else {
      setWards([]);
      onDistrictChange("");
      onWardChange("");
    }
  };

  const handleWardChange = (wardId: string) => {
    const ward = wards.find((ward) => ward.Id === wardId) || null;
    if (ward) {
      onWardChange(ward.Name);
    } else {
      onWardChange("");
    }
  };

  return (
    <div ref={ref}>
      <Select onValueChange={handleCityChange} value={city}>
        <SelectTrigger>
          <SelectValue placeholder="Chọn tỉnh thành">{city || "Chọn tỉnh thành"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <Input
           style={{marginBottom: 10,}}
            placeholder="Tìm tỉnh/thành phố..."
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
          />
          {cities
            .filter((city) =>
              city.Name.toLowerCase().includes(citySearch.toLowerCase())
            )
            .map((city) => (
              <SelectItem key={city.Id} value={city.Id}>
                {city.Name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={handleDistrictChange}
        value={district}
        disabled={districts.length === 0 || !city}
      >
        <SelectTrigger>
          <SelectValue placeholder="Chọn quận huyện">{district || "Chọn quận huyện"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <Input
           style={{marginBottom: 10,}}
            placeholder="Tìm quận/huyện..."
            value={districtSearch}
            onChange={(e) => setDistrictSearch(e.target.value)}
          />
          {districts
            .filter((district) =>
              district.Name.toLowerCase().includes(districtSearch.toLowerCase())
            )
            .map((district) => (
              <SelectItem key={district.Id} value={district.Id}>
                {district.Name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={handleWardChange}
        value={ward}
        disabled={wards.length === 0 || !district}
      >
        <SelectTrigger>
          <SelectValue placeholder="Chọn phường xã">{ward || "Chọn phường xã"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <Input
            placeholder="Tìm phường/xã..."
           style={{marginBottom: 10,}}

            value={wardSearch}
            onChange={(e) => setWardSearch(e.target.value)}
          />
          {wards
            .filter((ward) =>
              ward.Name.toLowerCase().includes(wardSearch.toLowerCase())
            )
            .map((ward) => (
              <SelectItem key={ward.Id} value={ward.Id}>
                {ward.Name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
});

export default Country;
