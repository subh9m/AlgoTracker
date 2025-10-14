import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { foundationalAlgos, advancedAlgos } from '../data';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";

import Modal from '../components/Modal';

const initialFormState = {
  id: null,
  problem: '',
  intuition: '',
  approaches: '',
  solution: '',
  timeComplexity: '',
  spaceComplexity: '',
};

const AlgorithmPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const algorithm = [...foundationalAlgos, ...advancedAlgos].find(algo => algo.slug === slug);

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [modalTitle, setModalTitle] = useState('Add a New Solved Question');

  const fetchQuestions = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);
    const docRef = doc(db, "solved_questions", slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setQuestions(docSnap.data().questions || []);
    } else {
      setQuestions([]);
    }
    setIsLoading(false);
  }, [slug]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const updateAndSaveChanges = async (newQuestionsList) => {
    setQuestions(newQuestionsList);
    setStatus('Saving...');
    try {
      const docRef = doc(db, "solved_questions", slug);
      await setDoc(docRef, { questions: newQuestionsList });
      setStatus('Saved!');
    } catch (error) {
      console.error("Error saving document: ", error);
      setStatus('Error!');
    }
    setTimeout(() => setStatus(''), 2000);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.problem.trim()) {
      alert('Problem Statement cannot be empty.');
      return;
    }
    let updatedQuestions;
    if (formData.id) {
      updatedQuestions = questions.map(q => q.id === formData.id ? formData : q);
    } else {
      const newQuestion = { ...formData, id: Date.now() };
      updatedQuestions = [...questions, newQuestion];
    }
    setIsModalOpen(false);
    await updateAndSaveChanges(updatedQuestions);
  };
  
  const handleRemoveQuestion = async (idToRemove) => {
    if (window.confirm("Are you sure you want to remove this question?")) {
      const updatedQuestions = questions.filter(q => q.id !== idToRemove);
      await updateAndSaveChanges(updatedQuestions);
    }
  };

  const handleOpenAddModal = () => {
    setFormData(initialFormState);
    setModalTitle('Add a New Solved Question');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (questionToEdit) => {
    setFormData(questionToEdit);
    setModalTitle('Edit Solved Question');
    setIsModalOpen(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return <div className="flex justify-center items-center py-40"><p className="text-xl text-gray-400">Loading...</p></div>;
  }
  if (!algorithm) {
    return (
        <div className="text-center py-40 px-6">
            <h1 className="text-4xl font-bold text-red-500 mb-4">404 - Not Found</h1>
            <p className="text-lg opacity-80 mb-8">The algorithm you are looking for does not exist.</p>
            <button onClick={() => navigate(-1)} className="text-red-500 border border-red-500 px-6 py-2 rounded-lg hover:bg-red-500 hover:text-black transition-colors">
                Go Back
            </button>
        </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto py-32 px-6 md:px-10">
        <div className="mb-8">
            <button onClick={() => navigate(-1)} className="text-red-500 border border-red-500/50 px-6 py-2 rounded-lg hover:bg-red-500 hover:text-black transition-colors text-sm">
                ← Back to All Algorithms
            </button>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 text-white uppercase">{algorithm.title}</h1>
      
        <div className="mt-12 space-y-10">
          <div>
            <h2 className="text-sm font-semibold text-red-500 tracking-widest uppercase mb-3">When to Use</h2>
            <p className="text-lg font-light leading-relaxed opacity-90">{algorithm.when}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-red-500 tracking-widest uppercase mb-3">Keywords</h2>
            <p className="text-lg font-light leading-relaxed opacity-90 font-mono text-gray-400">{algorithm.keywords}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-red-500 tracking-widest uppercase mb-3">Common Examples</h2>
            <p className="text-lg font-light leading-relaxed opacity-90">{algorithm.examples}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-red-500 tracking-widest uppercase mb-3">Sample Code</h2>
            <pre className="algo-code">
              <code>{algorithm.code}</code>
            </pre>
          </div>
        </div>
      
        <div className="mt-16 pt-10 border-t border-border-color">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-white tracking-wide">My Solved Questions</h2>
            <button onClick={handleOpenAddModal} className="save-btn">
              + Add Question
            </button>
          </div>
          
          <div className="space-y-4">
            {questions.length > 0 ? (
              questions.map(q => (
                <div key={q.id} onClick={() => handleOpenEditModal(q)} className="bg-surface-color p-4 rounded-lg border border-border-color cursor-pointer hover:border-red-500/50 hover:bg-white/5 transition-all flex justify-between items-center">
                  <span className="font-medium text-white">{q.problem}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveQuestion(q.id);
                    }} 
                    className="text-xs text-red-500 hover:text-red-400 ml-4 px-3 py-1 rounded-md hover:bg-red-500/10 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-center py-8">No questions saved yet. Click "+ Add Question" to get started.</p>
            )}
          </div>
          {status && <p className="text-green-400 text-sm mt-4 text-center">{status}</p>}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="form-group">
                <label className="form-label" htmlFor="problem">Problem Statement</label>
                <input id="problem" name="problem" type="text" value={formData.problem} onChange={handleInputChange} className="form-input" required />
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="intuition">Intuition</label>
                <textarea id="intuition" name="intuition" value={formData.intuition} onChange={handleInputChange} className="form-textarea" />
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="approaches">Approaches</label>
                <textarea id="approaches" name="approaches" value={formData.approaches} onChange={handleInputChange} className="form-textarea" />
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="solution">Solution (Code)</label>
                <textarea id="solution" name="solution" value={formData.solution} onChange={handleInputChange} className="form-textarea solution-textarea" />
            </div>
            <div className="flex gap-4">
                <div className="form-group flex-1">
                    <label className="form-label" htmlFor="timeComplexity">Time Complexity</label>
                    <input id="timeComplexity" name="timeComplexity" type="text" value={formData.timeComplexity} onChange={handleInputChange} className="form-input" placeholder="e.g., O(n)" />
                </div>
                <div className="form-group flex-1">
                    <label className="form-label" htmlFor="spaceComplexity">Space Complexity</label>
                    <input id="spaceComplexity" name="spaceComplexity" type="text" value={formData.spaceComplexity} onChange={handleInputChange} className="form-input" placeholder="e.g., O(1)" />
                </div>
            </div>
            <div className="pt-4 mt-2 border-t border-border-color flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
                Cancel
                </button>
                <button type="submit" className="save-btn">
                {formData.id ? 'Save Changes' : 'Add Question'}
                </button>
            </div>
        </form>
      </Modal>
    </>
  );
};

export default AlgorithmPage;
