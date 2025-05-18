import axiosInstance from "@/api/axiosInstance";
import type {  ContestInfo ,  ScoreboardRow } from "@/types"
/** 1. Fetch contest metadata */
export async function fetchContest(cid: string): Promise<any> {
  const { data } = await axiosInstance.get<ContestInfo>(`/contests/${cid}`);
  return data;
}

/**
 * Fetch the frozen (public) scoreboard state
 * @param cid  contest ID
 * @returns    array of ScoreboardRow
 */
export async function fetchBefore(cid: string): Promise<ScoreboardRow[]> {
  const { data } = await axiosInstance.get<ScoreboardRow[]>(
    `/contests/${cid}/scoreboard?public=true`
  )
  return data
}

/**
 * Fetch the un‐frozen (full) scoreboard state
 * @param cid  contest ID
 * @returns    array of ScoreboardRow
 */
export async function fetchAfter(cid: string): Promise<ScoreboardRow[]> {
  const { data } = await axiosInstance.get<ScoreboardRow[]>(
    `/contests/${cid}/scoreboard?public=false`
  )
  return data
}

/**
 */
export async function fetchTeams(cid: string): Promise<any> {
  const { data } = await axiosInstance.get<any>(
    `/contests/${cid}/teams`
  )
  return data
}

/**
 */
export async function fetchProblems(cid: string): Promise<any> {
  const { data } = await axiosInstance.get<any>(
    `/contests/${cid}/problems`
  )
  return data
}

/** 🧩 Example usage in your React component or wherever */
export async function loadContestData(cid: string) {
  const contestApi = await fetchContest(cid);
  const beforeApi    = await fetchBefore(cid);
  const afterApi   = await fetchAfter(cid);
  const teamsApi   = await fetchTeams(cid);
  const problemsApi   = await fetchProblems(cid);
  return { contestApi , beforeApi, afterApi , teamsApi , problemsApi};
}

