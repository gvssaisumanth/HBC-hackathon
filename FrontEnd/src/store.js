import { combineReducers, createStore, applyMiddleware, compose } from "redux";

let initialState = {
  signer: {},
};

const SignerReducer = (
  state = {
    signer: {},
  },
  action
) => {
  switch (action.type) {
    case "UPDATE_SIGNER":
      console.log("Before update state - ", state);
      let newState = { ...state, signer: action.payload };
      return newState;
    default:
      return state;
  }
};
let reducer = combineReducers({
  signer: SignerReducer,
});

let store = createStore(reducer, initialState);

export default store;
