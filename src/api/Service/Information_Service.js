import useAPI from "../../hooks/useAPI";

const INFORMATION_URL = "/information";

const informationEndpoints = {
  getAll: INFORMATION_URL,
  getById: (informationId) => `${INFORMATION_URL}/${informationId}`,
  create: INFORMATION_URL,
  update: (informationId) => `${INFORMATION_URL}/${informationId}`,
  delete: (informationId) => `${INFORMATION_URL}/${informationId}`,
  uploadPhoto: `${INFORMATION_URL}/upload_photo`,
  getPhoto: (fileName) => `${INFORMATION_URL}/photo/${fileName}`,
};

const useGetInformation = () => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getInformation = () => fetchData("GET", informationEndpoints.getAll);

  return { data, error, loading, getInformation };
};

const useGetInformationById = () => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getInformationById = (informationId) =>
    fetchData("GET", informationEndpoints.getById(informationId));

  return { data, error, loading, getInformationById };
};

const useCreateInformation = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const createInformation = (body) =>
    fetchData("POST", informationEndpoints.create, body);

  return { data, error, loading, createInformation };
};

const useUpdateInformation = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const updateInformation = (informationId, body) =>
    fetchData("PATCH", informationEndpoints.update(informationId), body);

  return { data, error, loading, updateInformation };
};

const useDeleteInformation = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const deleteInformation = (informationId) =>
    fetchData("DELETE", informationEndpoints.delete(informationId));

  return { data, error, loading, deleteInformation };
};

const useUploadInformationPhoto = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const uploadInformationPhoto = (informationId, file) => {
    const formData = new FormData();
    formData.append("information_id", informationId);
    formData.append("file", file);

    return fetchData("PUT", informationEndpoints.uploadPhoto, formData, {
      "Content-Type": "multipart/form-data",
    });
  };

  return { data, error, loading, uploadInformationPhoto };
};

const useGetInformationPhoto = () => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getInformationPhoto = (fileName) =>
    fetchData("GET", informationEndpoints.getPhoto(fileName));

  return { data, error, loading, getInformationPhoto };
};

export {
  useGetInformation,
  useGetInformationById,
  useCreateInformation,
  useUpdateInformation,
  useDeleteInformation,
  useUploadInformationPhoto,
  useGetInformationPhoto,
};
