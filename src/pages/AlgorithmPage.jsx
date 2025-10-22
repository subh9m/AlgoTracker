import React, { useState, useEffect, useCallback } from "react";
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
  problem: "",
  intuition: "",
  approaches: "",
  solution: "",
  timeComplexity: "",
  spaceComplexity: "",
  difficulty: "medium",
  createdAt: null,
};

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
              {q.problem}
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
    if (!formData.problem.trim())
      return alert("Problem Statement cannot be empty.");

    const updatedQuestions = formData.id
      ? questions.map((q) => (q.id === formData.id ? formData : q))
      : [
          ...questions,
          { ...formData, id: Date.now(), createdAt: new Date().toISOString() },
        ];

    setIsModalOpen(false);
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
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (questionToEdit) => {
    setFormData(questionToEdit);
    setModalTitle("Edit Solved Question");
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- NEW HANDLER FOR CODE EDITOR ---
  const handleEditorChange = (code) => {
    setFormData((prev) => ({ ...prev, solution: code }));
  };
  // --- END NEW HANDLER ---

  // 🆕 --- AUTO RESIZE TEXTAREA HELPER ---
  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };
  // 🆕 --- END AUTO RESIZE ---

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
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white tracking-wider">
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
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        className="max-w-7xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* 🆕 AUTO-RESIZE TEXTAREAS */}
          <div className="form-group">
            <label className="form-label" htmlFor="problem">
              Problem Statement
            </label>
            <textarea
              id="problem"
              name="problem"
              value={formData.problem}
              onChange={(e) => {
                handleInputChange(e);
                autoResize(e);
              }}
              className="form-textarea"
              rows={1}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="intuition">
              Intuition
            </label>
            <textarea
              id="intuition"
              name="intuition"
              value={formData.intuition}
              onChange={(e) => {
                handleInputChange(e);
                autoResize(e);
              }}
              className="form-textarea"
              rows={1}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="approaches">
              Approaches
            </label>
            <textarea
              id="approaches"
              name="approaches"
              value={formData.approaches}
              onChange={(e) => {
                handleInputChange(e);
                autoResize(e);
              }}
              className="form-textarea"
              rows={1}
            />
          </div>

          {/* --- SOLUTION CODE BLOCK --- */}
          <div className="form-group">
            <label className="form-label" htmlFor="solution">
              Solution (Code)
            </label>
            <Editor
              value={formData.solution}
              onValueChange={handleEditorChange}
              highlight={(code) => highlight(code, languages.js, "js")}
              padding={16}
              className="form-input prism-editor-wrapper"
              textareaId="solution"
              style={{
                minHeight: "200px",
              }}
            />
          </div>
          {/* --- END SOLUTION --- */}

          <div className="form-group">
            <label className="form-label" htmlFor="difficulty">
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="undefined">Undefined</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="timeComplexity">
                Time Complexity
              </label>
              <input
                id="timeComplexity"
                name="timeComplexity"
                type="text"
                value={formData.timeComplexity}
                onChange={handleInputChange}
                className="form-input font-mono"
                placeholder="e.g., O(n)"
              />
            </div>
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="spaceComplexity">
                Space Complexity
              </label>
              <input
                id="spaceComplexity"
                name="spaceComplexity"
                type="text"
                value={formData.spaceComplexity}
                onChange={handleInputChange}
                className="form-input font-mono"
                placeholder="e.g., O(1)"
              />
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-gray-200 dark:border-[#333] flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {formData.id ? "Save Changes" : "Add Question"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AlgorithmPage;