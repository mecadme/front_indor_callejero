import useAPI from "../../hooks/useAPI";

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

const useGetRounds = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getRounds = () => fetchData("GET", roundEndpoints.getAll);

  return { data, error, loading, getRounds };
};

const useGetRoundById = (roundId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getRoundById = () => fetchData("GET", roundEndpoints.getById(roundId));

  return { data, error, loading, getRoundById };
};

const useGetRoundsWithMatches = () => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getRoundsWithMatches = () =>
    fetchData("GET", roundEndpoints.getRoundsWithMatches);

  return { data, error, loading, getRoundsWithMatches };
};

const useGetRoundsWithMatchesByRoundId = (roundId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getRoundsWithMatchesByRoundId = () =>
    fetchData("GET", roundEndpoints.getRoundsWithMatchesByRoundId(roundId));

  return { data, error, loading, getRoundsWithMatchesByRoundId };
};

const useCreateRound = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const createRound = (body) => fetchData("POST", roundEndpoints.create, body);

  return { data, error, loading, createRound };
};

const useUpdateRound = (roundId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const updateRound = (body) =>
    fetchData("PATCH", roundEndpoints.update(roundId), body);

  return { data, error, loading, updateRound };
};

const useDeleteRound = (roundId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const deleteRound = () => fetchData("DELETE", roundEndpoints.delete(roundId));

  return { data, error, loading, deleteRound };
};

export {
  useGetRounds,
  useGetRoundById,
  useGetRoundsWithMatches,
  useGetRoundsWithMatchesByRoundId,
  useCreateRound,
  useUpdateRound,
  useDeleteRound,
};