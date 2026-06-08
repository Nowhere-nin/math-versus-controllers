import type { Team } from "../types/game";


interface Props {
    roomCode: string;
    setRoomCode: (value: string) => void;
    team: Team | null;
    setTeam: (value: Team) => void;
    setIsJoined: (value: boolean) => void;
}

export const StartScreen = ({ roomCode, setRoomCode, team, setTeam, setIsJoined} : Props) => {

    const handleJoin = () => {
    if (roomCode.length === 4 && team) {
      setIsJoined(true);
    } else {
      alert("Ingresa un código de 4 dígitos y selecciona un equipo.");
    }
  };


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
}
