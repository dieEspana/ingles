// ======= VARIABLES =======
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const resultContainer = document.getElementById("result-container");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart-btn");
const quizBox = document.getElementById("quiz-box");
const audioEl = document.getElementById("question-audio"); // usa el <audio> del HTML

let currentQuestionIndex = 0;
let score = 0;

// ======= PREGUNTAS (cada pregunta tiene su propiedad audio opcional) =======
const questions = [
  {
    question: "1. What does AI stand for?",
    audio: "audios/question1.mp3",
    answers: [
      { text: "Artificial Intelligence", correct: true },
      { text: "Automated Integration", correct: false },
      { text: "Algorithm Input", correct: false },
      { text: "Automatic Interaction", correct: false }
    ]
  },
  {
    question: "2. Which language is mainly used for web development?",
    audio: "audios/question2.mp3",
    answers: [
      { text: "Python", correct: false },
      { text: "C++", correct: false },
      { text: "JavaScript", correct: true },
      { text: "Kotlin", correct: false }
    ]
  },
  {
    question: "3. What is data encryption used for?",
    audio: "audios/question3.mp3",
    answers: [
      { text: "To protect data from unauthorized access", correct: true },
      { text: "To compress data", correct: false },
      { text: "To speed up Wi-Fi", correct: false },
      { text: "To create backups", correct: false }
    ]
  },
  {
    question: "4. Which device can fly and take pictures?",
    audio: "audios/question4.mp3",
    answers: [
      { text: "Smartwatch", correct: false },
      { text: "Drone", correct: true },
      { text: "Router", correct: false },
      { text: "Server", correct: false }
    ]
  },
  {
    question: "5. What have engineers already developed to increase data privacy?",
    audio: "audios/question5.mp3",
    answers: [
      { text: "End-to-end encryption", correct: true },
      { text: "Faster processors", correct: false },
      { text: "New USB ports", correct: false },
      { text: "AI cameras", correct: false }
    ]
  },
  {
    question: "6. What language was one of the first in computer history?",
    // Si tu archivo se llama "pregunta6.mp3" pon exactamente ese nombre aquí:
    audio: "audios/pregunta6.mp3",
    answers: [
      { text: "COBOL", correct: true },
      { text: "Python", correct: false },
      { text: "Swift", correct: false },
      { text: "Rust", correct: false }
    ]
  },
  {
    question: "7. What is the main risk of drone technology?",
    audio: "audios/pregunta7.mp3",
    answers: [
      { text: "Privacy invasion", correct: true },
      { text: "Slower internet", correct: false },
      { text: "Battery explosion", correct: false },
      { text: "Signal noise", correct: false }
    ]
  },
  {
    question: "8. What does HTML stand for?",
    audio: "audios/pregunta8.mp3",
    answers: [
      { text: "HyperText Markup Language", correct: true },
      { text: "HighText Machine Learning", correct: false },
      { text: "Home Tool Markup Language", correct: false },
      { text: "Hyper Transfer Management Language", correct: false }
    ]
  },
  {
    question: "9. What device stores data permanently?",
    audio: "audios/pregunta9.mp3",
    answers: [
      { text: "RAM", correct: false },
      { text: "SSD", correct: true },
      { text: "Cache", correct: false },
      { text: "GPU", correct: false }
    ]
  },
  {
    question: "10. Which of the following is an example of AI?",
    audio: "audios/pregunta10.mp3",
    answers: [
      { text: "ChatGPT", correct: true },
      { text: "Microsoft Word", correct: false },
      { text: "Calculator", correct: false },
      { text: "Paint", correct: false }
    ]
  },
  {
    question: "11. What programming language is used for Android apps?",
    audio: "audios/question11.mp3",
    answers: [
      { text: "Kotlin", correct: true },
      { text: "PHP", correct: false },
      { text: "R", correct: false },
      { text: "C", correct: false }
    ]
  },
  {
    question: "12. What is cybersecurity focused on?",
    audio: "audios/question12.mp3",
    answers: [
      { text: "Protecting information systems", correct: true },
      { text: "Improving hardware", correct: false },
      { text: "Building robots", correct: false },
      { text: "Designing apps", correct: false }
    ]
  },
  {
    question: "13. Which of these is a backend language?",
    audio: "audios/question13.mp3",
    answers: [
      { text: "Node.js", correct: true },
      { text: "HTML", correct: false },
      { text: "CSS", correct: false },
      { text: "Photoshop", correct: false }
    ]
  },
  {
    question: "14. What have students already learned in System Engineering?",
    audio: "audios/question14.mp3",
    answers: [
      { text: "Programming, networks and databases", correct: true },
      { text: "Only video editing", correct: false },
      { text: "Just English", correct: false },
      { text: "Only hardware repair", correct: false }
    ]
  },
  {
    question: "15. What will AI probably improve in the future?",
    audio: "audios/question15.mp3",
    answers: [
      { text: "Automation and data analysis", correct: true },
      { text: "Manual work", correct: false },
      { text: "Paper documentation", correct: false },
      { text: "Old computers", correct: false }
    ]
  }
];

