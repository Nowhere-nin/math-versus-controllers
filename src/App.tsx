import { useEffect, useState } from 'react';
import { onValue, ref, set } from 'firebase/database';
import { database } from './services/firebaseConfig';
import type { Team } from './types/game';
import './App.css';
import { StartScreen } from './components/StartScreen';
import { FinishScreen } from './components/FinishScreen';
import { GameScreen } from './components/GameScreen';

export default function App() {
  const [ roomCode, setRoomCode ] = useState("");
  const [ team, setTeam ] = useState<Team | null>(null);
  const [ isJoined, setIsJoined ] = useState(false);

  const [ gameStatus, setGameStatus ] = useState<string>("playing");
  const [ winner, setWinner ] = useState<Team | null>(null);

  const handleLeave = () => {
    setIsJoined(false);
    setGameStatus("playing");
    setWinner(null);
    setTeam(null);
  }

  const handleAnswerSubmit = (team: Team, value: number) => {
    if (!roomCode) return;

    const answerRef = ref(database, `rooms/${roomCode}/lastAnswer`);

    set(answerRef, {
      team,
      value,
      timestamp: Date.now()
    });
  };

  useEffect( () => {
    if (!isJoined || !roomCode) return; 
    const roomRef = ref(database, `rooms/${roomCode}`);

    const unsuscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameStatus(data.status || "playing");
        setWinner(data.winner || null);
      }
    });

    return () => unsuscribe();
  },[isJoined, roomCode]);

  if (!isJoined) {
    return (
      <StartScreen 
        roomCode={roomCode}
        setRoomCode={setRoomCode}
        team={team}
        setTeam={setTeam}
        setIsJoined={setIsJoined}
      />
    );
  };

  if (gameStatus === "finished") {
    const amIWinner = team === winner

    return (
      <FinishScreen
        amIWinner={amIWinner}
        handleLeave={handleLeave}
      />
    );
  }

  return (
    <GameScreen
      roomCode={roomCode}
      handleLeave={handleLeave}
      team={team}
      handleAnswerSubmit={handleAnswerSubmit}      
    />
  )

}