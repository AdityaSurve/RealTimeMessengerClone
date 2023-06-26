"use client";

import Avatar from "@/app/components/Avatar";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface UserItemProps {
  data: User;
}
const UserItem: React.FC<UserItemProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = useCallback(() => {
    setIsLoading(true);
    axios
      .post("/api/conversations", {
        userID: data.id,
      })
      .then((data) => {
        router.push(`/conversations/${data.data.id}`);
      })
      .finally(() => setIsLoading(false));
  }, [data.id, router]);
  return (
    <div
      onClick={handleClick}
      className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg cursor-pointer transition"
    >
      <Avatar user={data} />
      <div className="min-w-0 flex-1 focus:outline-none">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-medium text-gray-800">{data.name}</p>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
