import Product from "../models/product";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Nếu muốn dùng .env, thay key bằng process.env.GEMINI_API_KEY
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
          populate: {
            path: "values",
            model: "AttributeValue",
            match: { deleted: false },
            select: "-__v",
          },
        },
      ])
      .lean();

    const productsHTML = products
      .map((product) => {
        const image = product.image;
        const name = product.name;
        const description = product.description?.trim() || "";
        const detail =
          product.descriptionDetail?.replace(/<[^>]+>/g, "").trim() || "";
        const variants = product.variants || [];

        const prices = new Set();
        const salePrices = new Set();
        const attributesMap = new Map();

        variants.forEach((variant) => {
          if (variant.price) prices.add(variant.price);
          if (variant.priceSale) salePrices.add(variant.priceSale);

          variant.values?.forEach((val) => {
            if (!attributesMap.has(val.type)) {
              attributesMap.set(val.type, new Set());
            }
            attributesMap.get(val.type).add(val.name);
          });
        });

        const hasDiscount = [...salePrices].some((sale) =>
          [...prices].some((price) => sale > 0 && sale < price)
        );

        const attrsText = [...attributesMap.entries()]
          .map(([type, values]) => `${type}: ${[...values].join(", ")}`)
          .join(" | ");

        const minPrice = prices.size > 0 ? Math.min(...prices) : 0;
        const minSale =
          salePrices.size > 0 ? Math.min(...salePrices) : undefined;

        return `
<div class="flex gap-3 border border-gray-300 p-2 rounded-lg mb-2 max-w-[300px]">
  <img src="${image}" alt="${name}" class="w-16 h-16 object-cover rounded-md" />
  <div>
    <div class="font-semibold">
      <a href="http://localhost:5173/product/${
        product._id
      }" target="_blank" class="text-[#2b2b2b] hover:underline">
        ${name}
      </a>
    </div>
    ${attrsText ? `<div class="text-sm text-gray-600">${attrsText}</div>` : ""}
    ${
      hasDiscount && minSale
        ? `<div class="text-red-600 font-bold">${minSale.toLocaleString(
            "vi-VN",
            { style: "currency", currency: "VND" }
          )}</div>
           <div class="text-[#2b2b2b] font-bold line-through opacity-70">${minPrice.toLocaleString(
             "vi-VN",
             { style: "currency", currency: "VND" }
           )}</div>`
        : `<div class="text-red-600 font-bold">${minPrice.toLocaleString(
            "vi-VN",
            { style: "currency", currency: "VND" }
          )}</div>`
    }
    ${
      description
        ? `<div class="text-xs text-gray-500 mt-1">${description}</div>`
        : ""
    }
  </div>
</div>
        `;
      })
      .join("\n");

    const prompt = `
Bạn là một trợ lý bán hàng quần áo online cho cửa hàng FABRICFOCUS.

Dưới đây là danh sách sản phẩm có sẵn, bao gồm:
- Tên sản phẩm
- Giá, khuyến mãi
- Các thuộc tính (màu sắc, họa tiết, size…)
- Mô tả chi tiết (chất liệu, form dáng, cách sử dụng…)

${productsHTML}

Khách hàng hỏi: "${newMessage}"

Hãy làm theo các quy tắc sau:
1. Nếu câu hỏi liên quan đến đặc điểm sản phẩm, so sánh, form dáng, chất liệu, thời tiết, mùa, phối đồ… → Trả lời bằng **văn bản tiếng Việt rõ ràng, không cần HTML**
2. Nếu khách muốn **tìm hoặc chọn sản phẩm**, ví dụ hỏi: "Tôi muốn mua", "Mẫu nào phù hợp", "Gợi ý mẫu..." → Trả về HTML sản phẩm phù hợp
3. Không trả lời bằng cả văn bản và HTML trong cùng câu trả lời
4. Trả lời ngắn gọn, dễ hiểu, thân thiện, đúng ngữ cảnh
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.status(200).json({ reply: text.trim() });
  } catch (error) {
    console.error("Lỗi ChatAI:", error);
    return res.status(500).json({ message: error.message });
  }
};
