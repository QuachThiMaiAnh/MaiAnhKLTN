// reducer.ts
// Xử lý state cho việc chọn thuộc tính và sinh biến thể sản phẩm (dạng tổ hợp)

import { Action, Data, State } from "@/common/types/Orders";

/**
 * Hàm đệ quy để sinh tổ hợp giá trị thuộc tính từ nhiều mảng (cartesian product)
 * Ví dụ: [[Đỏ, Xanh], [S, M]] => [[Đỏ, S], [Đỏ, M], [Xanh, S], [Xanh, M]]
 * 
 * Đệ quy từ trái sang phải qua từng mảng con trong dataArrays.

Ở mỗi bước:

Chọn một phần tử từ mảng hiện tại.

Gọi lại hàm cho mảng kế tiếp, kèm theo tổ hợp đã chọn.

Khi đã chọn xong 1 phần tử ở mỗi mảng → push vào kết quả.
 */
const renderSelects = (
  dataArrays: Data[][], // Mảng các mảng thuộc tính (2 chiều) [[Đỏ, Xanh], [S, M]]
  currentIndex = 0, // Vị trí mảng hiện tại đang xử lý
  combination: Data[] = [] // Mảng kết quả tạm thời cho từng tổ hợp  (dùng trong đệ quy)
) => {
  const resultArrays: Data[][] = [];

  const loopArrays = (currentIndex: number, combination: Data[]) => {
    if (currentIndex === dataArrays.length) {
      resultArrays.push(combination);
      return;
    }

    const currentArray = dataArrays[currentIndex];
    currentArray?.forEach((item) => {
      loopArrays(currentIndex + 1, [...combination, item]);
    });
  };

  loopArrays(currentIndex, combination);
  return resultArrays;
};

/**
 * Reducer để quản lý state cho việc tạo/sửa thuộc tính và biến thể
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    // Thêm thuộc tính vào danh sách đã chọn
    case "ADD_ATTRIBUTE":
      if (state.attributesChoose.includes(action.payload)) return state;
      return {
        ...state,
        attributesChoose: [...state.attributesChoose, action.payload],
      };

    // Thêm giá trị thuộc tính vào valuesChoose[0] (mảng 2 chiều)
    case "ADD_VALUE": {
      // Lọc ra những giá trị hợp lệ (không rỗng)
      // (2)[Array(1), Array(1)]
      const filteredValues = action.payload.filter(
        (value) => value && Object.keys(value).length > 0
      );
      if (!filteredValues.length) return state;
      return {
        ...state,
        valuesChoose: [...state.valuesChoose, filteredValues],
      };
    }

    // Xoá toàn bộ giá trị đã chọn (reset giá trị attributes)
    case "CLEAR_VALUES":
      return {
        ...state,
        valuesChoose: [],
      };

    // Xoá 1 thuộc tính trong attributesChoose theo _id
    case "DELETE_ONE_VALUE":
      return {
        ...state,
        attributesChoose: state.attributesChoose.filter(
          (value) => value._id !== action.payload
        ),
      };

    // Sinh tổ hợp từ valuesChoose (ví dụ từ màu * size => biến thể)
    case "MIX_VALUES": {
      if (!state.valuesChoose.length) return state;
      console.log("valuesChoose:", state.valuesChoose);
      const mix = renderSelects(state.valuesChoose[0]); // Lỗi logic: chỉ lấy [0], cần mix toàn bộ valuesChoose
      return {
        ...state,
        valuesMix: mix,
      };
    }

    // Cập nhật lại một attribute (theo _id)
    case "UPDATE_ATTRIBUTES":
      return {
        ...state,
        attributesChoose: state.attributesChoose.map((attr) =>
          attr._id === action.payload._id ? action.payload : attr
        ),
      };

    // Xoá một tổ hợp mix cụ thể theo index
    case "DELETE_INDEX_MIX_VALUE":
      return {
        ...state,
        valuesMix: state.valuesMix.filter(
          (_, index) => index !== action.payload
        ),
      };

    // Reset toàn bộ thuộc tính đã chọn
    case "CLEAR":
      return {
        ...state,
        attributesChoose: [],
        valuesChoose: [],
        valuesMix: [],
      };

    default:
      return state;
  }
};
