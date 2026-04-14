import React from "react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
} from "@/context/components/ui/sidebar";
import { FaRegAddressBook } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import { HiLogout } from "react-icons/hi";

interface TopicData {
  $id: string;
  semester: string;
}

interface AppSidebarProps {
  topics: TopicData[];
  activeTopicId?: string | null;
  onTopicSelect: (topicId: string) => void;
  onLogout?: () => void;
  isLogoutPending?: boolean;
  isAdmin?: boolean;
}

const Sidebar = ({
  topics,
  activeTopicId,
  onTopicSelect,
  onLogout,
  isLogoutPending,
  isAdmin = false,
}: AppSidebarProps) => {
  return (
    <ShadcnSidebar
      collapsible="icon"
      className="z-40 border-r border-outline-variant/15 bg-neutral-50/60 dark:bg-neutral-950/60 backdrop-blur-2xl"
    >
      <SidebarHeader className="flex items-center h-20 w-full max-w-screen-2xl mx-auto gap-2 md:gap-4 text-xl md:text-2xl font-black tracking-tighter text-neutral-900 dark:text-neutral-50 uppercase">
        UMG
      </SidebarHeader>
      <SidebarContent className="px-0">
        <SidebarGroup>
          <SidebarMenu className="flex flex-col gap-2">
            {topics.map((topic) => (
              <SidebarMenuItem key={topic.$id}>
                <SidebarMenuButton
                  asChild
                  tooltip={topic.semester}
                  isActive={activeTopicId === topic.$id}
                  className={`flex items-center w-full p-3 rounded-lg font-bold transition-all duration-300 cursor-pointer h-auto ${
                    activeTopicId === topic.$id
                      ? "bg-primary text-white hover:bg-primary/90 hover:text-white"
                      : "bg-neutral-200/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-50 hover:bg-neutral-300/50 dark:hover:bg-neutral-700/50"
                  }`}
                >
                  <button onClick={() => onTopicSelect(topic.$id)}>
                    <span className="flex items-center justify-center">
                      <FaRegAddressBook size={18} />
                    </span>
                    <span className="font-inter text-sm font-medium tracking-wide uppercase group-data-[collapsible=icon]:hidden">
                      {topic.semester}
                    </span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-4">
        {/* Solo mostramos el botón de "New Course" si es administrador */}
        {isAdmin && (
          <>
            <div className="group-data-[collapsible=icon]:hidden w-full">
              <button className="w-full bg-primary text-white py-3 px-4 rounded-md font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors">
                New Course
              </button>
            </div>
            <div className="hidden group-data-[collapsible=icon]:flex w-full justify-center">
              <button
                className="bg-primary text-white p-2 rounded-md font-bold hover:bg-primary/90 transition-colors"
                title="New Course"
              >
                <IoIosAdd size={20} />
              </button>
            </div>
          </>
        )}

        {/* Solo mostramos el botón de Logout si se pasa la función por props */}
        {onLogout && (
          <div className="flex flex-col space-y-1">
            <SidebarMenuButton
              asChild
              tooltip="Cerrar Sesión"
              className="flex items-center w-full p-3 h-auto text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-all ease-in-out rounded-lg cursor-pointer"
            >
              <button onClick={onLogout} disabled={isLogoutPending}>
                <span className="flex items-center justify-center">
                  <HiLogout size={18} />
                </span>
                <span className="font-inter text-sm font-medium tracking-wide uppercase group-data-[collapsible=icon]:hidden">
                  {isLogoutPending ? "Cerrando" : "Cerrar Sesión"}
                </span>
              </button>
            </SidebarMenuButton>
          </div>
        )}
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
