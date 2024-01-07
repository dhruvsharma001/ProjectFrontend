import { EDIT_PRODUCT } from '../types/app';

export default function (
  state = {
    productData: [],
  },
  action
) {
  switch (action.type) {
    case EDIT_PRODUCT:
      return {
        ...state,
        productData: action.product,
      };
    default:
      return state;
  }
}
