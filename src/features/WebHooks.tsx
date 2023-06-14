import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import styles from "./styles.module.css";
import { getDataWebHook, getRuleWebHook } from "../utils/api_client";
import { useInterval } from "../hooks/useInterval";

export const WebHooks = () => {
  const [data, setData] = useState("");
  const [rule, setRule] = useState("");
  const { address } = useAccount();

  const { clear: clearDataInterval } = useInterval(async () => {
    if (address) {
      const res = await getDataWebHook(address);

      if (Object.keys(res).length) {
        console.log("RES INS Data: ", res);
        setData(JSON.stringify(res, null, 1));
      }
    }
  }, 5000);

  const { clear: clearRuleInterval } = useInterval(async () => {
    if (address) {
      const res = await getRuleWebHook(address);

      if (Object.keys(res).length) {
        console.log("RES INS Rule: ", res);
        setRule(JSON.stringify(res, null, 1));
      }
    }
  }, 5000);

  useEffect(() => {
    if (data) clearDataInterval();
  }, [data]);

  useEffect(() => {
    if (rule) clearRuleInterval();
  }, [rule]);

  return (
    <div className={styles.responseColumns}>
      <div>
        <h4>DATA: </h4>
        <pre>{data}</pre>
      </div>
      <div>
        <h4>RULE:</h4>
        <pre>{rule}</pre>
      </div>
    </div>
  );
};