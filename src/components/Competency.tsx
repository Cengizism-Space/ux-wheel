import React, {
  ChangeEvent,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";
import { CompetenciesContext } from "@/context";
import { CompetencyType, CompetencyContextType } from "../../typings";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { CheckIcon } from "@heroicons/react/24/outline";

const Competency: React.FC = () => {
  const { wheel, activeIndex, dispatch } = useContext(
    CompetenciesContext
  ) as CompetencyContextType;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState(5);
  const [error, setError] = useState("");

  useEffect(() => {
    if (activeIndex !== null) {
      setTitle(wheel.competencies[activeIndex].title);
      setValue(wheel.competencies[activeIndex].value);
      setDescription(wheel.competencies[activeIndex]?.description || "");
    } else {
      setTitle("");
      setValue(5);
      setDescription("");
    }
  }, [activeIndex, wheel]);

  const handleTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value),
    []
  );

  const handleValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValue(Number(event.target.value));

      if (wheel.competencies.length > 0) {
        dispatch({
          type: "updateCompetency",
          payload: (competency: CompetencyType) => ({
            ...competency,
            value: Number(event.target.value),
          }),
        });
      }
    },
    [dispatch]
  );

  const handleDescriptionChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setDescription(() => event.target.value),
    []
  );

  const clearMetaForm = useCallback(() => {
    setTitle("");
    setValue(5);
    setDescription("");
  }, []);

  const handleSave = useCallback(() => {
    if (!title.trim()) {
      setError("Competency name cannot be empty");
      return;
    }
    setError("");

    if (activeIndex !== null) {
      dispatch({
        type: "updateCompetency",
        payload: (competency: CompetencyType) => ({
          ...competency,
          title,
          description,
        }),
      });

      clearMetaForm();
      dispatch({ type: "setState", payload: { activeIndex: null } });
    } else if (title && wheel.competencies.length < 20) {
      dispatch({
        type: "setState",
        payload: {
          wheel: {
            ...wheel,
            competencies: [
              ...wheel.competencies,
              {
                title,
                description,
                value: value || 5,
              },
            ],
          },
        },
      });
      clearMetaForm();
    }
  }, [title, description, activeIndex, wheel, clearMetaForm, dispatch]);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
      <InputField
        id="competencyTitle"
        label="Title"
        placeholder="JavaScript, User research, ..."
        value={title}
        onChange={handleTitleChange}
      />
      <InputField
        id="competencyValue"
        label="Value"
        placeholder="5"
        value={value}
        onChange={handleValueChange}
        type="number"
        min={1}
        max={10}
      />
      <InputField
        id="competencyDescription"
        label="Description"
        placeholder="Ability to write clean code, ..."
        value={description}
        onChange={handleDescriptionChange}
      />
      {error && <p className="text-red-500">{error}</p>}

      {/* <Button variant="secondary" onClick={handleSave}>
        <CheckIcon className="h-6 w-6 mr-2" />
        {activeIndex !== null ? "Update" : "Add new"}
      </Button> */}

      <button
        onClick={handleSave}
        className="w-fit block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
        type="button"
      >
        <CheckIcon className="inline h-5 w-5 mr-2" />
        {activeIndex !== null ? "Update" : "Add new"}
      </button>
    </form>
  );
};

export default Competency;