import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export async function getProductEdit(id: string) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/products/${id}/forEdit`
    );
    document.title = `Page: ${response?.data.name}`;
    return response?.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllProduct({ status }: { status: string | "" }) {
  try {
    const response = await axios.get(
      `${apiUrl}/products?_status=${status}&_limit=100`
    );
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAtributes() {
  try {
    const response = await axios.get("http://localhost:8080/api/attributes");
    return response?.data;
  } catch (error) {
    console.error(error);
  }
}
