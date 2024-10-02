import useAPI from "../../hooks/useApi";

const ROUND_URL = "/rounds";

const roundEndpoints = {
  getAll: ROUND_URL,
  getById: (roundId) => `${ROUND_URL}/${roundId}`,
  getRoundsWithMatches: `${ROUND_URL}/withMatches`,
  getRoundsWithMatchesByRoundId: (roundId) => `${ROUND_URL}/withMatches/${roundId}`,
  create: ROUND_URL,
  update: (roundId) => `${ROUND_URL}/${roundId}`,
  delete: (roundId) => `${ROUND_URL}/${roundId}`,
};

const getRounds = () => useAPI("private", roundEndpoints.getAll, "GET");

const getRoundById = (roundId) =>
  useAPI("private", roundEndpoints.getById(roundId), "GET");

const getRoundsWithMatches = () =>
  useAPI("public", roundEndpoints.getRoundsWithMatches, "GET");

const getRoundsWithMatchesByRoundId = (roundId) =>
  useAPI("private", roundEndpoints.getRoundsWithMatchesByRoundId(roundId), "GET");

const createRound = (body) =>
  useAPI("private", roundEndpoints.create, "POST", body);

const updateRound = (roundId, body) =>
  useAPI("private", roundEndpoints.update(roundId), "PATCH", body);

const deleteRound = (roundId) =>
  useAPI("private", roundEndpoints.delete(roundId), "DELETE");

export {
  getRounds,
  getRoundById,
  getRoundsWithMatches,
  getRoundsWithMatchesByRoundId,
  createRound,
  updateRound,
  deleteRound,
};
