import React from "react";

interface Props {
  children: React.ReactNode;
}

function ProjectLayout({ children }: Props) {
  return <section>{children}</section>;
}

export default ProjectLayout;
