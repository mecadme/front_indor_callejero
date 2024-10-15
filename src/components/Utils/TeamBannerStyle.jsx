import StyleUtils from "./StyleUtils";

const { lightenColor, getTextColor, zigZagSvg } = StyleUtils();

const getTeamStyles = ({teamColor}) => {
  const lighterColor = lightenColor(teamColor, 40);

  return {
    containerStyle: {
      backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
        zigZagSvg(teamColor, lighterColor)
      )}")`,
      backgroundSize: "cover",
      width: "20%",
      display: "flex",
      transition: "background-image 0.2s ease, color 0.2s ease",
    },
    textStyle: {
      color: getTextColor(lighterColor),
      fontSize: "2rem",
      fontWeight: "bold",
    },
  };
};

export default getTeamStyles;
