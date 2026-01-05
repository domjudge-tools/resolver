import type { ScoreboardData, ScoreboardRow, ProblemInfo } from "@/types";

const colorBasedBg = ( bgColor : string) => {
  let r, g, b;
  // ✅ Handle HEX (#fff or #ffffff)
  if (bgColor.startsWith("#")) {
    let hex = bgColor.replace("#", "");
    if (hex.length === 3) {
      hex = hex.split("").map(c => c + c).join("");
    }
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  // ✅ Handle RGB / RGBA
  else if (bgColor.startsWith("rgb")) {
    const rgb = bgColor.match(/\d+/g).map(Number);
    [r, g, b] = rgb;
  }

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
  return luminance > 150 ? "#000000" : "#ffffff";
}

//
const firstSubmit = (teams: ScoreboardRow[]) => {
    const firstSolves: Record<string,{ time: number; team_id: string | number }> = {};
    // Clear first_to_solve flags and find earliest solves
      teams.forEach((team) => {
        team.problems.forEach((problem) => {
          problem.first_to_solve = false;
          if (problem.solved) {
            const prev = firstSolves[problem.problem_id];
            if (!prev || problem.time < prev.time) {
              firstSolves[problem.problem_id] = {
                time: problem.time,
                team_id: team.team_id,
              };
            }
          }
        });
      });

      // Mark FTS
      teams.forEach((team) => {
        team.problems.forEach((problem) => {
          if (
            problem.solved &&
            firstSolves[problem.problem_id]?.team_id === team.team_id
          ) {
            problem.first_to_solve = true;
          }
        });
      });
}



export {colorBasedBg, firstSubmit};
