import React, { useState, useContext, useEffect } from "react";
import { CompetenciesContext } from "../context";
import { createSlug } from "@/utils";

const TemplatesMenu = () => {
  const context = useContext(CompetenciesContext);
  if (!context) {
    throw new Error("Component must be used within a CompetenciesProvider");
  }
  const { wheel, templates, dispatch } = context;

  const [selectedTemplate, setSelectedTemplate] = useState<string>("default");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(event.target.value);
    templates.forEach((t) => {
      if (t.slug.current === event.target.value) {
        dispatch({
          type: "setWheel",
          payload: {
            ...t,
            slug: {
              ...t.slug,
              current: createSlug(t.title),
            },
            competencies: t.competencies.map((competency) => ({
              ...competency,
            })),
          },
        });
      }
    });
  };

  useEffect(() => {
    if (wheel && wheel.competencies.length > 0) {
      setSelectedTemplate("default");
    }
  }, [wheel]);

  return (
    <div className="competency-templates">
      <select value={selectedTemplate} onChange={handleChange}>
        {selectedTemplate === "default" && (
          <option value="default">Select a template</option>
        )}
        {templates.map((t) => (
          <option key={t.slug.current} value={t.slug.current}>
            {t.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TemplatesMenu;
