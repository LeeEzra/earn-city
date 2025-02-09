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
        alert('Please complete filling all responses');
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
          <div className='checkmark'></div>
          <h3>Congratulations {user.firstName}! Your account Approval is in progress.</h3>
          <p>Be paid by advertising (EARNCITY PRODUCTS) on your WhatsApp status. You will be given products to post on your WhatsApp status, Telegram stries and Facebook stories. You will get paid in the following ways:</p>
          <ol className='paying-list'>
            <li>1 view is Ksh 50</li>
            <li>20 views is Ksh 1,000</li>
            <li>40 views is Ksh 2,000</li>
          </ol>
          <p>Maximum daily number of views is 100 views (Ksh 5,000)<br />Minimum daily number of views is 1 (Ksh 50)</p><br />
          <h3 className="dash-user-id">Your Code: {user.userId}</h3>
          <p>Do not share the code with others</p>
            <button className="form-dashboard-button">View Account Status</button>
          <br />
        </div>
      ) : questions.length === 0 ? (
        <p>Account Inactive no application prcesses</p>
      ) : (
        <>
          <div className="progress-bar">
            <p>Progress: {calculatePercentage()}%</p>
            <progress value={Object.keys(selectedAnswers).length} max={questions.length}></progress>
          </div>
          <div className="user-card-form">
            <div className="user-card-header">
              <h3>ACCOUNT ACTIVATION</h3>
            </div>
            <div className="user-card-body">
              {questions.map((question) => answeredQuestions.includes(question.id) ? null : (
                <div key={question.id} className="question-block">
                  <p>{question.q_number}. {question.text}</p>
                  <div className="options">
                    {question.options && question.options.length > 1 ? (
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
                    ) : (
                      <input type='text' placeholder='Write yourAnswer' value={selectedAnswers[question.id] || ""} onChange={(e) => handleOptionChange(question.id, e.target.value)} />
                    )}
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