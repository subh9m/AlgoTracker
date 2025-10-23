import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { foundationalAlgos, advancedAlgos } from "../data";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Modal from "../components/Modal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import useTheme from "../hooks/useTheme"; // Import the hook

// --- IMPORTS FOR SYNTAX HIGHLIGHTING ---
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  coy,
} from "react-syntax-highlighter/dist/esm/styles/prism"; // Import a light theme
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
// --- END IMPORTS ---

const initialFormState = {
  id: null,
  problemName: "",
  problem: "",
  intuition: "",
  approaches: "",
  story: "",
  dryRun: "",
  edgeCases: "", // 1. ADDED NEW FIELD STATE
  solution: "",
  timeComplexity: "",
  spaceComplexity: "",
  difficulty: "medium",
  createdAt: null,
};

// TOGGLE SWITCH COMPONENT
const ToggleSwitch = ({ label, isChecked, onChange }) => (
  <label className="toggle-switch-control">
    <span className="toggle-switch-label">{label}</span>
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
      className="toggle-switch-checkbox"
    />
    <span className="toggle-switch-slider"></span>
  </label>
);

const QuestionItem = React.memo(
  ({ q, index, onEdit, onRemove, dragHandleProps }) => {
    const difficultyStyles = {
      easy: {
        border: "border-green-500/60",
        accent: "text-green-600 dark:text-green-400",
        hover: "hover:shadow-[0_0_20px_rgba(0,255,0,0.25)]",
      },
      medium: {
        border: "border-yellow-500/60",
        accent: "text-yellow-600 dark:text-yellow-300",
        hover: "hover:shadow-[0_0_20px_rgba(255,255,0,0.25)]",
      },
      hard: {
        border: "border-red-500/60",
        accent: "text-red-600 dark:text-red-400",
        hover: "hover:shadow-[0_0_25px_rgba(255,0,0,0.35)]",
      },
      undefined: {
        border: "border-gray-500/60",
        accent: "text-gray-500 dark:text-gray-400",
        hover: "hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]",
      },
    };

    const styles = difficultyStyles[q.difficulty] || difficultyStyles.undefined;

    return (
      <div
        onClick={() => onEdit(q)}
        className={`bg-white/80 dark:bg-black/60 shadow-lg shadow-gray-200/50 dark:shadow-none backdrop-blur-md border ${styles.border} 
          rounded-2xl p-4 mb-3 cursor-pointer 
          transition-all duration-500 ease-in-out 
          hover:-translate-y-1 ${styles.hover}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div
              {...dragHandleProps}
              onClick={(e) => e.stopPropagation()}
              className={`cursor-grab active:cursor-grabbing ${styles.accent} 
                hover:text-black dark:hover:text-white transition-all duration-300`}
            >
              <GripVertical size={18} />
            </div>

            <span
              className={`text-sm font-mono ${styles.accent} opacity-80 w-6 text-center flex-shrink-0`}
            >
              {index + 1}.
            </span>

            <span
              className={`font-medium text-gray-900 dark:text-gray-100 truncate 
                hover:text-red-400 transition-colors duration-300`}
            >
              {q.problemName || q.problem}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(q.id);
            }}
            className={`border border-gray-300 dark:border-[#333] text-gray-500 dark:text-gray-400 px-3 py-1 text-xs rounded-lg flex-shrink-0 ml-4
              hover:bg-red-500 hover:text-white hover:dark:text-black hover:shadow-[0_0_15px_rgba(255,0,0,0.4)] 
              transition-all duration-300 ease-in-out`}
          >
            Remove
          </button>
        </div>

        <p
          className={`text-xs mt-2 ml-10 text-gray-500 dark:text-gray-500 font-light tracking-wide`}
        >
          Saved on {q.createdAt ? new Date(q.createdAt).toLocaleString() : "—"}
        </p>
      </div>
    );
  }
);

const AlgorithmPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme(); // Get the current theme
  const algorithm = [...foundationalAlgos, ...advancedAlgos].find(
    (algo) => algo.slug === slug
  );

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [modalTitle, setModalTitle] = useState("Add a New Solved Question");
  const [isEditMode, setIsEditMode] = useState(false);

  // REFS
  const problemRef = useRef(null);
  const intuitionRef = useRef(null);
  const approachesRef = useRef(null);
  const storyRef = useRef(null);
  const dryRunRef = useRef(null);
  const edgeCasesRef = useRef(null); // 2. ADDED NEW REF
  const timeComplexityRef = useRef(null);
  const spaceComplexityRef = useRef(null);

  const fetchQuestions = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);
    const docRef = doc(db, "solved_questions", slug);
    const docSnap = await getDoc(docRef);
    setQuestions(docSnap.exists() ? docSnap.data().questions || [] : []);
    setIsLoading(false);
  }, [slug]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // --- HEIGHT EQUALIZER ---
  const equalizeHeights = (ref1, ref2) => {
    const el1 = ref1.current;
    const el2 = ref2.current;

    if (el1 && el2) {
      el1.style.height = "auto";
      el2.style.height = "auto";
      const height1 = el1.scrollHeight;
      const height2 = el2.scrollHeight;
      const maxHeight = Math.max(height1, height2);
      el1.style.height = `${maxHeight}px`;
      el2.style.height = `${maxHeight}px`;
    }
  };

  // --- AUTO-RESIZE (FOR SINGLE TEXTAREAS) ---
  const autoResize = (e) => {
    const target = e.target ? e.target : e;
    if (target) {
      target.style.height = "auto";
      target.style.height = target.scrollHeight + "px";
    }
  };

  // --- UPDATED useEffect (Handles new pairs and refs) ---
  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        // 1. Resize *un-paired* textareas
        if (dryRunRef.current) {
          autoResize(dryRunRef.current);
        }
        if (edgeCasesRef.current) { // 4. RESIZE NEW FIELD
          autoResize(edgeCasesRef.current);
        }

        // 2. Equalize all pairs
        equalizeHeights(problemRef, intuitionRef);
        equalizeHeights(approachesRef, storyRef);
        equalizeHeights(timeComplexityRef, spaceComplexityRef);
      }, 0); // 0ms timeout to run *after* render
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, formData]); // Re-run if formData changes

  const updateAndSaveChanges = async (newQuestionsList) => {
    setQuestions(newQuestionsList);
    setStatus("Saving...");
    try {
      await setDoc(doc(db, "solved_questions", slug), {
        questions: newQuestionsList,
      });
      setStatus("Saved!");
    } catch (error) {
      console.error("Error saving document: ", error);
      setStatus("Error!");
    }
    setTimeout(() => setStatus(""), 2000);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isEditMode) return;

    if (!formData.problemName.trim())
      return alert("Problem Name cannot be empty.");

    const updatedQuestions = formData.id
      ? questions.map((q) => (q.id === formData.id ? formData : q))
      : [
          ...questions,
          { ...formData, id: Date.now(), createdAt: new Date().toISOString() },
        ];

    setIsModalOpen(false);
    setIsEditMode(false);
    await updateAndSaveChanges(updatedQuestions);
  };

  const handleRemoveQuestion = async (idToRemove) => {
    if (!window.confirm("Are you sure you want to remove this question?"))
      return;
    const updatedQuestions = questions.filter((q) => q.id !== idToRemove);
    await updateAndSaveChanges(updatedQuestions);
  };

  const handleOpenAddModal = () => {
    setFormData(initialFormState);
    setModalTitle("Add a New Solved Question");
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (questionToEdit) => {
    setFormData(questionToEdit);
    setModalTitle("View Solved Question");
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const handleToggleEditMode = (e) => {
    const newEditMode = e.target.checked;
    setIsEditMode(newEditMode);
    if (newEditMode) {
      setModalTitle("Edit Solved Question");
    } else {
      setModalTitle("View Solved Question");
    }
  };

  // Handler for simple inputs
  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- Event Handler for Paired Textareas ---
  const handlePairedTextareaChange = (e, ref1, ref2) => {
    // 1. Update state
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    // 2. Equalize the pair *after* state update
    setTimeout(() => {
      equalizeHeights(ref1, ref2);
    }, 0);
  };

  const handleEditorChange = (code) => {
    setFormData((prev) => ({ ...prev, solution: code }));
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const newList = Array.from(questions);
    const [moved] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, moved);
    await updateAndSaveChanges(newList);
  };

  if (isLoading) {
    return (
      <p className="text-xl text-gray-500 dark:text-gray-400 text-center py-40 font-mono tracking-wider">
        Loading...
      </p>
    );
  }

  if (!algorithm) {
    return (
      <div className="text-center py-40 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-red-500 mb-4 tracking-wider uppercase">
          404 - Not Found
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          The algorithm you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="save-btn" // This btn is styled in index.css
        >
          Go Back
        </button>
      </div>
    );
  }

  const infoSections = [
    { title: "When to Use", content: algorithm.when },
    {
      title: "Keywords",
      content: algorithm.keywords,
      className: "font-mono text-gray-600 dark:text-gray-300",
    },
    { title: "Common Examples", content: algorithm.examples },
    { title: "Sample Code", content: algorithm.code, pre: true },
  ];

  // Helper string for form field styles
  const formFieldStyles = `
    hover:border-gray-400 dark:hover:border-gray-500 
    focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500 focus:border-transparent 
    disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-800 
    transition-all duration-300
  `;

  return (
    <>
      <div className="max-w-7xl mx-auto pt-24 pb-16 px-6 md:px-10">
        <div className="sticky top-8 z-30 mb-10 animate-fadeIn">
          <button
            onClick={() => navigate(-1)}
            className="save-btn text-sm backdrop-blur-md 
                      bg-white/70 border border-gray-300 text-red-500 hover:text-white
                      dark:bg-black/40 dark:border-[#222] dark:text-red-500 dark:hover:text-white
                      hover:bg-red-600 transition-all duration-300"
          >
            ← Back to All Algorithms
          </button>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-wider mb-4 text-gray-900 dark:text-white uppercase">
          {algorithm.title}
        </h1>

        <div className="mt-12 space-y-10">
          {infoSections.map((sec) => (
            <div key={sec.title}>
              {/* This heading is already red */}
              <h2 className="text-sm font-semibold text-red-500 tracking-widest uppercase mb-3">
                {sec.title}
              </h2>
              {sec.pre ? (
                <SyntaxHighlighter
                  key={theme}
                  language="javascript"
                  style={theme === "dark" ? vscDarkPlus : coy}
                  customStyle={{
                    borderRadius: "0.75rem",
                    border:
                      theme === "dark" ? "1px solid #333" : "1px solid #ddd",
                    backgroundColor:
                      theme === "dark" ? "#1E1E1E" : "#fdfdfd",
                    boxShadow:
                      theme === "light"
                        ? "0 4px 12px rgba(0,0,0,0.05)"
                        : "none",
                  }}
                  wrapLines={true}
                  showLineNumbers={true}
                >
                  {sec.content}
                </SyntaxHighlighter>
              ) : (
                <p
                  className={`text-lg font-light leading-relaxed text-gray-800 dark:text-gray-200 ${
                    sec.className || ""
                  }`}
                >
                  {sec.content}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Solved Questions Section */}
        <div className="mt-16 pt-10 border-t border-gray-300 dark:border-[#333]">
          <div className="flex justify-between items-center mb-6">
            {/* Red heading */}
            <h2 className="text-3xl font-semibold text-red-600 dark:text-red-500 tracking-wider">
              My Solved Questions
            </h2>
            <button onClick={handleOpenAddModal} className="save-btn">
              + Add Question
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questionsList">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {questions.length > 0 ? (
                    questions.map((q, index) => (
                      <Draggable
                        key={q.id}
                        draggableId={q.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${
                              snapshot.isDragging
                                ? "scale-[1.02] shadow-2xl shadow-red-500/30"
                                : ""
                            } transition-transform duration-300 ease-in-out`}
                          >
                            <QuestionItem
                              q={q}
                              index={index}
                              onEdit={handleOpenEditModal}
                              onRemove={handleRemoveQuestion}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-500 italic text-center py-8">
                      No questions saved yet. Click "+ Add Question" to get
                      started.
                    </p>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {status && (
            <p
              className={`text-sm mt-4 text-center font-mono ${
                status === "Error!"
                  ? "text-red-500"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {status}
            </p>
          )}
        </div>
      </div>

      {/* --- MODAL --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        className="max-w-7xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* ADDED TOGGLE SWITCH */}
          {formData.id && (
            <div className="flex justify-end pb-4 border-b border-gray-200 dark:border-[#333]">
              <ToggleSwitch
                label="Edit Mode"
                isChecked={isEditMode}
                onChange={handleToggleEditMode}
              />
            </div>
          )}

          {/* Problem Name */}
          <div className="form-group group">
            <label
              className="form-label group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300"
              htmlFor="problemName"
            >
              Problem Name
            </label>
            <input
              id="problemName"
              name="problemName"
              type="text"
              value={formData.problemName}
              onChange={handleInputChange}
              className={`form-input ${formFieldStyles}`}
              placeholder="e.g., Two Sum"
              disabled={!isEditMode}
            />
          </div>

          {/* Problem Statement + Intuition */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="form-group flex-1 group">
              <label
                className="form-label group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300"
                htmlFor="problem"
              >
                Problem Statement
              </label>
              <textarea
                id="problem"
                name="problem"
                ref={problemRef}
                value={formData.problem}
                onChange={(e) =>
                  handlePairedTextareaChange(e, problemRef, intuitionRef)
                }
                className={`form-textarea ${formFieldStyles}`}
                rows={1}
                disabled={!isEditMode}
              />
            </div>
            <div className="form-group flex-1 group">
              <label
                className="form-label group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300"
                htmlFor="intuition"
              >
                Intuition
              </label>
              <textarea
                id="intuition"
                name="intuition"
                ref={intuitionRef}
                value={formData.intuition}
                onChange={(e) =>
                  handlePairedTextareaChange(e, problemRef, intuitionRef)
                }
                className={`form-textarea ${formFieldStyles}`}
                rows={1}
                disabled={!isEditMode}
              />
            </div>
          </div>

          {/* Approaches + Story */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="form-group flex-1 group">
              <label
                className="form-label group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300"
                htmlFor="approaches"
              >
                Approaches
              </label>
              <textarea
                id="approaches"
                name="approaches"
                ref={approachesRef}
                value={formData.approaches}
                onChange={(e) =>
                  handlePairedTextareaChange(e, approachesRef, storyRef)
                }
                className={`form-textarea ${formFieldStyles}`}
                rows={1}
                disabled={!isEditMode}
              />
            </div>
            <div className="form-group flex-1 group">
              <label
                className="form-label group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300"
                htmlFor="story"
              >
                Story / Analogy
              </label>
              <textarea
                id="story"
                name="story"
                ref={storyRef}
                value={formData.story}
                onChange={(e) =>
                  handlePairedTextareaChange(e, approachesRef, storyRef)
                }
                className={`form-textarea ${formFieldStyles}`}
                rows={1}
                disabled={!isEditMode}
                placeholder="e.g., 'Imagine this as a filing cabinet...'"
              />
            </div>
          </div>

          {/* Solution (65%) + Right Column (35%) */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Solution (65%) */}
            <div className="form-group flex-1 md:basis-[65%] group">
              <label
                className="form-label group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300"
                htmlFor="solution"
              >
                Solution (Code)
              </label>
              <Editor
                value={formData.solution}
                onValueChange={handleEditorChange}
                highlight={(code) => highlight(code, languages.js, "js")}
                padding={16}
                readOnly={!isEditMode}
                className={`form-input prism-editor-wrapper ${formFieldStyles} ${
                  !isEditMode ? "prism-editor-readonly" : ""
                }`}
                textareaId="solution"
                style={{
                  minHeight: "200px",
                }}
              />
            </div>

            {/* Right Column (35%) - Contains Dry Run and Edge Cases */}
            {/* 3. UPDATED LAYOUT: Added inner div with space-y-6 */}
            <div className="flex-1 md:basis-[35%] flex flex-col space-y-6">
              {/* Dry Run */}
              <div className="form-group group">
                <label
                  className="form-label group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300"
                  htmlFor="dryRun"
                >
                  Dry Run Example
                </label>
                <textarea
                  id="dryRun"
                  name="dryRun"
                  ref={dryRunRef}
                  value={formData.dryRun}
                  onChange={(e) => {
                    handleInputChange(e);
                    autoResize(e); // Uses single resize logic
                  }}
                  className={`form-textarea ${formFieldStyles}`}
                  rows={1}
                  disabled={!isEditMode}
                  placeholder="e.g., 'arr = [1, 2, 3], i=0, j=2...'"
                />
              </div>

              {/* 5. ADDED NEW FIELD JSX */}
              {/* Edge Cases / Constraints */}
              <div className="form-group group">
                <label
                  className="form-label group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300"
                  htmlFor="edgeCases"
                >
                  Key Data Structures / Edge Cases
                </label>
                <textarea
                  id="edgeCases"
                  name="edgeCases"
                  ref={edgeCasesRef}
                  value={formData.edgeCases}
                  onChange={(e) => {
                    handleInputChange(e);
                    autoResize(e); // Uses single resize logic
                  }}
                  className={`form-textarea ${formFieldStyles}`}
                  rows={1}
                  disabled={!isEditMode}
                  placeholder="e.g., 'Empty array, negative numbers, n > 10^5'"
                />
              </div>
            </div>
          </div>

          {/* Difficulty (Full Width) */}
          <div className="form-group group">
            <label
              className="form-label group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300"
              htmlFor="difficulty"
            >
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              className={`form-input ${formFieldStyles}`}
              disabled={!isEditMode}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="undefined">Undefined</option>
            </select>
          </div>

          {/* Time & Space (50/50) */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="form-group flex-1 group">
              <label
                className="form-label group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300"
                htmlFor="timeComplexity"
              >
                Time Complexity
              </label>
              <textarea
                id="timeComplexity"
                name="timeComplexity"
                ref={timeComplexityRef}
                value={formData.timeComplexity}
                onChange={(e) =>
                  handlePairedTextareaChange(
                    e,
                    timeComplexityRef,
                    spaceComplexityRef
                  )
                }
                className={`form-textarea font-mono ${formFieldStyles}`}
                rows={1}
                placeholder="e.g., O(n)"
                disabled={!isEditMode}
              />
            </div>
            <div className="form-group flex-1 group">
              <label
                className="form-label group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300"
                htmlFor="spaceComplexity"
              >
                Space Complexity
              </label>
              <textarea
                id="spaceComplexity"
                name="spaceComplexity"
                ref={spaceComplexityRef}
                value={formData.spaceComplexity}
                onChange={(e) =>
                  handlePairedTextareaChange(
                    e,
                    timeComplexityRef,
                    spaceComplexityRef
                  )
                }
                className={`form-textarea font-mono ${formFieldStyles}`}
                rows={1}
                placeholder="e.g., O(1)"
                disabled={!isEditMode}
              />
            </div>
          </div>

          {/* SIMPLIFIED MODAL FOOTER */}
          <div className="pt-6 mt-4 border-t border-gray-200 dark:border-[#333] flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="cancel-btn"
            >
              Close
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={!isEditMode} // Save button is disabled in view mode
            >
              {formData.id ? "Save Changes" : "Add Question"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AlgorithmPage;