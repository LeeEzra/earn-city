import React, { useState, useEffect } from 'react';

const UserContent = () => {
  const [questions, setQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Store selected answers for each question
  const [allSubmitted, setAllSubmitted] = useState(false); // Track if all questions are submitted

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const parts = token.split('.');
        if (!token) {
          throw new Error('Token not found. Please log in.');
        }
        const storedUser = JSON.parse(atob(parts[1]));
        setUser(storedUser);

        const response = await fetch('/auth/questions', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch questions.');
        }

        const data = await response.json();
        setQuestions(data);

        const answeredResponse = await fetch('/auth/answered-questions', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!answeredResponse.ok) {
          const errorData = await answeredResponse.json();
          throw new Error('Failed to fetch answered questions.');
        }

        const answeredData = await answeredResponse.json();
        setAnsweredQuestions(answeredData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);



  const handleSubmitAll = async () => {
    try {
      const answers = Object.entries(selectedAnswers).map(([questionId, answer]) => ({ questionId: parseInt(questionId, 10), answer, })); 
      const unansweredQuestions = questions.filter(
        (q) => !selectedAnswers[q.id]
      );
      if(unansweredQuestions.length > 0) {
        alert('Please complete selecting all responses');
        return;
      }
     

      const response = await fetch('/auth/submit-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ answers: answers }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error submitting answers:', errorData.message);
        alert(`Error: ${errorData.message}`);
        return;
      }

      alert('Tasks submitted successfully!');
      setAllSubmitted(true);

    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  const handleOptionChange = (questionId, selectedOption) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: selectedOption });
  };

  const calculatePercentage = () => {
    if (questions.length === 0) return 0;
    const completedAnswers = Object.keys(selectedAnswers).length;
    return Math.round((completedAnswers / questions.length) * 100);
  };

  return (
    <div className="user-dashboard-cup">
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : questions.length === answeredQuestions.length || allSubmitted ? (
        <div className="success-message">
          <h3>Congratulations {user.firstName}! There are no more Tasks!.</h3>
          <p>You have successfully completed the required tasks.<br />You will use the code below to get Verified:</p>
          <h3 className="dash-user-id">Your Code: {user.userId}</h3>
          <p>Do not share the code with others</p>
          <a href={`https://wa.me/+254105232714?text=Hello%20my%20code%20is:%20*${user.userId}*`}>
            <button className="form-dashboard-button">Submit Code and Finish</button>
          </a>
          <br />
          <p>If you cannot use the button, WhatsApp this number +254105232714</p>
        </div>
      ) : questions.length === 0 ? (
        <p>No Tasks available</p>
      ) : (
        <>
          <div className="progress-bar">
            <p>Progress: {calculatePercentage()}%</p>
            <progress value={Object.keys(selectedAnswers).length} max={questions.length}></progress>
          </div>
          <div className="user-card-form">
            <div className="user-card-header">
              <h3>Application Form</h3>
            </div>
            <div className="user-card-body">
              {questions.map((question) => answeredQuestions.includes(question.id) ? null : (
                <div key={question.id} className="question-block">
                  <p>{question.q_number}. {question.text}</p>
                  <div className="options">
                    <select
                      onChange={(e) => handleOptionChange(question.id, e.target.value)}
                      value={selectedAnswers[question.id] || ''}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {question.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <div className="submit-all-button">
              <button
                onClick={handleSubmitAll}
                className="form-dashboard-button"
              >
                Submit
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserContent;