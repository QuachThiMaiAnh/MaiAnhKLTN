import Product from "../models/product";
import slugify from "slugify";
import Variant from "../models/variant";
import Category from "../models/category";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyCUjrZYIdlutq3bnslmzAGRVqt32fG1dZA");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const ChatAI = async (req, res) => {
  const { newMessage } = req.query;
  try {
    const products = await Product.find({ deleted: false })
      .populate([
        { path: "category", select: "name", match: { deleted: false } },
        {
          path: "variants",
          match: { deleted: false },
        },
      ])
      .lean();

    const productsHTML = products
      .map((product) => {
        const image = product.image;
        const price = product.variants?.[0]?.price || 0; // giá gốc
        const priceSale = product.variants?.[0]?.priceSale || 0; // giá khuyến mãi

        const hasDiscount = priceSale > 0 && priceSale < price;

        return `
          <div class="flex gap-3 border border-gray-300 p-2 rounded-lg mb-2 max-w-[300px]">
            <img src="${image}" alt="${product.name}"
              class="w-16 h-16 object-cover rounded-md" />
            <div>
              <div class="font-semibold">
                <a href="http://localhost:5173/product/${
                  product._id
                }" target="_blank" class="text-[#2b2b2b] hover:underline">
                  ${product.name}
                </a>
              </div>
              ${
                hasDiscount
                  ? `
                    <div class="text-red-600 font-bold">
                      ${priceSale.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </div>
                    <div class="text-[#2b2b2b] font-bold line-through opacity-70">
                      ${price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </div>
                  `
                  : `
                    <div class="text-red-600 font-bold">
                      ${price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </div>
                  `
              }
            </div>
          </div>
    `;
      })
      .join("\n");

    const prompt = `
        Bạn là một trợ lý bán hàng quần áo online cho cửa hàng FABRICFOCUS. 
        Dưới đây là danh sách sản phẩm:
        ${productsHTML}.

        Khách hàng hỏi: "${newMessage}".
        Hãy trả lời ngắn gọn, thân thiện, rõ ràng và bằng tiếng Việt.
        
        Nếu có sản phẩm phù hợp, hãy trả về HTML của sản phẩm đấy.
        Nếu không liên quan đến sản phẩm, hãy phản hồi một cách lịch sự.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.status(200).json({ reply: text.trim() });
  } catch (error) {
    console.error("Lỗi ChatAI:", error);
    return res.status(500).json({ message: error.message });
  }
};
