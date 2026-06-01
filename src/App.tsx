import { useEffect, useState } from 'react';
import { onValue, ref, set } from 'firebase/database';
import { database } from './services/firebaseConfig';
import Calculator from './components/Calculator';
import type { Team } from './types/game';
import './App.css';

export default function App() {
  const [ roomCode, setRoomCode ] = useState("");
  const [ team, setTeam ] = useState<Team | null>(null);
  const [ isJoined, setIsJoined ] = useState(false);

  const [ gameStatus, setGameStatus ] = useState<string>("playing");
  const [ winner, setWinner ] = useState<Team | null>(null);

  const handleJoin = () => {
    if (roomCode.length === 4 && team) {
      setIsJoined(true);
    } else {
      alert("Ingresa un código de 4 dígitos y selecciona un equipo.");
    }
  };

  const handleLeave = () => {
    setIsJoined(false);
    setGameStatus("playing");
    setWinner(null);
  }

  const handleAnswerSubmit = (team: Team, value: number) => {
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
        if (data.status) setGameStatus(data.status);
        if (data.winner) setWinner(data.winner);
      }
    });

    return () => unsuscribe();
  },[isJoined, roomCode]);

  if (!isJoined) {
    return (
      <div className='screen-card'>
        <h1>Control de Mando</h1>
        <div className='input-group'>
          <label>Código de la Sala:</label>
          <input 
            type="text"
            maxLength={4}
            value={roomCode}
            onChange={ (e) => setRoomCode(e.target.value) }
            placeholder="Ej: 4829"
            className='room-code'
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

  if (gameStatus === "finished") {
    const amIWinner = team === winner

    return (
      <div className={`screen-card end-game-screen ${amIWinner ? "victory" : "defeat"}`}>
        {amIWinner ? (
          <div className="result-content">
            <h2>¡VICTORIA!</h2>
            <p>¡Excelente! Tu equipo ganó el tira y afloja matemático.</p>
          </div>
        ) : (
          <div className="result-content">
            <h2>¡Buen intento!</h2>
            <p>El otro equipo fue más rápido esta vez. ¡A por la revancha!</p>
          </div>
        )}
        
        <button className='exit-btn-large' onClick={ handleLeave }>
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className='screen-card'>
      <div className='header'>
        <p>Sala <strong>{roomCode}</strong></p>
        <button className='exit-buttons' onClick={ () => handleLeave() }>Salir</button>
      </div>

      <Calculator 
        team={team!}
        onSubmit={handleAnswerSubmit}
        disabled={false}
      />
      
    </div>
  )

}