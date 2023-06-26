import getUsers from "../actions/getUsers";
import Sidebar from "../components/Sidebar/Sidebar";
import UsersList from "./components/UsersList";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();
  return (
    <Sidebar>
      <div className="h-full">
        <UsersList items={users} />
        {children}
      </div>
    </Sidebar>
  );
}
