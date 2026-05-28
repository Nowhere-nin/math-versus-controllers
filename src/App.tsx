import { useState } from 'react';
import { ref, set } from 'firebase/database';
import { database } from './services/firebaseConfig';
import Calculator from './components/Calculator';
import type { Team } from './types/game';
import './App.css';

export default function App() {
  const [ roomCode, setRoomCode ] = useState("");
  const [ team, setTeam ] = useState<Team | null>(null);
  const [ isJoined, setIsJoined ] = useState(false);

  const handleJoin = () => {
    if (roomCode.length === 4 && team) {
      setIsJoined(true);
    } else {
      alert("Ingresa un código de 4 dígitos y selecciona un equipo.");
    }
  };

  const handleAnswerSubmit = (team: Team, value: number) => {
    const answerRef = ref(database, `rooms/${roomCode}/lastAnswer`);

    set(answerRef, {
      team,
      value,
      timestamp: Date.now()
    });
  };

  if (!isJoined) {
    return (
      <div className='login-container'>
        <h1>Control de Mando</h1>
        <div className='input-group'>
          <label>Código de la Sala:</label>
          <input 
            type="text"
            maxLength={4}
            value={roomCode}
            onChange={ (e) => setRoomCode(e.target.value) }
            placeholder="Ej: 4829"
          />
        </div>

        <div className='team-selection'>
          <h3>¿Qué equipo eres?</h3>
          <button
            className={ team === "A" ? "selected blue" : ""}
            onClick={ () => setTeam("A")}
          >
            Equipo Azul
          </button>
          <button
            className={ team === "B" ? "selected red" : ""}
            onClick={ () => setTeam("B")}
          >
            Equipo Rojo
          </button>
        </div>

        <button
          className='join-btn' onClick={ handleJoin }
        >
          Entrar al juego
        </button>
      </div>
    );
  };

  return (
    <div>
      <div>
        <p></p>
        <button></button>
      </div>

      <Calculator 
        team={team!}
        onSubmit={handleAnswerSubmit}
        disabled={false}
      />
      
    </div>
  )

}