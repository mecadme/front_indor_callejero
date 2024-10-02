import useAPI from "../../hooks/useApi";

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

const getEthicsOfficers = () => useAPI("public", ethicsOfficerEndpoints.getAll, GET);

const getEthicsOfficerById = (ethicsOfficerId) =>
  useAPI("private", ethicsOfficerEndpoints.getById(ethicsOfficerId), GET);

const createEthicsOfficer = (body) =>
  useAPI("private", ethicsOfficerEndpoints.create, POST, body);

const updateEthicsOfficer = (ethicsOfficerId, body) =>
  useAPI("private", ethicsOfficerEndpoints.update(ethicsOfficerId), PATCH, body);

const deleteEthicsOfficer = (ethicsOfficerId) =>
  useAPI("private", ethicsOfficerEndpoints.delete(ethicsOfficerId), DELETE);

const uploadEthicsOfficerPhoto = (ethicsOfficerId, file) =>
  useAPI("private", ethicsOfficerEndpoints.uploadPhoto, PUT, { ethicsOfficerId, file });

const getEthicsOfficerPhoto = (fileName) =>
  useAPI("public", ethicsOfficerEndpoints.getPhoto(fileName), GET);

export {
  getEthicsOfficers,
  getEthicsOfficerById,
  createEthicsOfficer,
  updateEthicsOfficer,
  deleteEthicsOfficer,
  uploadEthicsOfficerPhoto,
  getEthicsOfficerPhoto,
};
