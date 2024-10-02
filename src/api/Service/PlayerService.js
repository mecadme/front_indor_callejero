import useAPI from "../../hooks/useAPI";

const PLAYERS_URL = "/players";

const playerEndpoints = {
  getAll: PLAYERS_URL,
  getById: (playerId) => `${PLAYERS_URL}/${playerId}`,
  create: PLAYERS_URL,
  update: (playerId) => `${PLAYERS_URL}/${playerId}`,
  delete: (playerId) => `${PLAYERS_URL}/${playerId}`,
  activate: (playerId) => `${PLAYERS_URL}/${playerId}/active`,
  suspend: (playerId) => `${PLAYERS_URL}/${playerId}/suspended`,
  injure: (playerId) => `${PLAYERS_URL}/${playerId}/injured`,
};

const useGetPlayers = () => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getPlayers = () => fetchData("GET", playerEndpoints.getAll);

  return { data, error, loading, getPlayers };
};

const useGetPlayerById = (playerId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getPlayerById = () => fetchData("GET", playerEndpoints.getById(playerId));

  return { data, error, loading, getPlayerById };
};

const useCreatePlayer = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const createPlayer = (body) => fetchData("POST", playerEndpoints.create, body);

  return { data, error, loading, createPlayer };
};

const useUpdatePlayer = (playerId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const updatePlayer = (body) => fetchData("PATCH", playerEndpoints.update(playerId), body);

  return { data, error, loading, updatePlayer };
};

const useDeletePlayer = (playerId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const deletePlayer = () => fetchData("DELETE", playerEndpoints.delete(playerId));

  return { data, error, loading, deletePlayer };
};

const useActivatePlayer = (playerId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const activatePlayer = () => fetchData("PUT", playerEndpoints.activate(playerId));

  return { data, error, loading, activatePlayer };
};

const useSuspendPlayer = (playerId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const suspendPlayer = () => fetchData("PUT", playerEndpoints.suspend(playerId));

  return { data, error, loading, suspendPlayer };
};

const useInjurePlayer = (playerId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const injurePlayer = () => fetchData("PUT", playerEndpoints.injure(playerId));

  return { data, error, loading, injurePlayer };
};

export {
  useGetPlayers,
  useGetPlayerById,
  useCreatePlayer,
  useUpdatePlayer,
  useDeletePlayer,
  useActivatePlayer,
  useSuspendPlayer,
  useInjurePlayer,
};
