import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchChatHistory, fetchContacts, addContact } from "./chatThunks";

const SIGNUP_URL = "http://chat.devonnex.tech/app/signup";
const LOGIN_URL = "http://chat.devonnex.tech/app/signin";
const USER_SIGNED = "user_signup";
const USER_LOGGED = "user_login";
const USER_LOGGEDOUT = "user_loggedout";

// User login and signup helper function
const userAuth = async (url, userInfo) => {
  const data = await fetch(url, {
    method: "post",
    mode: "cors",
    headers: {
      Accept: "*/*",
    },
    body: JSON.stringify(userInfo),
  }).then((res) => res.json());
  return data;
};

// User SignUp thunk
export const userSignUp = createAsyncThunk(
  USER_SIGNED,
  async (userInfo, { dispatch, rejectWithValue }) => {
    const data = await userAuth(SIGNUP_URL, userInfo);

    if (!data.status) return rejectWithValue(data);

    sessionStorage.setItem(
      "userInfo",
      JSON.stringify({ ...data, username: userInfo.username })
    );
    return { ...data, username: userInfo.username };
  }
);

// User Login thunk
export const userLogin = createAsyncThunk(
  USER_LOGGED,
  async (userInfo, { dispatch, rejectWithValue }) => {
    const data = await userAuth(LOGIN_URL, userInfo);

    if (!data.status) return rejectWithValue(data);

    sessionStorage.setItem(
      "userInfo",
      JSON.stringify({ ...data, username: userInfo.username })
    );
    return { ...data, username: userInfo.username };
  }
);

// User Logout thunk
export const userLogout = createAsyncThunk(USER_LOGGEDOUT, async () => {
  sessionStorage.removeItem("userInfo");
  return {};
});

const initialState = {
  error: "",
  username: "",
  photo: "",
  contacts: [],
  chatHistory: [],
  isLogged: false,
  requestLoading: false,
  currentContact: {},
  notifyContact: {},
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Update chat history
    updateChatHistory: (state, action) => ({
      ...state,
      chatHistory: [action.payload, ...state.chatHistory],
    }),
    // Set user login status
    setUserLogged: (state, action) => ({ ...state, isLogged: action.payload }),
    // Set the contact to notify
    setNotifyContact: (state, action) => ({
      ...state,
      error: "",
      notifyContact: state.contacts.find((c) => c.username === action.payload),
    }),
    // Set error message
    setError: (state, action) => ({
      ...state,
      requestLoading: false,
      error: action.payload,
    }),
    // Persist user data
    persistUser: (state, action) => ({
      ...state,
      username: action.payload.username,
      photo: action.payload.photo,
      isLogged: action.payload.username !== undefined,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(userSignUp.fulfilled, (state, action) => ({
      ...state,
      username: action.payload.username,
      photo: action.payload.photo,
      isLogged: action.payload.username !== undefined,
      requestLoading: false,
    }));
    builder.addCase(userSignUp.pending, (state, action) => ({
      ...state,
      requestLoading: true,
    }));
    builder.addCase(userSignUp.rejected, (state, action) => ({
      ...state,
      error: action.payload && action.payload.message,
      requestLoading: false,
    }));
    builder.addCase(userLogin.fulfilled, (state, action) => ({
      ...state,
      username: action.payload.username,
      photo: action.payload.photo,
      isLogged: action.payload.status,
      requestLoading: false,
    }));
    builder.addCase(userLogin.pending, (state, action) => ({
      ...state,
      requestLoading: true,
    }));
    builder.addCase(userLogin.rejected, (state, action) => ({
      ...state,
      error: action.payload && action.payload.message,
      requestLoading: false,
    }));
    builder.addCase(userLogout.fulfilled, (state, action) => ({
      ...initialState,
    }));
    builder.addCase(addContact.fulfilled, (state, action) => ({
      ...state,
      contacts: [action.payload, ...state.contacts],
    }));
    builder.addCase(addContact.rejected, (state, action) => ({
      ...state,
      error: action.payload.message,
    }));
    builder.addCase(fetchContacts.fulfilled, (state, action) => ({
      ...state,
      contacts: action.payload.data,
    }));
    builder.addCase(fetchChatHistory.fulfilled, (state, action) => ({
      ...state,
      chatHistory: action.payload.chats,
      currentContact: state.contacts.find(
        (c) => c.username === action.payload.current
      ),
    }));
  },
});

export default userSlice;
