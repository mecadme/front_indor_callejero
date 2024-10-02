import useAPI from "../../hooks/useApi";

const TEAMS_URL = "/teams";

const teamEndpoints = {
  getAll: TEAMS_URL,
  getById: (teamId) => `${TEAMS_URL}/${teamId}`,
  create: TEAMS_URL,
  update: (teamId) => `${TEAMS_URL}/${teamId}`,
  delete: (teamId) => `${TEAMS_URL}/${teamId}`,
  getStandings: `${TEAMS_URL}/standings`,
  getStandingsByGroup: `${TEAMS_URL}/standings_by_group`,
};

const getTeams = () => useAPI("public", teamEndpoints.getAll, GET);

const getTeamById = (teamId) =>
  useAPI("private", teamEndpoints.getById(teamId), GET);

const createTeam = (body) =>
  useAPI("private", teamEndpoints.create, POST, body);

const updateTeam = (teamId, body) =>
  useAPI("private", teamEndpoints.update(teamId), PATCH, body);

const deleteTeam = (teamId) =>
  useAPI("private", teamEndpoints.delete(teamId), DELETE);

const uploadTeamPhoto = (teamId, file) =>
  useAPI("private", teamEndpoints.uploadPhoto, PUT, { teamId, file });

const getTeamPhoto = (fileName) =>
  useAPI("public", teamEndpoints.getPhoto(fileName), GET);

const getTeamStandings = () =>
  useAPI("private", teamEndpoints.getStandings, GET);

const getStandingsByGroup = () =>
  useAPI("private", teamEndpoints.getStandingsByGroup, GET);

export {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  uploadTeamPhoto,
  getTeamPhoto,
  getTeamStandings,
  getStandingsByGroup,
};
