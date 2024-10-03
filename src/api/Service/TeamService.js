import useAPI from "../../hooks/useAPI";

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

  const getTeams = () => fetchData("GET", teamEndpoints.getAll);

  return { data, error, loading, getTeams };
};

const useGetTeamById = (teamId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getTeamById = () => fetchData("GET", teamEndpoints.getById(teamId));

  return { data, error, loading, getTeamById };
};

const useCreateTeam = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const createTeam = (body) => fetchData("POST", teamEndpoints.create, body);

  return { data, error, loading, createTeam };
};

const useUpdateTeam = (teamId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const updateTeam = (body) =>
    fetchData("PATCH", teamEndpoints.update(teamId), body);

  return { data, error, loading, updateTeam };
};

const useDeleteTeam = (teamId) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const deleteTeam = () => fetchData("DELETE", teamEndpoints.delete(teamId));

  return { data, error, loading, deleteTeam };
};

const useUploadTeamPhoto = (teamId, file) => {
  const { data, error, loading, fetchData } = useAPI("private");

  const uploadTeamPhoto = () =>
    fetchData("PUT", teamEndpoints.uploadPhoto, { teamId, file });

  return { data, error, loading, uploadTeamPhoto };
};

const useGetTeamPhoto = (fileName) => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getTeamPhoto = () => fetchData("GET", teamEndpoints.getPhoto(fileName));

  return { data, error, loading, getTeamPhoto };
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
  useUploadTeamPhoto,
  useGetTeamPhoto,
  useGetTeamStandings,
  useGetStandingsByGroup,
};
