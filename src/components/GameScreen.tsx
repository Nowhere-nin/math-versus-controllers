import type { Team } from "../types/game";
import Calculator from "./Calculator";

interface Props {
    roomCode: string;
    handleLeave: () => void;
    team: Team | null;
    handleAnswerSubmit: (team: Team, value: number) => void;
}

export const GameScreen = ({ roomCode, handleLeave, team, handleAnswerSubmit} : Props) => {
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
