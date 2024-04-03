import React, {
  ChangeEvent,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";
import { CompetenciesContext } from "@/context";
import { CompetencyType, CompetencyContextType } from "../../typings";

const CompetencyMeta: React.FC = () => {
  const { wheel, activeIndex, dispatch } = useContext(
    CompetenciesContext
  ) as CompetencyContextType;

  const [hasDescription, setHasDescription] = useState(false);
  const [description, setDescription] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (activeIndex !== null) {
      setInputValue(wheel.competencies[activeIndex].title);
      setDescription(wheel.competencies[activeIndex]?.description || "");
      if (wheel.competencies[activeIndex]?.description?.length) {
        setHasDescription(true);
      }
    } else {
      setInputValue("");
      setDescription("");
      setHasDescription(false);
    }
  }, [activeIndex, wheel]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value),
    []
  );

  const handleDescriptionChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) =>
      setDescription(() => event.target.value),
    []
  );

  const handleCheckboxChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setHasDescription(event.target.checked),
    []
  );

  const clearMetaForm = useCallback(() => {
    setInputValue("");
    setDescription("");
    setHasDescription(false);
  }, []);

  const handleSave = useCallback(() => {
    if (!inputValue.trim()) {
      setError("Competency name cannot be empty");
      return;
    }
    setError("");

    if (activeIndex !== null) {
      dispatch({
        type: "updateCompetency",
        payload: (competency: CompetencyType) => ({
          ...competency,
          title: inputValue,
          description: description,
        }),
      });

      clearMetaForm();
      dispatch({ type: "setState", payload: { activeIndex: null } });
    } else if (inputValue && wheel.competencies.length < 20) {
      dispatch({
        type: "setState",
        payload: {
          wheel: {
            ...wheel,
            competencies: [
              ...wheel.competencies,
              {
                title: inputValue,
                description,
                value: 5,
              },
            ],
          },
        },
      });
      clearMetaForm();
    }
  }, [inputValue, description, activeIndex, wheel, clearMetaForm, dispatch]);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="rows gap-4">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="border-2 border-gray-300 rounded-md p-2"
      />
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={hasDescription}
          onChange={handleCheckboxChange}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <label className="text-gray-700">Has a description</label>
      </div>
      {hasDescription && (
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          className="border-2 border-gray-300 rounded-md p-2"
        />
      )}
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        {activeIndex !== null ? "Update" : "Add new"}
      </button>
    </form>
  );
};

export default CompetencyMeta;