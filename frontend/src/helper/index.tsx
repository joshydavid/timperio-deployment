import CountUp from "react-countup";

export const formatWithoutDollarSign = (
  value: number,
  showDecimal: boolean = false
) => <CountUp end={value} separator="," decimals={showDecimal ? 2 : 0} />;

export const formatter = (value: number) => (
  <>
    $ <CountUp end={value} separator="," decimals={2} />
  </>
);
