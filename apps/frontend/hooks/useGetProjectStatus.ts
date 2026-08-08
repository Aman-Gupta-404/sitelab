import { useEffect, useRef, useState } from "react";

type SSEMessage =
  | { type: "start" }
  | { type: "not-found"; data: any }
  | { type: "complete"; data: any }
  | { type: "stream"; data: string }
  | { type: "processing"; data: any }
  | { type: "error"; data: any; error: any };

type Status = "idle" | "open" | "closed" | "error" | "processing";

export function useGetProjectStatus() {
  const [error, setError] = useState<any>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [projectData, setProjectData] = useState<any>(null);
  const [messages, setMessages] = useState<SSEMessage[]>([]);

  const isClosedRef = useRef(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const closeConnection = () => {
    // eventSourceRef.current?.close();
    // eventSourceRef.current = null;
    // setStatus("closed");
    isClosedRef.current = true;
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setStatus("closed");
  };

  const fetchProjectStatus = (projectId: string) => {
    if (!projectId) return;

    // Close any existing connection first
    closeConnection();

    setMessages([]);
    setProjectData(null);
    setError(null);
    setStatus("processing");

    const es = new EventSource(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/project/status?projectId=${projectId}`,
      { withCredentials: true },
    );

    eventSourceRef.current = es;

    es.onopen = () => {
      setStatus("open");
    };

    es.onmessage = (event) => {
      try {
        const data: SSEMessage = JSON.parse(event.data);
        console.log("data: ", data);

        setMessages((prev) => [...prev, data]);

        switch (data.type) {
          case "complete":
            setProjectData(data.data);
            closeConnection();
            break;

          case "processing":
            setProjectData(data.data);
            setStatus("processing");
            break;

          case "error":
            setError(data.error);
            setStatus("error");
            closeConnection();
            break;

          case "not-found":
            setProjectData(data.data);
            // setError("Project not found");
            // setStatus("error");
            closeConnection();
            break;
        }

        // if(["complete", "not-found", ])
      } catch (err) {
        console.log("SSE parse error:", err);
        setError(err);
        setStatus("error");
        closeConnection();
      }
    };

    es.onerror = (err) => {
      console.log("SSE error:", err);
      setError(err);
      setStatus("error");
      closeConnection();
    };
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeConnection();
    };
  }, []);

  return {
    messages,
    status,
    projectData,
    error,
    fetchProjectStatus,
    closeConnection,
  };
}
