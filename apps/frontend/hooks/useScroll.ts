import React, { useEffect, useState } from "react";

function useScroll(threshold = 10) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
}

export default useScroll;
