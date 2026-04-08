import { useParams } from "react-router-dom"
import MemoryTiles from "../../games/MemoryTiles/MemoryTiles"
import MathGame from "../../games/MathGame/MathGame"
import SequenceRecall from "../../games/SequenceRecall/SequenceRecall"
import ATMPinRecall from "../../games/ATMPinRecall/ATMPinRecall"
import ColorTapGame from "../../games/ColorTapGame/ColorTapGame"

export default function GameLauncher() {
  const { gameId } = useParams()

  if (gameId === "memory-tiles") {
    return <MemoryTiles />
  }
  if (gameId === "math-game") {
    return <MathGame />
  }
  if (gameId === "sequence-recall") {
    return <SequenceRecall />
  }
  if (gameId === "atm-pin-recall") {
    return <ATMPinRecall />
  }
  if (gameId === "color-tap-game") {
    return <ColorTapGame />
  }



  return <div>Game not found</div>
}