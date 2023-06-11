import { createAsyncThunk } from "@reduxjs/toolkit";

const URL = "http://chat.devonnex.tech/app";

// Fetch contacts thunk
export const fetchContacts = createAsyncThunk(
  "contacts/chitchat",
  async (user) => {
    const res = await fetch(`${URL}/contacts?username=${user}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
    });
    const data = await res.json();
    return data;
  }
);

// Add contact thunk
export const addContact = createAsyncThunk(
  "addContact/chitchat",
  async (contact, { rejectWithValue }) => {
    const res = await fetch(`${URL}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    const data = await res.json();
    if (!data.status) return rejectWithValue(data);

    return {
      ...contact,
      photo: data.photo,
      last_activity: Date.now() / 1000,
    };
  }
);

// Fetch chat history thunk
export const fetchChatHistory = createAsyncThunk(
  "history/chitchat",
  async (u) => {
    const res = await fetch(`${URL}/chats?user1=${u[0]}&user2=${u[1]}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
    });
    const data = await res.json();
    return { chats: data.data, current: u[1] };
  }
);
