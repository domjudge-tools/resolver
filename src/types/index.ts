export interface ContestInfo {
  id: string;
  external_id: string;
  name: string;
  shortname: string;
  formal_name: string;
  scoreboard_type: string;
  start_time: string; // ISO date-time, e.g. "2025-05-08T16:00:00+03:30"
  end_time: string; // ISO date-time
  duration: string; // e.g. "1:00:00.000"
  scoreboard_freeze_duration: string | null; // e.g. "0:30:00.000"
  scoreboard_thaw_time: string | null; // ISO date-time or null
  allow_submit: boolean;
  runtime_as_score_tiebreaker: boolean;
  warning_message: string | null;
  penalty_time: number; // in minutes per wrong submission
  external_details?: Record<string, any>; // extendable
}

export interface ProblemInfo {
  label: string;
  problem_id: string;
  num_judged: number;
  num_pending: number;
  solved: boolean;
  time: number;
  first_to_solve: boolean;
}

/** One row of the public scoreboard */
export interface ScoreboardRow {
  rank: number | null;
  team_id: string;
  score: {
    num_solved: number;
    total_time: number;
  };
  problems: ProblemInfo[];
}

export interface ScoreboardData {
  contest: ContestInfo;
  rows: ScoreboardRow[];
}
