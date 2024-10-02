import useAPI from "../../hooks/useApi";

const MATCH_URL = "/matches";

const matchEndpoints = {
  getAll: MATCH_URL,
  getById: (matchId) => `${MATCH_URL}/${matchId}`,
  create: MATCH_URL,
  update: (matchId) => `${MATCH_URL}/${matchId}`,
  delete: (matchId) => `${MATCH_URL}/${matchId}`,
  registerEvent: (matchId) => `${MATCH_URL}/${matchId}/event`,
  start: (matchId) => `${MATCH_URL}/${matchId}/start`,
  pause: (matchId) => `${MATCH_URL}/${matchId}/pause`,
  resume: (matchId) => `${MATCH_URL}/${matchId}/resume`,
  stop: (matchId) => `${MATCH_URL}/${matchId}/stop`,
  getRemainingTime: (matchId) => `${MATCH_URL}/${matchId}/remaining_time`,
  setLineUp: (matchId) => `${MATCH_URL}/${matchId}/line_up`,
  changePlayer: (matchId) => `${MATCH_URL}/${matchId}/change_player`,
  getLineUp: (matchId) => `${MATCH_URL}/${matchId}/line_up`,
  getAllLineUps: `${MATCH_URL}/lineUps`,
};

const getMatches = () => useAPI("public", matchEndpoints.getAll, "GET");

const getMatchById = (matchId) =>
  useAPI("private", matchEndpoints.getById(matchId), "GET");

const createMatch = (body) =>
  useAPI("private", matchEndpoints.create, "POST", body);

const updateMatch = (matchId, body) =>
  useAPI("private", matchEndpoints.update(matchId), "PATCH", body);

const deleteMatch = (matchId) =>
  useAPI("private", matchEndpoints.delete(matchId), "DELETE");

const registerMatchEvent = (matchId, body) =>
  useAPI("private", matchEndpoints.registerEvent(matchId), "POST", body);

const startMatch = (matchId) =>
  useAPI("private", matchEndpoints.start(matchId), "POST");

const pauseMatch = (matchId) =>
  useAPI("private", matchEndpoints.pause(matchId), "POST");

const resumeMatch = (matchId) =>
  useAPI("private", matchEndpoints.resume(matchId), "POST");

const stopMatch = (matchId) =>
  useAPI("private", matchEndpoints.stop(matchId), "POST");

const getRemainingTime = (matchId) =>
  useAPI("private", matchEndpoints.getRemainingTime(matchId), "GET");

const setLineUp = (matchId, body) =>
  useAPI("private", matchEndpoints.setLineUp(matchId), "POST", body);

const changePlayer = (matchId, body) =>
  useAPI("private", matchEndpoints.changePlayer(matchId), "PUT", body);

const getLineUp = (matchId) =>
  useAPI("private", matchEndpoints.getLineUp(matchId), "GET");

const getAllLineUps = () =>
  useAPI("public", matchEndpoints.getAllLineUps, "GET");

export {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  registerMatchEvent,
  startMatch,
  pauseMatch,
  resumeMatch,
  stopMatch,
  getRemainingTime,
  setLineUp,
  changePlayer,
  getLineUp,
  getAllLineUps,
};
