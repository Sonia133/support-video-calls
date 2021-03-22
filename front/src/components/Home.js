import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import socket from "../socket";

const Home = () => {
  const history = useHistory();
  const isLoggedIn = useSelector((state) => state.user.authenticated);
  const [isEmployee, email, companyName] = useSelector((state) => [
    state.user?.role === "employee",
    state.user?.email,
    state.user?.companyName,
  ]);

  useEffect(() => {
    if (isEmployee) {
      socket
        .ref(`calls/${email.replace(".", "-")}/roomId`)
        .on("value", (snapshot) => {
          console.log(snapshot.val());
          if (!!snapshot.val()) {
            history.push(`/call/${companyName}`);
          }
        });
    }
  }, [isEmployee]);

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/login");
    }
  }, [isLoggedIn]);

  return <div>HOME</div>;
};

export default Home;
