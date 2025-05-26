import { Action, Data, State } from "@/common/types/Orders";

const renderSelects = (
  dataArrays: Data[],
  currentIndex = 0,
  combination: Data[] = []
) => {
  const resultArrays: Data[][] = []; // Biến lưu trữ các mảng kết quả

  const loopArrays = (currentIndex: number, combination: Data[]) => {
    if (currentIndex === dataArrays.length) {
      resultArrays.push(combination); // Thêm mảng vào biến lưu trữ
      return;
    }

    const currentArray = dataArrays[currentIndex];
    // console.log("currentArray: ", currentArray, "currentIndex: ", currentIndex);

    currentArray?.forEach((item) => {
      loopArrays(currentIndex + 1, [...combination, item]); // Đệ quy lặp qua các mảng
    });
  };

  loopArrays(currentIndex, combination); // Bắt đầu vòng lặp

  return resultArrays; // Trả về biến lưu trữ các mảng
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_ATTRIBUTE":
      if (state.attributesChoose.includes(action.payload)) return state;

      return {
        ...state,
        attributesChoose: [...state.attributesChoose, action.payload],
      };

    case "ADD_VALUE": {
      console.log("action.payload: ", action.payload);

      const filteredValues = action.payload.filter(
        (value) => value && Object.keys(value).length > 0
      );

      if (!filteredValues.length) return state;

      return {
        ...state,
        valuesChoose: [...state.valuesChoose, filteredValues],
      };
    }

    case "CLEAR_VALUES":
      return {
        ...state,
        valuesChoose: [],
      };

    case "DELETE_ONE_VALUE":
      return {
        ...state,
        attributesChoose: state.attributesChoose.filter(
          (value) => value._id !== action.payload
        ),
      };

    case "MIX_VALUES": {
      if (!state.valuesChoose.length) return state; // Check mảng rỗng
      const mix = renderSelects(state.valuesChoose[0]);

      return {
        ...state,
        valuesMix: mix,
      };
    }

    case "UPDATE_ATTRIBUTES":
      return {
        ...state,

        attributesChoose: state.attributesChoose.map((attr) =>
          attr._id === action.payload._id ? action.payload : attr
        ),
      };

    case "DELETE_INDEX_MIX_VALUE":
      return {
        ...state,
        valuesMix: state.valuesMix.filter(
          (_, index) => index !== action.payload
        ),
      };

    case "CLEAR":
      return {
        ...state,
        attributesChoose: [],
      };

    default:
      return state;
  }
};
