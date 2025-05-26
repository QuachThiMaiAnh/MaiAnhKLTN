import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export async function getAllAttributeValue(
  type: string,
  { status }: { status: string | "" }
) {
  try {
    const response = await axios.get(
      `${apiUrl}/attributevalueByAttributeID/${type}?_status=${status}`
    );
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAttributeValue(id: string) {
  try {
    const response = await axios.get(`${apiUrl}/attributevalue/${id}`);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}

export async function createAttributeValues(
  id: string,
  data: {
    name: string;
    type: string;
    value: string;
  }
) {
  try {
    const response = await axios.post(`${apiUrl}/attributevalue/${id}`, data);
    return response?.data;
  } catch (error: unknown) {
    throw new Error(error.response.data.message);
  }
}

export async function updateAttributeValueByID(
  id: string,
  data: {
    name: string;
    type: string;
    value: string;
  }
) {
  try {
    const response = await axios.put(`${apiUrl}/attributevalue/${id}`, data);
    return response?.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}
