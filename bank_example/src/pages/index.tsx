import React, { useEffect, useState } from "react";
import { DisclaimerOverlay } from "@/features/Components/DisclaimerOverlay";
import { Dashboard } from "@/features/Dashboard";

import { Banner, Content, Header, Layout } from "@/features/Layout";
import { useGlobalModals } from "@/features/Modals/useGlobalModals";
import { useKycAuthentication } from "@/features/identity/useKycAuthenticate";
import { useCheckCompliance } from "@/features/identity/useCheckCompliance";
import { IDENTITY_CLIENT } from "@/features/identity/IdentityClient";
import { getSigner } from "@/appConfig";
import { toast } from "react-toastify";

const Home = () => {
  const { openModal, close } = useGlobalModals((state) => ({
    openModal: state.open,
    close: state.close,
    data: state.data,
  }));
  const { user, accessToken, signingMessage, signature } =
    useKycAuthentication();
  const [kycCompletion, setKycCompletion] = useState(false);
  const { checkCompliance } = useCheckCompliance(kycCompletion);
  const [isCompliance, setIsCompliance] = useState(false);

  useEffect(() => {
    console.log("result kyc compliance", checkCompliance);

    if (checkCompliance.data !== undefined) {
      if (checkCompliance.data) {
        toast(`Your identity has been verified`);
        setKycCompletion(false);
        setIsCompliance(true);
      } else {
        toast(`Your identity has not been verified`);
        setIsCompliance(false);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkCompliance]);

  useEffect(() => {
    if (isCompliance) {
      close();
    }
  }, [isCompliance]);

  useEffect(() => {
    if (user && accessToken && signingMessage && signature) {
      console.log(
        "Ready to init: ",
        user,
        accessToken,
        signingMessage,
        signature
      );
      IDENTITY_CLIENT.onSignMessage(async (data) => {
        console.log("on sign personal data");
        const signer = getSigner(user);
        return await signer.signMessage(data.message);
      });
      IDENTITY_CLIENT.onKycCompletion((data) => {
        void (() => {
          console.log("on kyc completion", data);
          setKycCompletion(true);
        })();
      });
      IDENTITY_CLIENT.init({
        accessToken,
        signingMessage,
        signature,
      });
    }
  }, [user]);

  const onClickLogOn = () => {
    openModal(
      "LogOnModal",
      {
        modalType: "center",
        overlayType: "dark",
      },
      {
        basicData: {
          text: "",
          icon: "help",
          textButton: "Verify Identity",
        },
      }
    );
  };

  return (
    <Layout
      header={!isCompliance ? <Header onClickLogOn={onClickLogOn} /> : <></>}
      className={!isCompliance ? "px-[105px]" : "bg-[#F2F2F2]"}
    >
      {!isCompliance ? (
        <>
          <Banner />
          <Content />
        </>
      ) : (
        <Dashboard />
      )}
      <DisclaimerOverlay
        content="This web application  is a simulated, mockup banking application developed solely for the purpose of demonstrating the functionalities and capabilities of the NexeraID product. It is not affiliated with, endorsed by, or in any way associated with any real-world banking or financial institution."
        textButton="I understood"
        className="bg-[#3E505D]"
        classNameButton="border-none !rounded-none !bg-[#DB0011] font-normal"
      />
    </Layout>
  );
};

export default Home;
