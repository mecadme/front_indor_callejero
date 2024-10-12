import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { useGetInformation } from "../../api/Service/Information_Service.js";
import Loading from "../Utils/Loading.jsx";

const PhotoCarrousell = ({ information_type }) => {
  const [index, setIndex] = useState(0);
  const { data, error, loading, getInformation } = useGetInformation();

  useEffect(() => {
    getInformation(); // Llama al hook para obtener la data cuando el componente se monta
  }, []);

  const InformationType = {
    PROJECT_STREET: "PROJECT_STREET",
    ALL_YOU_HAVE_TO_KNOW: "ALL_YOU_HAVE_TO_KNOW",
    HISTORICAL_EVENTS: "HISTORICAL_EVENTS",
  };

  // Filtra la data por el tipo de información proporcionado
  const filteredData = data?.filter(
    (item) => item.type === InformationType[information_type]
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!filteredData || filteredData.length === 0) {
    return <div>No hay información disponible para este tipo.</div>;
  }

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {filteredData.map((item) => (
        <Carousel.Item key={item.informationId}>
          {/* Usamos la URL de la imagen de la data */}
          <img
            className="d-block w-100"
            src={item.photoUrl}
            alt={`Slide ${item.informationId}`}
          />
          <Carousel.Caption>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default PhotoCarrousell;
