import { type TInput } from "../Interfaces";
import { TokenDropDown } from "./TokenDropDown";

export const SwapInput = ({
  value,
  token,
  options,
  className="",
  classNameInput="",
  classNameDropDownButton="",
  classNameDropDownList="",
  onChange
}: TInput) => {
  const handleAmount = (amount: string) => {
    if (amount === "") {
      amount = "0";
    } else if (amount.length > 1 && amount[0] === "0" && amount[1] !== ".") {
      amount = amount.slice(1);
    }

    const regex = new RegExp(`^[0-9]+(\\.[0-9]{0,${token?.decimals ?? 18}})?$`);
    if (regex.test(amount)) {
      onChange(amount, token);
    }
  }

  if (value === "") {
    value = "0";
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        className={`h-full bg-transparent px-3 py-2 border-none focus:outline-none ${classNameInput}`}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleAmount(e.target.value);
        }}
      />
      <TokenDropDown
        items={options}
        selected={token}
        className="absolute inset-y-0 right-2"
        classNameButton={classNameDropDownButton}
        classNameList={classNameDropDownList}
        onSelect={(option) => onChange(value, option)}
      />
    </div>
  );
};