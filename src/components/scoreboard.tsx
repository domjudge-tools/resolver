import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { loadContestData } from '@/components/data.ts'
import type { ScoreboardData, ScoreboardRow, ProblemInfo } from '../types'

interface ScoreboardProps {
  contestId: string | number
}



export function sortAndRankTeams(teams: ScoreboardRow[]): ScoreboardRow[] {
  const firstSolves: Record<string, { time: number, team_id: string | number }> = {};

  // Clear first_to_solve flags and find earliest solves
  teams.forEach(team => {
    team.problems.forEach(problem => {
      problem.first_to_solve = false;
      if (problem.solved) {
        const prev = firstSolves[problem.problem_id];
        if (!prev || problem.time < prev.time) {
          firstSolves[problem.problem_id] = { time: problem.time, team_id: team.team_id };
        }
      }
    });
  });

  // Mark FTS
  teams.forEach(team => {
    team.problems.forEach(problem => {
      if (problem.solved && firstSolves[problem.problem_id]?.team_id === team.team_id) {
        problem.first_to_solve = true;
      }
    });
  });

  // Sort and assign ranks
  teams.sort((a, b) => {
    if (b.score.num_solved !== a.score.num_solved) {
      return b.score.num_solved - a.score.num_solved;
    }
    return a.score.total_time - b.score.total_time;
  });

//  teams.forEach((team, idx) => {
//    team.rank = idx + 1;
//  });

  // set the ranking process
    let lastSolved = -1;
    let lastTime = -1;
    let lastRank = 0;
    let skip = 0;
     teams.map((team, index) => {
      if (team.score.num_solved === lastSolved && team.score.total_time === lastTime) {
        skip++;
        team.rank = null; 
      } else {
        lastRank = index + 1;
        lastSolved = team.score.num_solved;
        lastTime = team.score.total_time;
        lastRank += skip;
        skip = 0;
        return team.rank =  lastRank;
      }
    });

  return teams;
}




