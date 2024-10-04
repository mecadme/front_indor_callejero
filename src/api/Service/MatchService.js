import useAPI from "../../hooks/useAPI";
import { useCallback } from "react";

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

  const getMatches = useCallback(() => {
    fetchData("GET", matchEndpoints.getAll);
  }, [fetchData]);

  return { data, error, loading, getMatches };
};

const useGetMatchById = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getMatchById = (matchId) =>
    fetchData("GET", matchEndpoints.getById(matchId));

  return { data, error, loading, getMatchById };
};

const useCreateMatch = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const createMatch = (body) => fetchData("POST", matchEndpoints.create, body);

  return { data, error, loading, createMatch };
};

const useUpdateMatch = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const updateMatch = (matchId, body) =>
    fetchData("PATCH", matchEndpoints.update(matchId), body);

  return { data, error, loading, updateMatch };
};

const useDeleteMatch = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const deleteMatch = (matchId) =>
    fetchData("DELETE", matchEndpoints.delete(matchId));

  return { data, error, loading, deleteMatch };
};

const useRegisterMatchEvent = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const registerMatchEvent = (matchId, body) =>
    fetchData("POST", matchEndpoints.registerEvent(matchId), body);

  return { data, error, loading, registerMatchEvent };
};

const useStartMatch = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const startMatch = (matchId) =>
    fetchData("POST", matchEndpoints.start(matchId));

  return { data, error, loading, startMatch };
};

const usePauseMatch = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const pauseMatch = (matchId) =>
    fetchData("POST", matchEndpoints.pause(matchId));

  return { data, error, loading, pauseMatch };
};

const useResumeMatch = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const resumeMatch = (matchId) =>
    fetchData("POST", matchEndpoints.resume(matchId));

  return { data, error, loading, resumeMatch };
};

const useStopMatch = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const stopMatch = (matchId) =>
    fetchData("POST", matchEndpoints.stop(matchId));

  return { data, error, loading, stopMatch };
};

const useGetRemainingTime = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getRemainingTime = (matchId) =>
    fetchData("GET", matchEndpoints.getRemainingTime(matchId));

  return { data, error, loading, getRemainingTime };
};

const useSetLineUp = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const setLineUp = (matchId, body) =>
    fetchData("POST", matchEndpoints.setLineUp(matchId), body);

  return { data, error, loading, setLineUp };
};

const useChangePlayer = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const changePlayer = (matchId, body) =>
    fetchData("PUT", matchEndpoints.changePlayer(matchId), body);

  return { data, error, loading, changePlayer };
};

const useGetLineUp = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getLineUp = (matchId) =>
    fetchData("GET", matchEndpoints.getLineUp(matchId));

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
