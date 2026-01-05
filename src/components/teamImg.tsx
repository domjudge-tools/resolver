import { fetchTeamImg } from "./data"
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const TeamImg =  ({teamPopup , setDefault} : {teamPopup : {state : boolean ,id : string} , setDefault :() => void}) => {
  if (!teamPopup.state || !teamPopup.id) return null;

  const query = useQuery({ queryKey: [teamPopup.id], queryFn: () => fetchTeamImg(teamPopup.id) })

  if (query.error) return setDefault();

    if (query.data){
        console.log(query.data)
        const src = URL.createObjectURL(query.data)
          return (<>
            <div 
             className="fixed inset-0 bg-black-/60 z-100 top-50 left-50 popup w-[80rem] h-max object-contain rounded-2xl overflow-hidden">
             {
        query.isPending &&  <div>Pending...!</div> || 
        query.isError &&  <img src="/home.png" alt="team" /> ||
        query.data && <img src={src} alt="fallback" />
             }
            </div>
            </>)
    }
  }


export default TeamImg
