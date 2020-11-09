import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import { signupReducer } from "./components/signup/SignupReducer";
import { loginReducer } from "./components/login/LoginReducer";
import { notesReducer } from "./components/notes/NotesReducer";

const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    createUser: signupReducer,
    auth: loginReducer,
    notes: notesReducer
  });

export default createRootReducer;
