import useAPI from "../../hooks/useApi";

const CURRENT_VALUE_URL = "/api/currentValue";

const currentValueEndpoints = {
  get: (currentValueId) => `${CURRENT_VALUE_URL}/${currentValueId}`,
  create: CURRENT_VALUE_URL,
  update: CURRENT_VALUE_URL,
  delete: (currentValueId) => `${CURRENT_VALUE_URL}/${currentValueId}`,
};

const getCurrentValue = (currentValueId) => 
  useAPI("public", currentValueEndpoints.get(currentValueId), "GET");

const createCurrentValue = (body) => 
  useAPI("private", currentValueEndpoints.create, "POST", body);

const updateCurrentValue = (body) => 
  useAPI("private", currentValueEndpoints.update, "PUT", body);

const deleteCurrentValue = (currentValueId) => 
  useAPI("private", currentValueEndpoints.delete(currentValueId), "DELETE");

export {
  getCurrentValue,
  createCurrentValue,
  updateCurrentValue,
  deleteCurrentValue,
};
