import express from 'express'
import { addToCart, addVoucher, changeVariant, decrease, getCartByUserId, increase, removeCartProduct, updateCart, updateQuantity, revomeVoucherCart, selectedAllItem, selectedOneItem, removeAllItemSelected } from '../controllers/cart';
import { checkVoucherUsed } from '../middlewares/checkVoucherUsed';
import { checkCartProduct } from '../middlewares/checkCartProduct';
const routerCart = express.Router();

routerCart.get('/cart/:id', checkCartProduct, getCartByUserId);
routerCart.post('/cart/add', addToCart);
routerCart.put('/cart/increase', checkCartProduct, increase);
routerCart.put('/cart/decrease', checkCartProduct, decrease);
routerCart.put('/cart/remove', removeCartProduct);
routerCart.put('/cart/update', checkCartProduct, updateQuantity);
routerCart.put('/cart/add-voucher', checkVoucherUsed, addVoucher);
routerCart.put('/cart/remove-voucher', revomeVoucherCart);
routerCart.put('/cart/change-variant', checkCartProduct, changeVariant);
routerCart.put('/cart/selected-all', selectedAllItem);
routerCart.put('/cart/selected-one', checkCartProduct, selectedOneItem);
routerCart.put('/cart/remove-all-selected', checkCartProduct, removeAllItemSelected);

routerCart.put('/cart/update/:id', updateCart);

export default routerCart;