import useAPI from "../../hooks/useAPI";

const FACEBOOK_VIDEO_URL = "/facebook_videos";

const facebookVideoEndpoints = {
  getAll: FACEBOOK_VIDEO_URL,
  getById: (facebookVideoId) => `${FACEBOOK_VIDEO_URL}/${facebookVideoId}`,
  create: FACEBOOK_VIDEO_URL,
  update: (facebookVideoId) => `${FACEBOOK_VIDEO_URL}/${facebookVideoId}`,
  delete: (facebookVideoId) => `${FACEBOOK_VIDEO_URL}/${facebookVideoId}`,
};

const useGetFacebookVideos = () => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getFacebookVideos = () => fetchData("GET", facebookVideoEndpoints.getAll);

  return { data, error, loading, getFacebookVideos };
};

const useGetFacebookVideoById = (facebookVideoId) => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getFacebookVideoById = () =>
    fetchData("GET", facebookVideoEndpoints.getById(facebookVideoId));

  return { data, error, loading, getFacebookVideoById };
};

const useCreateFacebookVideo = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const createFacebookVideo = (body) =>
    fetchData("POST", facebookVideoEndpoints.create, body);

  return { data, error, loading, createFacebookVideo };
};

const useUpdateFacebookVideo = (facebookVideoId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const updateFacebookVideo = (body) =>
    fetchData("PATCH", facebookVideoEndpoints.update(facebookVideoId), body);

  return { data, error, loading, updateFacebookVideo };
};

const useDeleteFacebookVideo = (facebookVideoId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const deleteFacebookVideo = () =>
    fetchData("DELETE", facebookVideoEndpoints.delete(facebookVideoId));

  return { data, error, loading, deleteFacebookVideo };
};

export {
  useGetFacebookVideos,
  useGetFacebookVideoById,
  useCreateFacebookVideo,
  useUpdateFacebookVideo,
  useDeleteFacebookVideo,
};
