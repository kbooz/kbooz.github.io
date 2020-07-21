/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Typography from "typography";
import theme from "typography-theme-de-young";

theme.overrideThemeStyles = () => ({
  color: "white",
  body: {
    background: "#0f161d",
  },
  a: {
    textShadow: `none`,
  },
});

const typography = new Typography(theme);

export default typography;
