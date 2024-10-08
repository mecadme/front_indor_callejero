import useAPI from "../../hooks/useAPI";

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

const useGetSponsors = () => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getSponsors = () => fetchData("GET", sponsorEndpoints.getAll);

  return { data, error, loading, getSponsors };
};

const useGetSponsorById = () => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getSponsorById = (sponsorId) => fetchData("GET", sponsorEndpoints.getById(sponsorId));

  return { data, error, loading, getSponsorById };
};

const useCreateSponsor = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const createSponsor = (body) => fetchData("POST", sponsorEndpoints.create, body);

  return { data, error, loading, createSponsor };
};

const useUpdateSponsor = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const updateSponsor = (sponsorId, body) =>
    fetchData("PATCH", sponsorEndpoints.update(sponsorId), body);

  return { data, error, loading, updateSponsor };
};

const useDeleteSponsor = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const deleteSponsor = (sponsorId) => fetchData("DELETE", sponsorEndpoints.delete(sponsorId));

  return { data, error, loading, deleteSponsor };
};


export {
  useGetSponsors,
  useGetSponsorById,
  useCreateSponsor,
  useUpdateSponsor,
  useDeleteSponsor
};
