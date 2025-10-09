import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [showExplanation, setShowExplanation] = useState({});
  const [newQuestion, setNewQuestion] = useState({ question: "", options: "", answer: "", explanation: "" });

  // Firestore থেকে প্রশ্ন লোড করা
  const loadQuestions = async () => {
    const snapshot = await getDocs(collection(db, "questions"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setQuestions(data);
  };

  useEffect(() => { loadQuestions(); }, []);

  const toggleExplanation = id => {
    setShowExplanation(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // নতুন প্রশ্ন যোগ করা
  const handleAddQuestion = async () => {
    if (!newQuestion.question) return;
    const optionsArray = newQuestion.options.split(",").map(opt => opt.trim());
    await addDoc(collection(db, "questions"), {
      question: newQuestion.question,
      options: optionsArray,
      answer: newQuestion.answer,
      explanation: newQuestion.explanation
    });
    setNewQuestion({ question: "", options: "", answer: "", explanation: "" });
    loadQuestions();
  };

  // প্রশ্ন আপডেট করা
  const handleUpdateQuestion = async (id) => {
    const docRef = doc(db, "questions", id);
    const updatedText = prompt("নতুন প্রশ্ন লিখুন:");
    if (!updatedText) return;
    await updateDoc(docRef, { question: updatedText });
    loadQuestions();
  };

  // প্রশ্ন ডিলিট করা
  const handleDeleteQuestion = async (id) => {
    const docRef = doc(db, "questions", id);
    await deleteDoc(docRef);
    loadQuestions();
  };

  return (
    <main style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h1>Exam App</h1>

      {/* Question List */}
      {questions.map(q => (
        <div key={q.id} style={{ marginBottom: 20, border: "1px solid #ccc", padding: 10, borderRadius: 5 }}>
          <h3>{q.question}</h3>
          <ul>
            {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
          </ul>
          <button onClick={() => toggleExplanation(q.id)}>
            {showExplanation[q.id] ? "লুকাও" : "ব্যাখা দেখাও"}
          </button>
          {showExplanation[q.id] && <p style={{ marginTop: 10, color: "gray" }}>{q.explanation}</p>}
          <div style={{ marginTop: 10 }}>
            <button onClick={() => handleUpdateQuestion(q.id)} style={{ marginRight: 10 }}>Update</button>
            <button onClick={() => handleDeleteQuestion(q.id)}>Delete</button>
          </div>
        </div>
      ))}

      {/* Add Question Form */}
      <div style={{ marginTop: 40 }}>
        <h2>নতুন প্রশ্ন যোগ করো</h2>
        <input
          type="text"
          placeholder="Question"
          value={newQuestion.question}
          onChange={e => setNewQuestion({ ...newQuestion, question: e.target.value })}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Options (comma separated)"
          value={newQuestion.options}
          onChange={e => setNewQuestion({ ...newQuestion, options: e.target.value })}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Answer"
          value={newQuestion.answer}
          onChange={e => setNewQuestion({ ...newQuestion, answer: e.target.value })}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Explanation"
          value={newQuestion.explanation}
          onChange={e => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <button onClick={handleAddQuestion}>Add Question</button>
      </div>
    </main>
  );
}
