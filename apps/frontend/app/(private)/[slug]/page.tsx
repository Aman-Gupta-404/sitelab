"use client";

import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useGetProjectStatus } from "@/hooks/useGetProjectStatus";

import ChatPanel from "./components/ChatPanel";
import PreviewPanel from "./components/PreviewPanel";
import { projectsApi } from "@/apis/projects/projects.api";
import ProjectHeader from "@/features/project/components/ProjectHeader";

import { ErrorType, Message, Project } from "@/types/common.types";

function ProjectPage() {
  const params = useParams();

  const [projSlug, setProjSlug] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [fetchingProj, setFetchingProj] = useState(false);
  const [project, setProject] = useState<Project | ErrorType | null>(null);
  const [messageStatus, setMessageStatus] = useState<
    "processing" | "complete" | "error" | "idle"
  >("idle");

  const refetchRef = useRef(0);

  const { status, projectData, error, fetchProjectStatus, closeConnection } =
    useGetProjectStatus();

  const fetchProjectData = async (slug: string, isRefetch = false) => {
    try {
      !isRefetch && setFetchingProj(true);
      const res = await projectsApi.getProject(slug);
      if (res.status == 200) {
        setProject(res.data);
      } else {
        toast.error("Error in Fetching project");
        setProject({ error: true, message: "Error in Fetching project" });
      }
    } catch (error: any) {
      toast.error(error.message ?? "Error in Fetching project");
      setProject({
        error: true,
        message: error.message ?? "Error in Fetching project",
      });
    } finally {
      setFetchingProj(false);
    }
  };

  const fetchProject = (isRefetch = false) => {
    if (params.slug) {
      const slug = params.slug as string;
      setProjSlug(slug);

      // fetch project
      fetchProjectData(slug, isRefetch);

      // Fetch messages
      fetchProjectStatus(slug);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [params]);

  useEffect(() => {
    if (projectData) {
      // setting up the projects
      const { messages, ...project } = projectData;

      setProject(project as Project);
    }
    if (projectData && projectData?.messages?.length) {
      const newMessages = projectData.messages as Message[];

      setMessages((prevMessages) => {
        const map = new Map();

        [...prevMessages, ...newMessages].forEach((msg) => {
          map.set(msg._id, msg);
        });
        return Array.from(map.values());
      });
    }
  }, [projectData, error]);

  useEffect(() => {
    // "idle" | "open" | "closed" | "error" | "processing"
    if (status && ["idle", "processing", "error"].includes(status))
      setMessageStatus(status as "idle" | "processing" | "error");
    else setMessageStatus("complete");
  }, [status]);

  return (
    <section className="h-screen w-screen">
      <ResizablePanelGroup
        className="h-screen w-screen border"
        orientation="horizontal"
      >
        <ResizablePanel
          defaultSize={"35%"}
          minSize={20}
          className={"flex flex-col min-h-0 h-full min-w-0 border"}
        >
          <ProjectHeader
            projSlug={projSlug}
            loading={fetchingProj}
            name={project && "name" in project ? project.name : ""}
          />
          <div className="flex-1 min-h-0">
            <ChatPanel
              messages={messages}
              loading={fetchingProj}
              project={project}
              fetchProject={() => fetchProject(true)}
              messageStatus={messageStatus}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={"65%"}
          minSize={50}
          className={"flex flex-col min-h-0 min-w-0"}
        >
          <PreviewPanel
            project={project}
            loading={fetchingProj}
            refetch={refetchRef.current}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
}

export default ProjectPage;
