import useAPI from "../../hooks/useAPI";

const WEEKLY_AWARD_URL = "/weekly-awards";

const weeklyAwardEndpoints = {
  getAll: `${WEEKLY_AWARD_URL}/allAwards`,
  create: WEEKLY_AWARD_URL,
  update: (weeklyAwardsId) => `${WEEKLY_AWARD_URL}/${weeklyAwardsId}`,
  delete: (weeklyAwardsId) => `${WEEKLY_AWARD_URL}?weeklyAwardsId=${weeklyAwardsId}`,
  getAwardInfo: (entityId, awardType) => `${WEEKLY_AWARD_URL}/award-info?entityId=${entityId}&awardType=${awardType}`,
};

const useGetWeeklyAwardsByDate = (date) => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getWeeklyAwardsByDate = () => 
    fetchData("GET", `${WEEKLY_AWARD_URL}?date=${date}`);

  return { data, error, loading, getWeeklyAwardsByDate };
};

const useGetAllWeeklyAwards = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const getAllWeeklyAwards = () => 
    fetchData("GET", weeklyAwardEndpoints.getAll);

  return { data, error, loading, getAllWeeklyAwards };
}

const useCreateWeeklyAwards = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const createWeeklyAwards = (body) => 
    fetchData("POST", weeklyAwardEndpoints.create, body);

  return { data, error, loading, createWeeklyAwards };
};

const useUpdateWeeklyAwards = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const updateWeeklyAwards = (weeklyAwardsId, body) => 
    fetchData("PUT", weeklyAwardEndpoints.update(weeklyAwardsId), body);

  return { data, error, loading, updateWeeklyAwards };
};

const useDeleteWeeklyAwards = () => {
  const { data, error, loading, fetchData } = useAPI("private");

  const deleteWeeklyAwards = (weeklyAwardsId) => 
    fetchData("DELETE", weeklyAwardEndpoints.delete(weeklyAwardsId));

  return { data, error, loading, deleteWeeklyAwards };
};

const useGetAwardInfo = (entityId, awardType) => {
  const { data, error, loading, fetchData } = useAPI("public");

  const getAwardInfo = () => 
    fetchData("GET", weeklyAwardEndpoints.getAwardInfo(entityId, awardType));

  return { data, error, loading, getAwardInfo };
};

export {
  useGetWeeklyAwardsByDate,
  useGetAllWeeklyAwards,
  useCreateWeeklyAwards,
  useUpdateWeeklyAwards,
  useDeleteWeeklyAwards,
  useGetAwardInfo,
};
