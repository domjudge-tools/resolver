import Scoreboard from "@/components/scoreboard";

function App() {
  const api_cid = import.meta.env.VITE_API_CID;
  return (
    <main className="min-h-screen scroll-smooth">
      <img
        src="/home.png"
        className="w-auto mx-auto h-[20rem] p-4 object-contain"
      />
      <Scoreboard contestId={api_cid} />
    </main>
  );
}

export default App;
