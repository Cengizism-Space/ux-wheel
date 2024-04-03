import React, { useContext, useCallback } from "react";
import { CompetenciesContext } from "@/context";
import { CompetencyContextType } from "../../typings";
import { useWebShare } from "@/hooks/useWebShare";

const ShareButton = () => {
  const { link } = useContext(CompetenciesContext) as CompetencyContextType;

  const { share } = useWebShare();

  const handleShare = useCallback(() => {
    share({
      title: "Wheel",
      text: "Check out this wheel",
      url: link ?? "",
    });
  }, [share, link]);

  return (
    typeof navigator.share !== "undefined" && (
      <button onClick={handleShare}>Share link</button>
    )
  );
};

export default ShareButton;