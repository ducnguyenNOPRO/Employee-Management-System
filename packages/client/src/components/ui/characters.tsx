export default function UserCharacters({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  return (
    <div className="flex items-center justify-center text-blue-700 font-semibold w-10 h-10 rounded-full bg-blue-100">
      <p>{firstName[0]}</p>
      <p>{lastName[0]}</p>
    </div>
  );
}
