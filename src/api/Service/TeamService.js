import useAPI from "../../hooks/useAPI";
import { useCallback } from "react";
const TEAMS_URL = "/teams";

const teamEndpoints = {
  getAll: TEAMS_URL,
  getById: (teamId) => `${TEAMS_URL}/${teamId}`,
  create: TEAMS_URL,
  update: (teamId) => `${TEAMS_URL}/${teamId}`,
  delete: (teamId) => `${TEAMS_URL}/${teamId}`,
  getStandings: `${TEAMS_URL}/standings`,
  getStandingsByGroup: `${TEAMS_URL}/standings_by_group`,
  uploadPhoto: `${TEAMS_URL}/upload_photo`,
  getPhoto: (fileName) => `${TEAMS_URL}/photo/${fileName}`,
};

const useGetTeams = () => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getTeams = useCallback(() => {
    fetchData("GET", teamEndpoints.getAll);
  }, [fetchData]);
  
  return { data, error, loading, getTeams };
};

const useGetTeamById = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getTeamById = (teamId) =>
    fetchData("GET", teamEndpoints.getById(teamId));

  return { data, error, loading, getTeamById };
};

const useCreateTeam = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const createTeam = (body) => fetchData("POST", teamEndpoints.create, body);

  return { data, error, loading, createTeam };
};

const useUpdateTeam = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const updateTeam = (teamId, body) =>
    fetchData("PATCH", teamEndpoints.update(teamId), body);

  return { data, error, loading, updateTeam };
};

const useDeleteTeam = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const deleteTeam = (teamId) =>
    fetchData("DELETE", teamEndpoints.delete(teamId));

  return { data, error, loading, deleteTeam };
};

const useGetTeamStandings = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getTeamStandings = () => fetchData("GET", teamEndpoints.getStandings);

  return { data, error, loading, getTeamStandings };
};

const useGetStandingsByGroup = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getStandingsByGroup = () =>
    fetchData("GET", teamEndpoints.getStandingsByGroup);

  return { data, error, loading, getStandingsByGroup };
};

export {
  useGetTeams,
  useGetTeamById,
  useCreateTeam,
  useUpdateTeam,
  useDeleteTeam,
  useGetTeamStandings,
  useGetStandingsByGroup,
};
