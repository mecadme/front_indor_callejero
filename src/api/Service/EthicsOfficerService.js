import useAPI from "../../hooks/useAPI";

const ETHICS_OFFICER_URL = "/ethics_officers";

const ethicsOfficerEndpoints = {
  getAll: ETHICS_OFFICER_URL,
  getById: (ethicsOfficerId) => `${ETHICS_OFFICER_URL}/${ethicsOfficerId}`,
  create: ETHICS_OFFICER_URL,
  update: (ethicsOfficerId) => `${ETHICS_OFFICER_URL}/${ethicsOfficerId}`,
  delete: (ethicsOfficerId) => `${ETHICS_OFFICER_URL}/${ethicsOfficerId}`,
  uploadPhoto: `${ETHICS_OFFICER_URL}/upload_photo`,
  getPhoto: (fileName) => `${ETHICS_OFFICER_URL}/photo/${fileName}`,
};

const useGetEthicsOfficers = () => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getEthicsOfficers = () => fetchData("GET", ethicsOfficerEndpoints.getAll);

  return { data, error, loading, getEthicsOfficers };
};

const useGetEthicsOfficerById = (ethicsOfficerId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getEthicsOfficerById = () =>
    fetchData("GET", ethicsOfficerEndpoints.getById(ethicsOfficerId));

  return { data, error, loading, getEthicsOfficerById };
};

const useCreateEthicsOfficer = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const createEthicsOfficer = (body) =>
    fetchData("POST", ethicsOfficerEndpoints.create, body);

  return { data, error, loading, createEthicsOfficer };
};

const useUpdateEthicsOfficer = (ethicsOfficerId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const updateEthicsOfficer = (body) =>
    fetchData("PATCH", ethicsOfficerEndpoints.update(ethicsOfficerId), body);

  return { data, error, loading, updateEthicsOfficer };
};

const useDeleteEthicsOfficer = (ethicsOfficerId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const deleteEthicsOfficer = () =>
    fetchData("DELETE", ethicsOfficerEndpoints.delete(ethicsOfficerId));

  return { data, error, loading, deleteEthicsOfficer };
};

const useUploadEthicsOfficerPhoto = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const uploadEthicsOfficerPhoto = (ethicsOfficerId, file) =>
    fetchData("PUT", ethicsOfficerEndpoints.uploadPhoto, { ethicsOfficerId, file });

  return { data, error, loading, uploadEthicsOfficerPhoto };
};

const useGetEthicsOfficerPhoto = (fileName) => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getEthicsOfficerPhoto = () =>
    fetchData("GET", ethicsOfficerEndpoints.getPhoto(fileName));

  return { data, error, loading, getEthicsOfficerPhoto };
};

export {
  useGetEthicsOfficers,
  useGetEthicsOfficerById,
  useCreateEthicsOfficer,
  useUpdateEthicsOfficer,
  useDeleteEthicsOfficer,
  useUploadEthicsOfficerPhoto,
  useGetEthicsOfficerPhoto,
};
