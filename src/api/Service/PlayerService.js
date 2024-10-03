import useAPI from "../../hooks/useAPI";
import { useCallback } from "react";

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

  const getPlayers = useCallback(() => {
    fetchData("GET", playerEndpoints.getAll);
  }, [fetchData]);

  return { data, error, loading, getPlayers };
};

const useGetPlayerById = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getPlayerById = (playerId) =>
    fetchData("GET", playerEndpoints.getById(playerId));

  return { data, error, loading, getPlayerById };
};

const useCreatePlayer = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const createPlayer = (body) =>
    fetchData("POST", playerEndpoints.create, body);

  return { data, error, loading, createPlayer };
};

const useUpdatePlayer = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const updatePlayer = (playerId, body) =>
    fetchData("PATCH", playerEndpoints.update(playerId), body);

  return { data, error, loading, updatePlayer };
};

const useDeletePlayer = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const deletePlayer = (playerId) =>
    fetchData("DELETE", playerEndpoints.delete(playerId));

  return { data, error, loading, deletePlayer };
};

const useActivatePlayer = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const activatePlayer = (playerId) =>
    fetchData("PUT", playerEndpoints.activate(playerId));

  return { data, error, loading, activatePlayer };
};

const useSuspendPlayer = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const suspendPlayer = (playerId) =>
    fetchData("PUT", playerEndpoints.suspend(playerId));

  return { data, error, loading, suspendPlayer };
};

const useInjurePlayer = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const injurePlayer = (playerId) =>
    fetchData("PUT", playerEndpoints.injure(playerId));

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
