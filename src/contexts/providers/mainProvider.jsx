import { useReducer } from "react";
import MainContext from "../mainContext.jsx";
import mainReducer from "../reducers/mainReducer.jsx";
import mainInitialState from "../states/mainInitialState.jsx";

const MainProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, mainInitialState);

  return (
    <MainContext.Provider value={[state, dispatch]}>
      {children}
    </MainContext.Provider>
  );
};

export default MainProvider;
