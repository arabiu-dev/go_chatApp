import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import userSlice from "./redux/userSlice";
import Signup from "./Components/Signup";
import ToastNotification from "./modals/ToastModal";
import Controls from "./Components/Controls";
import Sidebar from "./Components/Sidebar";
import Chats from "./Components/Chats";
import { fetchContacts } from "./redux/chatThunks";

function App() {
  // State variables
  const [active, setActive] = useState(true);
  const [modalClosed, setModalClosed] = useState(true);
  const [loading, setLoading] = useState(true);

  // Redux hooks
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // Handle error notification
  useEffect(() => {
    if (!user.error) return;
    setModalClosed((prev) => !prev);
    setTimeout(() => setModalClosed((prev) => !prev), 5000);
  }, [user.error]);

  // Fetch user info and contacts on initial load
  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (!user.isLogged && userInfo) {
      dispatch(userSlice.actions.persistUser(userInfo));
      dispatch(fetchContacts(userInfo.username));
    }
    setLoading(false);
  }, [dispatch, user.isLogged]);

  // Render preloader if user data is loading
  if (user.requestLoading || loading) {
    return (
      <div className="preloader" data-preloader>
        <div className="circle" data-circle></div>
      </div>
    );
  }

  // Render main content
  return (
    <>
      <ToastNotification
        modalClosed={modalClosed}
        setModalClosed={setModalClosed}
      />
      {!user.isLogged ? (
        <Signup />
      ) : (
        <>
          <Chats />
          <Sidebar setActive={setActive} active={active} />
          <Controls setActive={setActive} setModalClosed={setModalClosed} />
        </>
      )}
    </>
  );
}

export default App;
