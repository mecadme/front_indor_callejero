import useAPI from "../../hooks/useApi";

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

const getPlayers = () => useAPI("public", playerEndpoints.getAll, GET);

const getPlayerById = (playerId) =>
  useAPI("private", playerEndpoints.getById(playerId), GET);

const createPlayer = (body) =>
  useAPI("private", playerEndpoints.create, POST, body);

const updatePlayer = (playerId, body) =>
  useAPI("private", playerEndpoints.update(playerId), PATCH, body);

const deletePlayer = (playerId) =>
  useAPI("private", playerEndpoints.delete(playerId), DELETE);

const activatePlayer = (playerId) =>
  useAPI("private", playerEndpoints.activate(playerId), PUT);

const suspendPlayer = (playerId) =>
  useAPI("private", playerEndpoints.suspend(playerId), PUT);

const injurePlayer = (playerId) =>
  useAPI("private", playerEndpoints.injure(playerId), PUT);

export {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  activatePlayer,
  suspendPlayer,
  injurePlayer,
};
