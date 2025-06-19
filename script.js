document.addEventListener('DOMContentLoaded', () => {
    // --- Quiz Functionality ---

    const quizForm = document.querySelector('.quiz');
    const quizInner = document.querySelector('.quiz__inner');
    const quizSteps = document.querySelectorAll('.quiz__step');
    const prevBtn = document.querySelector('.navigation__btn--left');
    const nextBtn = document.querySelector('.navigation__btn--right');
    const progressBarInner = document.querySelector('.progress__inner');
    const summaryDiv = document.getElementById('summary');

    // Ensure all required elements are found before proceeding
    if (!quizForm || !quizInner || quizSteps.length === 0 || !prevBtn || !nextBtn || !progressBarInner || !summaryDiv) {
        console.error("Error: One or more quiz elements not found. Check your HTML selectors.");
        // Optionally, disable quiz functionality if elements are missing
        // return;
    }

    let currentStep = 0;
    const totalSteps = quizSteps.length;

    function updateStepDisplay() {
        quizSteps.forEach((step, index) => {
            step.classList.remove('quiz__step--current', 'quiz__step--left');

            if (index === currentStep) {
                step.classList.add('quiz__step--current');
            } else if (index < currentStep) {
                step.classList.add('quiz__step--left');
            }
        });

        prevBtn.classList.toggle('navigation__btn--disabled', currentStep === 0);
        // Only disable next button if it's the very last step AND the quiz is active
        nextBtn.classList.toggle('navigation__btn--disabled', currentStep === totalSteps - 1);

        updateProgressBar();
        adjustQuizHeight();
    }

    function adjustQuizHeight() {
        const currentStepElement = quizSteps[currentStep];
        if (currentStepElement) {
            quizInner.style.height = `${currentStepElement.clientHeight}px`;
        }
    }

    function updateProgressBar() {
        // Ensure totalSteps - 1 is not zero for division, especially for single-step quizzes
        const progress = (currentStep / (totalSteps - 1 > 0 ? totalSteps - 1 : 1)) * 100;
        progressBarInner.style.width = `${progress}%`;
    }

    nextBtn.addEventListener('click', () => {
        // Prevent action if button is disabled
        if (nextBtn.classList.contains('navigation__btn--disabled') && currentStep !== totalSteps - 1) {
            return;
        }

        if (currentStep < totalSteps - 1) {
            const currentStepElement = quizSteps[currentStep];
            // Find the name of the first radio button in the current step to check selection
            const currentQuestionRadioInput = currentStepElement.querySelector('input[type="radio"]');

            if (currentQuestionRadioInput) {
                const currentQuestionName = currentQuestionRadioInput.name;
                const selectedOption = document.querySelector(`input[name="${currentQuestionName}"]:checked`);
                if (!selectedOption) {
                    alert('Por favor, selecciona una respuesta para continuar.');
                    return; // Stop execution if no option is selected
                }
            }

            currentStep++;
            updateStepDisplay();

            // Check if this is the transition TO the last step
            if (currentStep === totalSteps - 1) {
                calculateSummary();
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        // Prevent action if button is disabled
        if (prevBtn.classList.contains('navigation__btn--disabled')) {
            return;
        }

        if (currentStep > 0) {
            currentStep--;
            updateStepDisplay();
        }
    });

    // Event listener for radio button changes (auto-advance)
    quizSteps.forEach(step => {
        step.querySelectorAll('.answer__input').forEach(input => {
            input.addEventListener('change', () => {
                // Using a small timeout to allow UI to update (like the radio button state)
                setTimeout(() => {
                    // Only auto-advance if not on the last step
                    if (currentStep < totalSteps - 1) {
                        currentStep++;
                        updateStepDisplay();
                    }
                    // Always calculate summary if on the last step after an answer is selected
                    if (currentStep === totalSteps - 1) { // Or if the current step is already the last step
                        calculateSummary();
                    }
                }, 300); // 300ms delay
            });
        });
    });

    // Summary Calculation Function
    function calculateSummary() {
        const answers = {};

        // Iterate over all radio buttons that are checked within the quiz form
        quizForm.querySelectorAll('input[type="radio"]:checked').forEach(input => {
            answers[input.name] = input.value;
        });

        console.log("Respuestas seleccionadas:", answers);

        let scores = {
            neurociencia: 0,
            proposito_vida: 0,
            inteligencia_emocional: 0,
            coaching_equipos: 0,
            neurolinguistica: 0,
            laboral_ventas: 0,
            mindfulness: 0
        };

        // Increment scores based on answers. Note: 'yes' must match your HTML input values.
        if (answers.neurociencia === 'yes') scores.neurociencia++;
        if (answers.proposito_vida === 'yes') scores.proposito_vida++;
        if (answers.inteligencia_emocional === 'yes') scores.inteligencia_emocional++;
        if (answers.coaching_equipos === 'yes') scores.coaching_equipos++;
        if (answers.neurolinguistica === 'yes') scores.neurolinguistica++;
        if (answers.laboral_ventas === 'yes') scores.laboral_ventas++;
        if (answers.mindfulness === 'yes') scores.mindfulness++;
        // Ensure 'vision_futuro' is a valid question name in your HTML,
        // and that it's supposed to contribute to proposito_vida.
        if (answers.vision_futuro === 'yes') scores.proposito_vida++;
        console.log("Puntajes de las áreas:", scores);

        let suggestedArea = 'No se ha determinado un área específica.';
        let maxScore = 0;

        const areasList = [
            { name: 'Coaching y Neurociencia', score: scores.neurociencia },
            { name: 'Coaching y Propósito de Vida', score: scores.proposito_vida },
            { name: 'Inteligencia Emocional', score: scores.inteligencia_emocional },
            { name: 'Coaching de Equipos', score: scores.coaching_equipos },
            { name: 'Coaching y Programación Neurolingüística (PNL)', score: scores.neurolinguistica },
            { name: 'Coaching Laboral y Ventas', score: scores.laboral_ventas },
            { name: 'Coaching y Mindfulness', score: scores.mindfulness }
        ];

        let topAreas = [];
        areasList.forEach(area => {
            if (area.score > maxScore) {
                maxScore = area.score;
                topAreas = [area.name]; // Start a new list of top areas
            } else if (area.score === maxScore && maxScore > 0) {
                topAreas.push(area.name); // Add to existing top areas if score is same and not zero
            }
        });

        if (maxScore === 0) {
            // Updated message for clarity
            suggestedArea = 'Parece que no se seleccionaron respuestas o no se identificaron áreas de mejora específicas en este momento. ¡Sigue explorando!';
        } else if (topAreas.length > 1) {
            suggestedArea = 'Tus respuestas sugieren que podrías beneficiarte de las siguientes áreas: <strong>' + topAreas.join(' y ') + '</strong>.';
        } else {
            suggestedArea = `Tu área de coaching principal sugerida es: <strong>${topAreas[0]}</strong>.`;
        }

        // Ensure summaryDiv exists before trying to set innerHTML
        if (summaryDiv) {
            summaryDiv.innerHTML = `<p>${suggestedArea}</p>`;
        } else {
            console.error("Summary div with ID 'summary' not found.");
        }

        // Make sure the summary div is visible if it's meant to appear at the end
        // You might need to add a class or change display style here based on your CSS
        // For example:
        // summaryDiv.style.display = 'block';
    }

    // Initial setup when the page loads
    updateStepDisplay();


    // --- Submenu Functionality (Isolated) ---
    // It's good practice to wrap separate functionalities in their own blocks or functions
    // and ideally, if they are completely unrelated, put them in separate files or separate
    // DOMContentLoaded listeners if keeping in one file.
}); // End of the first DOMContentLoaded listener

// This second DOMContentLoaded listener is fine, but you could merge it if you prefer
// or keep it separate if you logically separate these features.
document.addEventListener('DOMContentLoaded', function() {
    const submenuParentLinks = document.querySelectorAll('.has-submenu > a');

    // Check if submenuParentLinks exist
    if (submenuParentLinks.length === 0) {
        console.warn("No elements with class 'has-submenu > a' found for submenu functionality.");
        return; // Exit if no submenu elements are present
    }

    submenuParentLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const parentLi = this.closest('li.has-submenu');

            // Ensure parentLi and a submenu exist
            if (parentLi && parentLi.querySelector('.submenu')) {
                event.preventDefault(); // Prevent the default link behavior (e.g., navigating to #)

                // Close any other open submenus
                document.querySelectorAll('.has-submenu.open').forEach(openLi => {
                    if (openLi !== parentLi) { // Don't close the current one
                        openLi.classList.remove('open');
                    }
                });

                // Toggle the 'open' class on the current submenu parent
                parentLi.classList.toggle('open');
            }
        });
    });
});
