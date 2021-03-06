import * as TYPE from './actionTypes';

const Storage = JSON.parse(localStorage.getItem('orders'));

const initialState = {
    page: null,
    user: null,
    products: null,
    orders: Storage ?  Storage.orders : [],
};
function reducer(state = initialState, action){

    switch (action.type) {
        case TYPE.SET_PAGE:
            return {
                ...state,
                page: action.payload,
            }
        case TYPE.SET_USER:
            return {
                ...state,
                user: action.payload,
            }
        case TYPE.SET_PRODUCTS:
            return {
                ...state,
                products: action.payload,
            }
        case TYPE.ADD_ORDER:{
            const orders = state.orders.slice();
            orders.push(action.payload);
            localStorage.setItem('orders', JSON.stringify({orders}))
            return{
                ...state,
                orders,
            }

        }
        case TYPE.ADD_PRODUCT:{
            const products = state.products.slice();
            products.push(action.payload);
            return{
                ...state,
                products,
            }
        }
        case TYPE.EDIT_PRODUCT:{
            const products = state.products.slice();
            const index = products.findIndex(x => x._id === action.payload._id);
            products[index] = action.payload;
            return{
                ...state,
                products,
            }
        }
        case TYPE.EDIT_ORDER :{
            const orders = state.orders.slice();
            const index = orders.findIndex(x => x.id === action.payload.id);
            orders[index].qty = action.payload.qty;
            localStorage.setItem('orders', JSON.stringify({orders}))
            return{
                ...state,
                orders,
            }
        }
        case TYPE.REMOVE_PRODUCT:{
            const products = state.products.slice();
            const index = products.findIndex(x => x._id === action.payload);
            products.splice(index, 1);
            return{
                ...state,
                products,
            }
        }
        case TYPE.REMOVE_ORDER:{
            const orders = state.orders.slice();
            const index = orders.findIndex(x => x.id === action.payload);
            orders.splice(index,1);
            localStorage.setItem('orders', JSON.stringify({orders}))
            return{
                ...state,
                orders,
            }
        }
        case TYPE.CLEAR_USER:
            return {
                ...state,
                user: null,
            }
        case TYPE.CLEAR_ORDER:
            localStorage.setItem('orders', JSON.stringify({orders: []}))
            return{
                ...state,
                orders: [],
            }
        default:
            return state;
    }
}

export default reducer;