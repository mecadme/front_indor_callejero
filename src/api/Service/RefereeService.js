import useAPI from "../../hooks/useAPI";
import { useCallback } from "react";

const REFEREES_URL = "/referees";

const refereeEndpoints = {
  getAll: REFEREES_URL,
  getByMatchId: (matchId) => `${REFEREES_URL}/match/${matchId}`,
  getById: (refereeId) => `${REFEREES_URL}/${refereeId}`,
  create: REFEREES_URL,
  update: (refereeId) => `${REFEREES_URL}/${refereeId}`,
  delete: (refereeId) => `${REFEREES_URL}/${refereeId}`,
  
};

const useGetReferees = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getReferees = useCallback(() => {
    fetchData("GET", refereeEndpoints.getAll);
  }, [fetchData]);

  return { data, error, loading, getReferees };
};

const useGetRefereeByMatchId = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getRefereeByMatchId = (matchId) =>
    fetchData("GET", refereeEndpoints.getByMatchId(matchId));

  return { data, error, loading, getRefereeByMatchId };
};

const useGetRefereeById = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getRefereeById = (refereeId) =>
    fetchData("GET", refereeEndpoints.getById(refereeId));

  return { data, error, loading, getRefereeById };
};

const useCreateReferee = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const createReferee = (body) =>
    fetchData("POST", refereeEndpoints.create, body);

  return { data, error, loading, createReferee };
};

const useUpdateReferee = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const updateReferee = (refereeId, body) =>
    fetchData("PATCH", refereeEndpoints.update(refereeId), body);

  return { data, error, loading, updateReferee };
};

const useDeleteReferee = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const deleteReferee = (refereeId) =>
    fetchData("DELETE", refereeEndpoints.delete(refereeId));

  return { data, error, loading, deleteReferee };
};

const useAddRefereeToMatch = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const addRefereeToMatch = (refereeId, matchId) =>
    fetchData("PATCH", refereeEndpoints.addRefereeToMatch(refereeId, matchId));

  return { data, error, loading, addRefereeToMatch };
};

export {
  useGetReferees,
  useGetRefereeByMatchId,
  useGetRefereeById,
  useCreateReferee,
  useUpdateReferee,
  useDeleteReferee,
  useAddRefereeToMatch,
};
