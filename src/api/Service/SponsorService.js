import useAPI from "../../hooks/useApi";

const SPONSOR_URL = "/sponsors";

const sponsorEndpoints = {
  getAll: SPONSOR_URL,
  getById: (sponsorId) => `${SPONSOR_URL}/${sponsorId}`,
  create: SPONSOR_URL,
  update: (sponsorId) => `${SPONSOR_URL}/${sponsorId}`,
  delete: (sponsorId) => `${SPONSOR_URL}/${sponsorId}`,
  uploadPhoto: `${SPONSOR_URL}/upload_photo`,
  getPhoto: (fileName) => `${SPONSOR_URL}/photo/${fileName}`,
};

const getSponsors = () => useAPI("public", sponsorEndpoints.getAll, "GET");

const getSponsorById = (sponsorId) =>
  useAPI("public", sponsorEndpoints.getById(sponsorId), "GET");

const createSponsor = (body) =>
  useAPI("private", sponsorEndpoints.create, "POST", body);

const updateSponsor = (sponsorId, body) =>
  useAPI("private", sponsorEndpoints.update(sponsorId), "PATCH", body);

const deleteSponsor = (sponsorId) =>
  useAPI("private", sponsorEndpoints.delete(sponsorId), "DELETE");

const uploadSponsorPhoto = (sponsorId, file) =>
  useAPI("private", sponsorEndpoints.uploadPhoto, "PUT", {
    sponsorId,
    sponsorPhoto: file,
  });

const getSponsorPhoto = (fileName) =>
  useAPI("public", sponsorEndpoints.getPhoto(fileName), "GET");

export {
  getSponsors,
  getSponsorById,
  createSponsor,
  updateSponsor,
  deleteSponsor,
  uploadSponsorPhoto,
  getSponsorPhoto,
};
