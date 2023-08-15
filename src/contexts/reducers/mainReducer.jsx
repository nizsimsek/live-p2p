const mainReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIRST_LOGIN":
      return {
        ...state,
        firstLogin: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_ROOM":
      return {
        ...state,
        room: action.payload,
      };
    case "CREATE_ROOM":
      return {
        ...state,
        room: {
          ...state.room,
          id: window.crypto.randomUUID(),
          name: action.payload,
        },
      };
    default:
      return state;
  }
};

export default mainReducer;
