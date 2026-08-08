import React from "react";

interface Props {
  children: React.ReactNode;
}

function ProjectLayout({ children }: Props) {
  return <section className="h-screen w-screen">{children}</section>;
}

export default ProjectLayout;
