import React, { useEffect } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import EmptyData from "../../components/Administration/EmptyData";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Loading from "../../components/Utils/Loading";
import PageBanner from "../../components/Utils/PageBanner";
import { useGetSponsorById } from "../../api/Service/SponsorService";

import "./css/SponsorPage.css";

import bronze_frame from "../../assets/bronze-frame.svg";
import gold_frame from "../../assets/gold-frame.svg";
import silver_frame from "../../assets/silver-frame.svg";

const sponsorLevels = {
  GOLD: {
    image: gold_frame,
    budget: 1000,
    size: 19,
  },
  SILVER: {
    image: silver_frame,
    budget: 500,
    size: 19,
  },
  BRONZE: {
    image: bronze_frame,
    budget: 250,
    size: 19,
  },
};

const SponsorPage = () => {
  const { sponsorId } = useParams();
  const { data, loading, error, getSponsorById } = useGetSponsorById();

  useEffect(() => {
    getSponsorById(sponsorId);
  }, [sponsorId]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <Loading />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Container className="text-center py-5">
        <h4 className="text-danger">
          Error: {error?.message || "Algo salió mal"}
        </h4>
        <EmptyData message={"No hay información sobre el sponsor"} />
      </Container>
    );
  }

  const getSponsorLevel = (amount) => {
    if (amount >= sponsorLevels.GOLD.budget) {
      return sponsorLevels.GOLD;
    } else if (amount >= sponsorLevels.SILVER.budget) {
      return sponsorLevels.SILVER;
    } else {
      return sponsorLevels.BRONZE;
    }
  };

  const sponsorLevel = getSponsorLevel(data.contributionAmount);

  const handleSponsorClick = () => {
    const url =
      data.sponsorPageUrl || "https://www.facebook.com/IndorCallejeroAzogues";
    window.open(url, "_blank");
  };

  return (
    <>
      <Header />
      <Container fluid className="p-0">
        <Container className="banner-container">
          <PageBanner title={data.sponsor || "Detalles del Sponsor"} />

          <div>
            <Container 
            className="text-center sponsor-frame"
             style={{
                cursor: "pointer",
                backgroundImage: `url(${sponsorLevel.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: `${2.25*sponsorLevel.size}rem`,
                height: `${2.75*sponsorLevel.size}rem`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "20%",
                transition: "background-image 0.2s ease, color 0.2s ease",
              }}
              onClick={handleSponsorClick}>
              <Row className="align-items-center">
                <Col
                  xs={12}
                  md={12}
                  className="text-center my-5 mb-md-0"
                 
                >
                  <Image
                  className="sponsor-image"
                    src={data?.photoUrl || fallbackImage}
                    alt={data?.sponsor || "Sponsor"}
                    style={{
                        marginTop: "10rem",
                      width: `${1*sponsorLevel.size}rem`,
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: "5%",
                    }}
                  />
                </Col>

                <Col xs={12} md={6} className="text-center my-5">
                  
                </Col>
              </Row>
            </Container>
          </div>

          <Container>
            <h3 className="text-center mb-4">Biografía</h3>
            <Row className="justify-content-center">
              <Col xs={12} md={10} lg={8} className="text-center">
                <p style={{ lineHeight: "1.6", fontSize: "1.1rem" }}>
                  {data.bio || "No hay biografía disponible para este sponsor."}
                </p>
              </Col>
            </Row>
          </Container>
        </Container>
      </Container>
      <Footer />
    </>
  );
};

export default SponsorPage;
