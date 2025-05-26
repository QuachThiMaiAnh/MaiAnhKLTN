import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export async function getAllAttribute({ status }: { status: string | "" }) {
  try {
    const response = await axios.get(`${apiUrl}/attributes?_status=${status}`);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAttributeByID(id: string) {
  try {
    const response = await axios.get(`${apiUrl}/attributes/${id}`);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAttributeByIDClient(id: string) {
  try {
    const response = await axios.get(`${apiUrl}/attributes/${id}/client`);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateAttributeByID(id: string, data: { name: string }) {
  try {
    const response = await axios.put(`${apiUrl}/attributes/${id}`, data);
    return response?.data;
  } catch (error) {
    throw (
      error.response?.data ||
      error.message ||
      "Có lỗi xảy ra khi cập nhật thuộc tính"
    );
  }
}
