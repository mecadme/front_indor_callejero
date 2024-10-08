import useAPI from "../../hooks/useAPI";
import { useCallback } from "react";

const RESULT_URL = "/results";

const resultEndpoints = {
  getAll: `${RESULT_URL}/all`,
  getResultsByMatch: (matchId) => `${RESULT_URL}/match/${matchId}`,
};

const useGetAllResults = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getAllResults = useCallback(() => {
    fetchData("GET", resultEndpoints.getAll);
  }, [fetchData]);

  return { data, error, loading, getAllResults };
};

const useGetResultsByMatch = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getResultsByMatch = useCallback(
    (matchId) => {
      fetchData("GET", resultEndpoints.getResultsByMatch(matchId));
    },
    [fetchData]
  );

  return { data, error, loading, getResultsByMatch };
};

export { useGetAllResults, useGetResultsByMatch };
