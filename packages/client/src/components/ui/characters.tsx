export default function UserCharacters({
  firstName,
  lastName,
  color,
}: {
  firstName: string;
  lastName: string;
  color?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center font-semibold w-10 h-10 rounded-full ${color ? color : "text-blue-700  bg-blue-100"}`}
    >
      <p>{firstName[0]}</p>
      <p>{lastName[0]}</p>
    </div>
  );
}