// ======= FUNCIÓN PARA MEZCLAR (RESPUESTAS) =======
function shuffleArray(array) {
  // Fisher-Yates shuffle (mejor que sort(Math.random()))
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ======= INICIO =======
function startGame() {
  score = 0;
  currentQuestionIndex = 0;
  // No barajamos las preguntas; solo las respuestas en cada showQuestion
  quizBox.classList.remove("hidden");
  resultContainer.classList.add("hidden");
  nextButton.textContent = "Next";
  showQuestion();
}

// ======= MOSTRAR PREGUNTA =======
function showQuestion() {
  resetState();

  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;

  // Reproducir audio si existe
  if (currentQuestion.audio) {
    audioEl.src = currentQuestion.audio;
    audioEl.load();
    audioEl.play().catch(err => {
      // Si no se puede reproducir (autoplay bloqueado), no rompe el juego
      console.warn("Audio playback blocked or missing file:", currentQuestion.audio, err);
    });
    audioEl.classList.remove("hidden");
  } else {
    audioEl.classList.add("hidden");
  }

  // 🔀 Mezclar las respuestas (copia)
  const shuffledAnswers = shuffleArray(currentQuestion.answers);

  shuffledAnswers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    button.addEventListener("click", () => selectAnswer(answer, button));
    answerButtons.appendChild(button);
  });
}

// ======= REINICIAR ESTADO =======
function resetState() {
  nextButton.style.display = "none";
  answerButtons.innerHTML = "";
}

// ======= SELECCIONAR RESPUESTA =======
function selectAnswer(answerObj, buttonEl) {
  // answerObj: el objeto de respuesta {text, correct}
  const correct = answerObj.correct;

  // marca la selección
  buttonEl.classList.add("selected");

  // deshabilitar todos y mostrar colores correct/incorrect
  Array.from(answerButtons.children).forEach(button => {
    button.disabled = true;
    const text = button.textContent;
    const isCorrect = questions[currentQuestionIndex].answers.find(a => a.text === text).correct;
    if (isCorrect) {
      button.classList.add("correct");
    } else if (button === buttonEl && !correct) {
      button.classList.add("incorrect");
    }
  });

  if (correct) score++;
  nextButton.style.display = "block";
}

// ======= SIGUIENTE =======
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

// ======= MOSTRAR RESULTADO FINAL =======
function showResult() {
  quizBox.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  scoreElement.innerText = `${score} / ${questions.length}`;

  let message = "";
  if (score === questions.length) {
    message = "🎉 Excellent! You got all correct!";
  } else if (score >= questions.length * 0.7) {
    message = "👏 Great job! You did very well.";
  } else {
    message = "💪 Keep practicing and you’ll improve!";
  }

  // Asegúrate de tener un elemento con id="final-message" en tu HTML
  const finalMessageEl = document.getElementById("final-message");
  if (finalMessageEl) finalMessageEl.innerText = message;

  // pausa audio final si queda reproduciendo
  try { audioEl.pause(); audioEl.currentTime = 0; } catch(e) {}
}

// ======= REINICIAR =======
restartButton.addEventListener("click", () => {
  startGame();
});

// ======= INICIAR JUEGO =======
startGame();
