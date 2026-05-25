"use client";

import { UserButton } from "@clerk/nextjs";

interface Props {
  showName?: boolean;
}

function UserControl({ showName = false }: Props) {
  return (
    <UserButton
      showName={showName}
      appearance={{
        elements: {
          userButtonBox: "rounded-md!",
          userButtonAvatarBox: "rounded-md! size-8!",
          userButtonTrigger: "rounded-md!",
        },
      }}
    />
  );
}

export default UserControl;
