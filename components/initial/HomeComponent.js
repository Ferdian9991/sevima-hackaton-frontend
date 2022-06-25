import React from "react";
import tw from "twin.macro";
import LoggedArea from "../layout/LoggedArea";
import Layout from "../layout/Layout";
import WelcomeBanner from "../utilities/WelcomeBanner";

const HomeComponent = () => {
  return (
    <LoggedArea>
      <Layout header={{ title: "Dashboard" }}>
        <WelcomeBanner />
      </Layout>
    </LoggedArea>
  );
};

export default HomeComponent;
