import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export async function getAllProduct({
  page,
  limit,
  category,
  price,
  search,
  color,
}: {
  page: number;
  limit: number;
  price: number | string;
  category: string | null;
  search: string | "";
  color: string | "";
}) {
  try {
    console.log(color);
    const response = await axios.get(
      `${apiUrl}/products?_page=${page}&_limit=${limit}&_category=${category}&_price=${price}&_search=${search}&_color=${color}`
    );
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getProductById(id: string) {
  try {
    const response = await axios.get(`${apiUrl}/products/${id}`);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllCategory() {
  try {
    const response = await axios.get(`${apiUrl}/category`);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}
