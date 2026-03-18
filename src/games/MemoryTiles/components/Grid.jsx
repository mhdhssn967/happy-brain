import Tile from "./Tile";

export default function Grid({ tiles, phase, size, activeTiles, handleClick }) {
  return (
    <div 
      className="grid gap-3 h-full w-full"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
    >
      {tiles.map(tile => (
        <Tile
          key={tile.id}
          tile={tile}
          phase={phase}
          isMemorizePhase={phase === "memorize"}
          isActive={activeTiles.includes(tile.id)}
          onClick={() => handleClick(tile.id)}
        />
      ))}
    </div>
  );
}