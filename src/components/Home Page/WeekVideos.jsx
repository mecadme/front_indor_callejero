import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";

import "bootstrap/dist/css/bootstrap.min.css";
import "./css/WeekVideos.css";
import axios from "../../api/axios";

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} data-bs-theme="dark">
      {videos.slice().reverse().map((video) => (
        <Carousel.Item key={video.facebookVideoId}>
          <iframe
            width="100%"
            height="400px"
            src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.videoUrl)}`}
            title={video.videoTitle}
            style={{ border: "none" }}
            allowFullScreen
          />
          <Carousel.Caption className="custom-caption">
            <div className="caption-background">
              <h3>{video.videoTitle}</h3>
              <p>{video.videoDescription}</p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default WeekVideos;