export default function Scoreboard({ contestId }: ScoreboardProps) {
  const [before, setBefore] = useState<ScoreboardData | null>(null);
  const [after, setAfter] = useState<ScoreboardData | null>(null);
  const [result, setResult] = useState<ScoreboardRow[] | null>(null);
  const [teams , setTeams] = useState(null)
  const [problems , setProblems] = useState(null)
  const [loading , setLoading] = useState(true)
  const [coolDown , setrCoolDown] = useState(false)
  const [ judgeTypes , setJudgeTypes] = useState([])
  const [ judges , setJudges] = useState([])
  const [ subs , setSubs] = useState([])
  const api_penalty = import.meta.env.VITE_API_PENALTY;


  useEffect(() => {
    loadContestData(contestId).then((data: any) => {
      setResult(sortAndRankTeams(data.beforeApi.rows));
      setBefore(data.beforeApi.rows);
      setAfter(data.afterApi);
      setTeams(data.teamsApi)
      setProblems(data.problemsApi)
      setJudgeTypes(data.judgeTypesApi)
      setJudges(data.judgeApi)
      setSubs(data.subsApi)
    }).finally(()=> {
    setLoading(false)
  })}, []);


  const update = (prId: string, teamId: string, num_pending: number | string) => {
    if (!coolDown && Number(num_pending) > 0) {
      document.getElementById(`team-${teamId}-${prId}`)?.classList.add("active");
      setrCoolDown(true);
      return;
    }

    if (!document.getElementById(`team-${teamId}-${prId}`)?.classList.contains("active")) return;
    if (!after) return;

    const updatedTeam = after.rows.find(t => t.team_id === teamId);
    if (!updatedTeam) return console.warn(`No team ${teamId} in after.rows`);

    const problemAfter = updatedTeam.problems.find(p => p.problem_id === prId);
    if (!problemAfter) return;

        const newResult = result!.map(team => {
          if (team.team_id !== teamId) return team;

          //const existingProblem = team.problems.find(p => p.problem_id === prId);
          const updatedProblems = team.problems.map(p =>
            p.problem_id === prId ? problemAfter : p
          );

          // Recalculate total_time and num_solved for this team
          let newTotalTime = 0;
          let newNumSolved = 0;

          updatedProblems.forEach(p => {
            if (p.solved) {
              const penalty = api_penalty * (p.num_judged - 1);
              newTotalTime += p.time + penalty;
              newNumSolved++;
            }
          });

          return {
            ...team,
            problems: updatedProblems,
            score: {
              total_time: newTotalTime,
              num_solved: newNumSolved,
            },
          };
        });

    setResult(sortAndRankTeams(newResult));
    document.getElementById(`team-${teamId}-${prId}`)?.classList.remove("active");
    setrCoolDown(false);
  };


useEffect(() => {
    const handleKeyDown = (event : any) => {
      if (event.key === 'Escape') {
        console.log('Escape key pressed');
        setrCoolDown(false); // Call your function when Escape is pressed
        document.querySelector(".active")?.classList.remove("active")
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setrCoolDown]);

    const getCellColor = (pr: ProblemInfo , team_id:string) => {
      if (pr.num_pending > 0 ) return 'bg-yellow-300';
      if (pr.solved) return 'bg-green-300';
      if (pr.num_judged > 0) return 'bg-red-400';

          // Handle special case: team had a pending submission in the previous state,
          // but now the judged result has no penalty (e.g., compile error, too late submission, etc.).
          // We still want to highlight it (in light red) because it was previously shown as pending.
      const prIsPend = before
          ?.find((row) => row.team_id == team_id)
          ?.problems?.find(p => p.problem_id == pr.problem_id);

      if (pr.num_judged === 0  && prIsPend.num_pending > 0) {
          const totalSubs = subs?.filter((sub) => sub.team_id == team_id && sub.problem_id == pr.problem_id)
          if (totalSubs.length > 0 ) return 'bg-red-300';
      }

    return 'bg-gray-100';
    };

    const getNameTeam = (team_id : number | string)=> { 
    const team = teams?.find((tm:{id : number  , table : number}) => tm.id == team_id || tm.lable == team_id);
    if (team?.hidden) return
    return team.name
    }

    const getUniTeam = (team_id : number | string)=> { 
    const team = teams?.find((tm:any) => tm.id == team_id || tm.lable == team_id);
    if (team?.hidden) return
    return team.affiliation
  }


  return (
    <div className="p-4 w-full ">
      <div className="overflow-auto">
        <div className="min-w-[1024px]">
          <div className="grid grid-cols-[50px_25rem_80px_80px_1fr_80px] gap-2 text-xl font-bold bg-blue-700 text-white p-2 rounded-t">
            <div className="text-start grid place-items-center">Rank</div>
            <div className="text-start flex items-center ">Name</div>
            <div className="text-center grid place-items-center">Solved</div>
            <div className="text-center grid place-items-center">Time</div>
          
<div
  style={{
    gridTemplateColumns: `repeat(${problems?.length || 4}, 1fr)`
  }}
  className="grid items-center text-white gap-3 justify-center min-w-[30px]"
>
  {problems?.map((problem : any, i : number) => (
    <div key={problem.id} className="relative flex justify-center items-center">
      <div
        className="w-12 h-12 rounded-full  text-black text-xl font-bold flex items-center justify-center shadow"
        style={{ backgroundColor: problem.rgb || '#888' }}
      >
        {problem.label || String.fromCharCode(65 + i)}
      </div>
          </div>
  ))}
</div>

            <div>Solv Attm</div>
          </div>

          <AnimatePresence>
            {!loading  &&
              result?.map((team, index) => (
                <motion.div
                  layout
                  layoutId={`team-row-${team.team_id}`} // unique per team
                  transition={{
  layout: {
    duration: 1.1,
    ease: [0.25, 0.8, 0.25, 1], // ease-in-out
  },
  opacity: {
    duration: 0.3,
  },
}}                key={team.team_id}
                  initial={{ opacity: 0, y : -10 }}
                  animate={{ opacity: 1, y : 0 }}
                  exit={{ opacity: 0, y : 10 }}
                  style={{ zIndex: result.length - index }}
                  className={`team-${team.team_id} gap-2 [&:has(&>*.active)]:z-50 relative grid odd:[&>.group-cell>.cell]:shadow  justify-center grid-cols-[50px_25rem_80px_80px_1fr_80px] p-2 ${
                    index % 2 === 0 ? 'bg-neutral-200' : 'bg-white'
                  }`}
                >
                  <div className="font-bold text-[2rem]">{team.rank}</div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[2rem]">{getNameTeam(team.team_id)}</span>
                    <span className="text-2xl min-h-[1rem] text-gray-500 font-bold">{getUniTeam(team.team_id)}</span>
                  </div>
                  <div className="text-center text-xl self-center font-bold">{team.score.num_solved}</div>
                  <div className="text-center text-xl font-bold self-center">{team.score.total_time}</div>
                <div style={{ gridTemplateColumns : `repeat(${problems?.length || 4},1fr)` }}
                  className="grid  gap-5 justify-start group-cell">
                  {team.problems.map(pr => (
                    <div
                      key={pr.problem_id}
                      onClick={() => {
                          // prevent to not changing the view port
                     const scrollTop = window.scrollY;
                     update(pr.problem_id, team.team_id, pr.num_pending)
                     requestAnimationFrame(() => {
                     window.scrollTo({ top: scrollTop });
              });
                      }}
                      id={`team-${team.team_id}-${pr.problem_id}`}
                      className={`relative grid place-items-center text-center cell font-bold text-xl ${pr.num_pending > 0 ? "cursor-pointer" : ""} transition-all rounded ${getCellColor(pr,team.team_id)} p-1 ${pr.first_to_solve ? "bg-green-800 text-white" : ""}`}
                    >
                      {pr.solved ? `${pr.time}` : '0'}
                      {pr.first_to_solve && (
                        <span className="absolute -top-1 -right-1 text-xl">🎉</span>
                      )}
                      <div className="text-[12px]  flex items-center justify-center gap-1">
                        <span>
                          {pr.num_judged > 0
                            ? `${pr.num_judged} ${pr.num_judged === 1 ? 'try' : 'tries'}`
                            : pr.num_pending > 0
                            ? '0'
                            : '-'}
                        </span>
                        <span>{pr.num_pending > 0 ? `+ ${pr.num_pending}` : ''}</span>
                      </div>
                    </div>

                  ))}
</div>
                  <div className="text-center text-xl grid place-items-center font-bold">
                    {team.score.num_solved} /{' '}
                    {team.problems.reduce((acc, p) => acc + p.num_judged, 0)}
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

