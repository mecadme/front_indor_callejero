import useAPI from "../../hooks/useApi";

const WEEKLY_AWARD_URL = "/weekly-awards";

const weeklyAwardEndpoints = {
  getAll: WEEKLY_AWARD_URL,
  create: WEEKLY_AWARD_URL,
  update: (weeklyAwardsId) => `${WEEKLY_AWARD_URL}/${weeklyAwardsId}`,
  delete: (weeklyAwardsId) => `${WEEKLY_AWARD_URL}?weeklyAwardsId=${weeklyAwardsId}`,
  getAwardInfo: (entityId, awardType) => `${WEEKLY_AWARD_URL}/award-info?entityId=${entityId}&awardType=${awardType}`,
};

const getWeeklyAwardsByDate = (date) => 
  useAPI("public", `${WEEKLY_AWARD_URL}?date=${date}`, "GET");

const createWeeklyAwards = (body) => 
  useAPI("private", weeklyAwardEndpoints.create, "POST", body);

const updateWeeklyAwards = (weeklyAwardsId, body) => 
  useAPI("private", weeklyAwardEndpoints.update(weeklyAwardsId), "PUT", body);

const deleteWeeklyAwards = (weeklyAwardsId) => 
  useAPI("private", weeklyAwardEndpoints.delete(weeklyAwardsId), "DELETE");

const getAwardInfo = (entityId, awardType) => 
  useAPI("public", weeklyAwardEndpoints.getAwardInfo(entityId, awardType), "GET");

export {
  getWeeklyAwardsByDate,
  createWeeklyAwards,
  updateWeeklyAwards,
  deleteWeeklyAwards,
  getAwardInfo,
};
