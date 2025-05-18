import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { loadContestData } from '@/components/data.ts'
import type { ScoreboardData, ScoreboardRow, ProblemInfo } from '../types'

interface ScoreboardProps {
  contestId: string | number
}

export function sortAndRankTeams(teams: ScoreboardRow[]): ScoreboardRow[] {
  teams.sort((a, b) => {
    if (b.score.num_solved !== a.score.num_solved) {
      return b.score.num_solved - a.score.num_solved;
    }
    return a.score.total_time - b.score.total_time;
  });

  teams.forEach((team, idx) => {
    team.rank = idx + 1;
  });

  return teams;
}

export default function Scoreboard({ contestId }: ScoreboardProps) {
  const [after, setAfter] = useState<ScoreboardData | null>(null);
  const [result, setResult] = useState<ScoreboardRow[] | null>(null);
  const [teams , setTeams] = useState(null)
  const [problems , setProblems] = useState(null)
  const [loading , setLoading] = useState(true)

  useEffect(() => {
    loadContestData(contestId).then((data: any) => {
      setResult(sortAndRankTeams(data.beforeApi.rows));
      setAfter(data.afterApi);
      setTeams(data.teamsApi)
      setProblems(data.problemsApi)
    }).finally(()=> {
setLoading(false)
})
  }, []);

  const update = (prId: string, teamId: string) => {
    if (!after) return;

    const updatedTeam = after.rows.find(t => t.team_id === teamId);
    if (!updatedTeam) return console.warn(`No team ${teamId} in after.rows`);

    const problemAfter = updatedTeam.problems.find(p => p.problem_id === prId);
    if (!problemAfter) return;

    const newResult = result!.map(team => {
      if (team.team_id !== teamId) return team;

      const existingProblem = team.problems.find(p => p.problem_id === prId);
      const updatedProblems = team.problems.map(p =>
        p.problem_id === prId ? problemAfter : p
      );
      return {
        ...team,
        problems: updatedProblems,
        score: {
          total_time: team.score.total_time + (problemAfter.solved && existingProblem && !existingProblem.solved ? problemAfter.time : 0),
          num_solved: team.score.num_solved + (problemAfter.solved && existingProblem && !existingProblem.solved ? 1 : 0),
        },
      };
    });
    setResult(sortAndRankTeams(newResult));
  };

  const getCellColor = (pr: ProblemInfo) => {
    if (pr.solved) return 'bg-green-400';
    if (pr.num_judged > 0) return 'bg-red-300';
    return 'bg-gray-100';
  };

const getNameTeam = (team_id : number | string)=> { 
const team = teams?.find((tm:any) => tm.id == team_id || tm.lable == team_id);
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
      <h2 className="text-xl font-bold mb-4">BCPC</h2>
      <div className="overflow-auto">
        <div className="min-w-[1024px]">
          <div className="grid grid-cols-[50px_1fr_80px_80px_1fr_80px] font-bold bg-blue-700 text-white p-2 rounded-t">
            <div>Rank</div>
            <div>Name</div>
            <div>Solved</div>
            <div>Time</div>
<div
style={{
gridTemplateColumns : `repeat(${problems?.length || 4},1fr)`
}}
className={`grid   items-center gap-5  justify-start min-w-[30px]`}>
            {Array.from({ length: problems?.length  || 10 }, (_, i) => (
              <div key={i} className="text-center min-w-[30px] p-1">{String.fromCharCode(65 + i)}</div>
            ))}
</div>
            <div>Solv Attm</div>
          </div>

          <AnimatePresence>
            {!loading  &&
              result?.map((team, index) => (
                <motion.div
                  key={team.team_id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  className={`grid  odd:[&>.group-cell>.cell]:shadow grid-cols-[50px_1fr_80px_80px_1fr_80px] p-2 ${
                    index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                  }`}
                >
                  <div>{team.rank}</div>
                  <div className="flex flex-col">
                    <span>{getNameTeam(team.team_id)}</span>
                    <span className="text-sm min-h-[1rem] text-gray-500">{getUniTeam(team.team_id)}</span>
                  </div>
                  <div className="text-center">{team.score.num_solved}</div>
                  <div className="text-center">{team.score.total_time}</div>
<div
style={{
gridTemplateColumns : `repeat(${problems?.length || 4},1fr)`
}}
className="grid  gap-5 justify-start group-cell">
                  {team.problems.map(pr => (
                    <div
                      key={pr.problem_id}
                      onClick={() => update(pr.problem_id, team.team_id)}
                      className={`text-center cell text-xs cursor-pointer  rounded ${getCellColor(pr)} p-1`}
                    >
                      {pr.solved ? `${pr.time}` : '0'}
                      <div className="text-[10px]">
                        {pr.num_judged > 0 ? `${pr.num_judged} ${pr.num_judged === 1 ? 'try' : 'tries'}` : '-'}
                      </div>
                    </div>
                  ))}
</div>
                  <div className="text-center">
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

