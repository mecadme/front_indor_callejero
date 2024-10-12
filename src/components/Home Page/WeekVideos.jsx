import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import axios from "../../api/axios";
import "./css/WeekVideos.css";

const WeekVideos = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const WEEKVIDEOS_URL = "/facebook_videos";

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(WEEKVIDEOS_URL);
      setVideos(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  
  const handleShowModal = (video) => {
    setSelectedVideo(video); 
    setShowModal(true); 
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container className="videos mt-4">
      <h3
        className="text-center mb-4"
      >
        ÚLTIMOS VÍDEOS
      </h3>
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        data-bs-theme="dark"
      >
        {videos
          .slice()
          .reverse()
          .map((video) => (
            <Carousel.Item key={video.facebookVideoId}>
              <div
                onClick={() => handleShowModal(video)}
                style={{ cursor: "pointer" }}
                className="video-container custom-video d-flex justify-content-center align-items-center"
              >
                <iframe
                  width="70%"
                  height="600px"
                  src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
                    video.videoUrl
                  )}`}
                  title={video.videoTitle}
                  style={{ border: "none", cursor: "pointer",
                   }}
                  allowFullScreen
                />
                <Carousel.Caption className="custom-caption">
                  <div className="caption-background">
                    <h3>{video.videoTitle}</h3>
                    <p>{video.videoDescription}</p>
                  </div>
                </Carousel.Caption>
              </div>
            </Carousel.Item>
          ))}
      </Carousel>
    </Container>
  );
};

export default WeekVideos;
