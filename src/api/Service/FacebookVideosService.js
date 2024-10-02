import useAPI from "../../hooks/useApi";

const FACEBOOK_VIDEO_URL = "/facebook_videos";

const facebookVideoEndpoints = {
  getAll: FACEBOOK_VIDEO_URL,
  getById: (facebookVideoId) => `${FACEBOOK_VIDEO_URL}/${facebookVideoId}`,
  create: FACEBOOK_VIDEO_URL,
  update: (facebookVideoId) => `${FACEBOOK_VIDEO_URL}/${facebookVideoId}`,
  delete: (facebookVideoId) => `${FACEBOOK_VIDEO_URL}/${facebookVideoId}`,
};

const getFacebookVideos = () => useAPI("public", facebookVideoEndpoints.getAll, "GET");

const getFacebookVideoById = (facebookVideoId) =>
  useAPI("public", facebookVideoEndpoints.getById(facebookVideoId), "GET");

const createFacebookVideo = (body) =>
  useAPI("private", facebookVideoEndpoints.create, "POST", body);

const updateFacebookVideo = (facebookVideoId, body) =>
  useAPI("private", facebookVideoEndpoints.update(facebookVideoId), "PATCH", body);

const deleteFacebookVideo = (facebookVideoId) =>
  useAPI("private", facebookVideoEndpoints.delete(facebookVideoId), "DELETE");

export {
  getFacebookVideos,
  getFacebookVideoById,
  createFacebookVideo,
  updateFacebookVideo,
  deleteFacebookVideo,
};
