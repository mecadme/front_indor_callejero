import useAPI from "../../hooks/useAPI";

const CURRENT_VALUE_URL = "/currentValue";

const currentValueEndpoints = {
  get: (currentValueId) => `${CURRENT_VALUE_URL}`,
  create: CURRENT_VALUE_URL,
  update: (currentValueId) => `${CURRENT_VALUE_URL}/${currentValueId}`,
  delete: (currentValueId) => `${CURRENT_VALUE_URL}/${currentValueId}`,
};

const useGetCurrentValue = () => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getCurrentValue = () =>
    fetchData("GET", currentValueEndpoints.get());

  return { data, error, loading, getCurrentValue };
};

const useCreateCurrentValue = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const createCurrentValue = (body) =>
    fetchData("POST", currentValueEndpoints.create, body);

  return { data, error, loading, createCurrentValue };
};

const useUpdateCurrentValue = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const updateCurrentValue = (currentValueId, body) =>
    fetchData("PUT", currentValueEndpoints.update(currentValueId), body);

  return { data, error, loading, updateCurrentValue };
};

const useDeleteCurrentValue = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const deleteCurrentValue = (currentValueId) =>
    fetchData("DELETE", currentValueEndpoints.delete(currentValueId));

  return { data, error, loading, deleteCurrentValue };
};

export {
  useGetCurrentValue,
  useCreateCurrentValue,
  useUpdateCurrentValue,
  useDeleteCurrentValue,
};
