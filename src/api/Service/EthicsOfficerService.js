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

  const getEthicsOfficers = () =>
    fetchData("GET", ethicsOfficerEndpoints.getAll);

  return { data, error, loading, getEthicsOfficers };
};

const useGetEthicsOfficerById = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getEthicsOfficerById = (ethicsOfficerId) =>
    fetchData("GET", ethicsOfficerEndpoints.getById(ethicsOfficerId));

  return { data, error, loading, getEthicsOfficerById };
};

const useCreateEthicsOfficer = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const createEthicsOfficer = (body) =>
    fetchData("POST", ethicsOfficerEndpoints.create, body);

  return { data, error, loading, createEthicsOfficer };
};

const useUpdateEthicsOfficer = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const updateEthicsOfficer = (ethicsOfficerId, body) =>
    fetchData("PATCH", ethicsOfficerEndpoints.update(ethicsOfficerId), body);

  return { data, error, loading, updateEthicsOfficer };
};

const useDeleteEthicsOfficer = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const deleteEthicsOfficer = (ethicsOfficerId) =>
    fetchData("DELETE", ethicsOfficerEndpoints.delete(ethicsOfficerId));

  return { data, error, loading, deleteEthicsOfficer };
};

export {
  useGetEthicsOfficers,
  useGetEthicsOfficerById,
  useCreateEthicsOfficer,
  useUpdateEthicsOfficer,
  useDeleteEthicsOfficer,
};
