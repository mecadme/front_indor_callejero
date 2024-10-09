const renderIconTimeline = (eventType, event) => {
  switch (eventType) {
    case "GOAL":
      return "https://cdn-icons-png.flaticon.com/512/5043/5043542.png";
    case "CARD":
      return event.cardType === "YELLOW"
        ? "https://cdn-icons-png.flaticon.com/512/3363/3363491.png"
        : "https://cdn-icons-png.flaticon.com/512/451/451718.png";
    case "SUBSTITUTION":
      return "https://cdn-icons-png.flaticon.com/512/2716/2716280.png";
    default:
      return "https://cdn-icons-png.flaticon.com/512/1828/1828665.png";
  }
};

const renderIconBanner = (eventType) => {
  switch (eventType) {
    case "GOAL":
      return "https://cdn-icons-png.flaticon.com/512/5043/5043542.png";
    case "ASSIST":
      return "https://cdn-icons-png.flaticon.com/512/6664/6664856.png";
  
    default:
      return "https://cdn-icons-png.flaticon.com/512/1828/1828665.png";
  }
};

export  { renderIconTimeline, renderIconBanner };
