"use client";
import React, { useEffect, useState, useCallback } from "react";
import Competencies from "./Competencies";
import Header from "./Header";
import { CompetenciesContext } from "../context";
import { fetchWheel } from "@/sanity";
import { CompetencyType, WheelType } from "../../typings";
import { DEFAULT_WHEEL } from "@/constants";

const App: React.FC<{ slug?: string | null }> = ({ slug }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [wheel, setWheel] = useState<WheelType>(DEFAULT_WHEEL);
  const [templates, setTemplates] = useState<WheelType[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      (async () => {
        const wheel = await fetchWheel(slug);
        if (wheel) {
          setWheel(wheel);
        } else {
          setNotFound(true);
        }
      })();
    }
  }, [slug]);

  const updateCompetency = useCallback(
    (update: (competency: CompetencyType) => void) => {
      if (activeIndex !== null) {
        wheel.competencies.find((competency, index) => {
          if (index === activeIndex) {
            update(competency);
          }
        });

        const updatedCompetencies = [...wheel.competencies];
        update(updatedCompetencies[activeIndex]);
        setWheel({ ...wheel, competencies: updatedCompetencies });
      }
    },
    [activeIndex, wheel, setWheel]
  );

  return (
    <CompetenciesContext.Provider
      value={{
        activeIndex,
        setActiveIndex,
        wheel,
        setWheel,
        templates,
        setTemplates,
        updateCompetency,
      }}
    >
      <Header />
      {notFound && <div>Wheel not found</div>}
      <Competencies />
    </CompetenciesContext.Provider>
  );
};

export default App;