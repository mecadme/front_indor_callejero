import useAPI from "../../hooks/useAPI";

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

const useGetMatches = () => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getMatches = () => fetchData("GET", matchEndpoints.getAll);

  return { data, error, loading, getMatches };
};

const useGetMatchById = (matchId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getMatchById = () => fetchData("GET", matchEndpoints.getById(matchId));

  return { data, error, loading, getMatchById };
};

const useCreateMatch = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const createMatch = (body) => fetchData("POST", matchEndpoints.create, body);

  return { data, error, loading, createMatch };
};

const useUpdateMatch = (matchId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const updateMatch = (body) =>
    fetchData("PATCH", matchEndpoints.update(matchId), body);

  return { data, error, loading, updateMatch };
};

const useDeleteMatch = (matchId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const deleteMatch = () => fetchData("DELETE", matchEndpoints.delete(matchId));

  return { data, error, loading, deleteMatch };
};

const useRegisterMatchEvent = (matchId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const registerMatchEvent = (body) =>
    fetchData("POST", matchEndpoints.registerEvent(matchId), body);

  return { data, error, loading, registerMatchEvent };
};

const useStartMatch = (matchId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const startMatch = () => fetchData("POST", matchEndpoints.start(matchId));

  return { data, error, loading, startMatch };
};

const usePauseMatch = (matchId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const pauseMatch = () => fetchData("POST", matchEndpoints.pause(matchId));

  return { data, error, loading, pauseMatch };
};

const useResumeMatch = (matchId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const resumeMatch = () => fetchData("POST", matchEndpoints.resume(matchId));

  return { data, error, loading, resumeMatch };
};

const useStopMatch = (matchId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const stopMatch = () => fetchData("POST", matchEndpoints.stop(matchId));

  return { data, error, loading, stopMatch };
};

const useGetRemainingTime = (matchId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getRemainingTime = () =>
    fetchData("GET", matchEndpoints.getRemainingTime(matchId));

  return { data, error, loading, getRemainingTime };
};

const useSetLineUp = (matchId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const setLineUp = (body) =>
    fetchData("POST", matchEndpoints.setLineUp(matchId), body);

  return { data, error, loading, setLineUp };
};

const useChangePlayer = (matchId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const changePlayer = (body) =>
    fetchData("PUT", matchEndpoints.changePlayer(matchId), body);

  return { data, error, loading, changePlayer };
};

const useGetLineUp = (matchId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getLineUp = () => fetchData("GET", matchEndpoints.getLineUp(matchId));

  return { data, error, loading, getLineUp };
};

const useGetAllLineUps = () => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getAllLineUps = () => fetchData("GET", matchEndpoints.getAllLineUps);

  return { data, error, loading, getAllLineUps };
};

export {
  useGetMatches,
  useGetMatchById,
  useCreateMatch,
  useUpdateMatch,
  useDeleteMatch,
  useRegisterMatchEvent,
  useStartMatch,
  usePauseMatch,
  useResumeMatch,
  useStopMatch,
  useGetRemainingTime,
  useSetLineUp,
  useChangePlayer,
  useGetLineUp,
  useGetAllLineUps,
};
