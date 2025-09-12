import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "../ui/input";
import MultipleSelector from "../multiple-select";
import type { Option } from "../multiple-select";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
}

function GroupChatContainer() {
  const [selectedUsers, setSelectedUsers] = useState<Option[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [createChannelLoading, setCreateChannelLoading] =
    useState<boolean>(false);
  const [fetchingGroupsLoading, setFetchingGroupsLoading] =
    useState<boolean>(false);
  const [user] = useAuthState(auth);

  const { addGroup, groups, setGroups, setSelectedChatData, selectedChatData } =
    useAppStore();

  async function createGroup() {
    if (!user) return;
    const token = await user?.getIdToken();
    if (selectedUsers.length === 0) {
      toast("Please select at least one user to create a group");
      return;
    }
    if (groupName.trim() === "") {
      toast("Please provide a group name");
      return;
    }
    setCreateChannelLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/groupChat/add`,
        {
          name: groupName,
          members: selectedUsers.map((user) => user.value),
          photoUrl:
            "https://res.cloudinary.com/dqobuxkcj/image/upload/v1750107060/k5jelf6gijej6kx64c9j.jpg",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Group created successfully:", response.data);
      addGroup(response.data.data);
      setOpenDialog(false);
      setSelectedUsers([]);
      setGroupName("");
      setCreateChannelLoading(false);
      toast("Group created successfully!");
    } catch (error) {
      setCreateChannelLoading(false);
      console.error("Error creating group:", error);
      toast("Failed to create group. Please try again.");
    }
  }

  useEffect(() => {
    const getUserGroups = async () => {
      if (!user) return;
      const token = await user?.getIdToken();
      setFetchingGroupsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/groupChat/get-user-groups`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.data) {
        console.log("User groups retrieved successfully:", response.data);
        setGroups(response.data.data.map((group: GroupMember) => group.group));
        setFetchingGroupsLoading(false);
      } else {
        console.error("Error retrieving user groups:", response.data);
        toast("Failed to retrieve user groups. Please try again.");
        setFetchingGroupsLoading(false);
      }
    };
    getUserGroups();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      const token = await user?.getIdToken();
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllUsers(response.data.data);
    };
    fetchUsers();
  }, [user]);


  return (
    <div className="bg-white h-full md:w-[30vw] lg:w-[24vw] xl:w-[20vw] rounded-lg md:rounded-none   md:rounded-l-lg w-full">
      <div className="flex items-center justify-center  border-b border-gray-300 h-[10vh]">
        <h1 className="text-2xl font-semibold font-serif">
          <span className="text-4xl text-primary">X</span>plorer Chat
        </h1>
      </div>
      <ScrollArea>
        <div className="p-4 ">
          <Button
            className="w-full cursor-pointer"
            onClick={() => setOpenDialog(true)}
          >
            Create a new Group
          </Button>
        </div>
        {groups.length > 0 ? (
          <div className="flex flex-col">
            {groups.map((group) => (
              <div key={group.id} className="sm:px-2 md:py-0.5">
                <div
                  
                  className={`flex rounded-lg cursor-pointer p-2 px-3 gap-2 items-center   transition-all duration-200 ${
                    selectedChatData?.id === group.id
                      ? "md:bg-gray-100 "
                      : "bg-white hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedChatData(group);
                  }}
                >
                  <Image
                    src={
                      group.photoUrl ||
                      "https://res.cloudinary.com/dqobuxkcj/image/upload/v1750107060/k5jelf6gijej6kx64c9j.jpg"
                    }
                    height={60}
                    width={42}
                    className="rounded-full object-cover sm:h-12 sm:w-12 h-10 w-10"
                    alt="profile pic"
                  />
                  <div>
                    <h1 className="text-lg sm:text-xl font-semibold">{group.name}</h1>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : fetchingGroupsLoading ? (
          <p className="text-center text-lg leading-10 text-gray-600">
            Loading Groups...
          </p>
        ) : (
          <p className="text-center text-lg leading-10 text-gray-600">
            No Groups found
          </p>
        )}
      </ScrollArea>
      <Dialog
        open={openDialog}
        onOpenChange={() => {
          setOpenDialog(false);
          setSelectedUsers([]);
          setGroupName("");
        }}
      >
        <DialogContent className="border-none w-[400px] h-[400px] flex flex-col ">
          <DialogHeader>
            <DialogTitle className="font-semibold text-center text-2xl">
              Select Travellers
            </DialogTitle>
          </DialogHeader>
          <div>
            <Input
              placeholder="Group Name"
              onChange={(e) => setGroupName(e.target.value)}
              value={groupName}
            />
          </div>

          <div>
            <MultipleSelector
              className="rounded-lg py-2 "
              defaultOptions={allUsers.map((user) => ({
                label: user.name,
                value: user.id,
                image: user.photoUrl,
              }))}
              onChange={setSelectedUsers}
              placeholder="Select Travellers"
              value={selectedUsers}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">
                  No Users found
                </p>
              }
            />
          </div>
          <div>
            <Button
              onClick={createGroup}
              className="w-full hover:bg-[#e21a35] transition-all duration-300 cursor-pointer"
              disabled={createChannelLoading}
            >
              {createChannelLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Create Group"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GroupChatContainer;
