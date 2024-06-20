import React, { useReducer } from "react";
import MkdSDK from "./utils/MkdSDK";

export const GlobalContext = React.createContext();

const initialState = {
  globalMessage: "",
  isOpen: true,
  path: "",
  videos: [],
  currentPage: 1,
  totalPages: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SNACKBAR":
      return {
        ...state,
        globalMessage: action.payload.message,
      };
    case "SETPATH":
      return {
        ...state,
        path: action.payload.path,
      };
    case "OPEN_SIDEBAR":
      return {
        ...state,
        isOpen: action.payload.isOpen,
      };
    case "SET_VIDEOS":
      return {
        ...state,
        videos: action.payload.videos,
        currentPage: action.payload.page,
        totalPages: action.payload.totalPages,
      };
    default:
      return state;
  }
};

export const showToast = (dispatch, message, timeout = 3000) => {
  dispatch({
    type: "SNACKBAR",
    payload: {
      message,
    },
  });

  setTimeout(() => {
    dispatch({
      type: "SNACKBAR",
      payload: {
        message: "",
      },
    });
  }, timeout);
};

const sdk = new MkdSDK();

const fetchVideos = async (dispatch, page) => {
  try {
    const response = await sdk.callRestAPI(
      { payload: {}, page, limit: 10 },
      "PAGINATE"
    );
    if (response.error) {
      throw new Error(response.message);
    }
    dispatch({
      type: "SET_VIDEOS",
      payload: {
        videos: response.list,
        page: response.page,
        totalPages: response.num_pages,
      },
    });
  } catch (error) {
    console.error(error);
    showToast(dispatch, error.message);
  }
};

const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    fetchVideos(dispatch, 1); // Fetch first page of videos on initial load
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        state,
        dispatch,
        fetchVideos,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
