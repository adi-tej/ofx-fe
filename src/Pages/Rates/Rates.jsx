import React, { useCallback, useRef, useState } from "react";
import DropDown from "../../Components/DropDown";
import Input from "../../Components/Input";
import Loader from "../../Components/Loader";
import ProgressBar from "../../Components/ProgressBar";
import Text from "../../Components/Text";

import { useAnimationFrame } from "../../Hooks/useAnimationFrame";
import { ReactComponent as Transfer } from "../../Icons/Transfer.svg";

import CountryData from "../../Libs/Countries.json";
import countryToCurrency from "../../Libs/CountryCurrency.json";

import classes from "./Rates.module.css";

let countries = CountryData.CountryCodes;

const Rates = () => {
  const [fromCurrency, setFromCurrency] = useState("AU");
  const [toCurrency, setToCurrency] = useState("US");
  const [amount, setAmount] = useState("0.00");

  const [exchangeRate, setExchangeRate] = useState(0.7456);
  const [progression, setProgression] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const MARK_UP = 0.05;
  const fetchDataRef = useRef();

  const handleAmount = (e) => {
    let inputValue = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(inputValue)) {
      setAmount(inputValue);
    }
  };

  const Flag = ({ code }) => (
    <img
      alt={code || ""}
      src={`/img/flags/${code || ""}.svg`}
      width="20px"
      className={classes.flag}
    />
  );
  /* Question 4: Fetching API at end of progress
   *  - wrapped in useCallback to update function when currency is updated
   *  - assigned function to ref to access latest state of the function
   *  - Error handling: assigning detail to error state for 400,401,404,422,500
   */
  fetchDataRef.current = useCallback(async () => {
    if (!loading) {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      try {
        const response = await fetch(
          `https://rates.staging.api.paytron.com/rate/public?sellCurrency=${countryToCurrency[fromCurrency]}&buyCurrency=${countryToCurrency[toCurrency]}`,
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.detail || `Error fetching data ${response.status}`,
          );
        }
        setError("");
        setExchangeRate(data.retailRate);
      } catch (error) {
        setError(error.message);
        console.log(error.message);
      }
      setLoading(false);
    }
  }, [fromCurrency, toCurrency, loading]);

  // Demo progress bar moving :)
  // getting latest fetch function from ref
  useAnimationFrame(!loading, (deltaTime) => {
    setProgression((prevState) => {
      if (prevState > 0.997) {
        fetchDataRef.current();
        return 0;
      }
      return (prevState + deltaTime * 0.0001) % 1;
    });
  });

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.heading}>Currency Conversion</div>

        <div className={classes.rowWrapper}>
          <div>
            <DropDown
              leftIcon={<Flag code={fromCurrency} />}
              label={"From"}
              selected={countryToCurrency[fromCurrency]}
              options={countries.map(({ code }) => ({
                option: countryToCurrency[code],
                key: code,
                icon: <Flag code={code} />,
              }))}
              setSelected={(key) => {
                setFromCurrency(key);
              }}
              style={{ marginRight: "20px" }}
            />
          </div>

          <div className={classes.exchangeWrapper}>
            <div className={classes.transferIcon}>
              <Transfer height={"25px"} />
            </div>

            <div className={classes.rate}>{exchangeRate}</div>
          </div>

          <div>
            <DropDown
              leftIcon={<Flag code={toCurrency} />}
              label={"To"}
              selected={countryToCurrency[toCurrency]}
              options={countries.map(({ code }) => ({
                option: countryToCurrency[code],
                key: code,
                icon: <Flag code={code} />,
              }))}
              setSelected={(key) => {
                setToCurrency(key);
              }}
              style={{ marginLeft: "20px" }}
            />
          </div>
        </div>

        {/* Question 2: Amount Input */}
        <div className={classes.rowWrapper} style={{ alignItems: "end" }}>
          <div>
            <Input
              id="amount"
              name="amount"
              label="Amount"
              type="number"
              style={{ marginRight: "76.875px" }}
              value={amount}
              onChange={handleAmount}
              onBlur={() => setAmount(parseFloat(amount).toFixed(2))}
              min="0"
            />
          </div>

          {/* Question 3: Converted Amount with markup */}
          <div>
            <Text
              style={{ marginLeft: "76.875px", marginRight: "20px" }}
              text={(amount * exchangeRate * (1 - MARK_UP / 100)).toFixed(4)}
            />
          </div>

          {/* Question 3: Converted Amount without markup */}
          <div>
            <Text
              style={{ marginLeft: "20px" }}
              text={(amount * exchangeRate).toFixed(4)}
            />
          </div>
        </div>
        <ProgressBar
          progress={progression}
          animationClass={loading ? classes.slow : ""}
          style={{ marginTop: "20px" }}
        />

        {/* displaying error when not loading if exists */}
        {loading ? (
          <div className={classes.loaderWrapper}>
            <Loader width={"25px"} height={"25px"} />
          </div>
        ) : (
          error && <p className={classes.error}>{error}</p>
        )}
      </div>
    </div>
  );
};

export default Rates;
