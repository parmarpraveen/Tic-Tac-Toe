

function Playertag({ playerName,turn, role }) {
  return (
    <div className={`text-xl rounded-bl-full rounded-tr-full bg-gray-800 w-32 flex items-center justify-center`+ (turn ? ' border-4 border-white animate-pulse' : '')}>
        <label htmlFor="">{playerName}</label>
        <span className={`ml-2 text-sm ${role === "X" ? "text-blue-400" : "text-red-400"}`}>
          {role}
        </span>
    </div>
  )
}

export default Playertag