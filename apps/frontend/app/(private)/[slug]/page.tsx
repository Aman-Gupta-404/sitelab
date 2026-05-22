"use client";

import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [project, setProject] = useState<Project | ErrorType | null>(null);
  const [messageStatus, setMessageStatus] = useState<
    "processing" | "complete" | "error" | "idle"
  >("idle");

  const { status, projectData, error, fetchProjectStatus, closeConnection } =
    useGetProjectStatus();

  const fetchProjectData = async (slug: string) => {
    try {
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
    }
  };

  useEffect(() => {
    if (params.slug) {
      const slug = params.slug as string;
      setProjSlug(slug);

      // fetch project
      fetchProjectData(slug);

      // Fetch messages
      fetchProjectStatus(slug);
    }
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

  console.log({ project });

  return (
    <section className="h-screen">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className={"flex flex-col min-h-0"}
        >
          <ProjectHeader projSlug={projSlug} />
          <ChatPanel messages={messages} messageStatus={messageStatus} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={65}
          minSize={50}
          className={"flex flex-col min-h-0"}
        >
          <PreviewPanel project={project} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
}

export default ProjectPage;
