
interface Props {
    amIWinner: boolean;
    handleLeave: () => void;
}

export const FinishScreen = ({ amIWinner, handleLeave} : Props) => {
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
  )
}
