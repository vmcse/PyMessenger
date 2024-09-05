import React from "react";
import ChatsInterface from "../ChatsInterface";
import Layout from "./templates/Layout";

const Home = () => {
  return (
    <Layout>
      <div className="container mt-3">
        <ChatsInterface />
      </div>
    </Layout>
  );
};

export default Home;
