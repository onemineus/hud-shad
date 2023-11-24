export const Email = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => {
  return (
    <div>
      <div>Welcome, {firstName}!</div>
      <div>Welcome meaw, {lastName}!</div>
    </div>
  );
};
