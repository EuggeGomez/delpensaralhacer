document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.querySelector('.quiz');
    const quizInner = document.querySelector('.quiz__inner');
    const quizSteps = document.querySelectorAll('.quiz__step');
    const prevBtn = document.querySelector('.navigation__btn--left');
    const nextBtn = document.querySelector('.navigation__btn--right');
    const progressBarInner = document.querySelector('.progress__inner');
    const summaryDiv = document.getElementById('summary'); 


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
       
        const progress = (currentStep / (totalSteps - 1 > 0 ? totalSteps - 1 : 1)) * 100;
        progressBarInner.style.width = `${progress}%`;
    }

    nextBtn.addEventListener('click', () => {
       
        if (currentStep < totalSteps - 1) {
            const currentQuestionName = quizSteps[currentStep].querySelector('input[type="radio"]')?.name;

            
            if (currentQuestionName) {
                const selectedOption = document.querySelector(`input[name="${currentQuestionName}"]:checked`);
                if (!selectedOption) {
                    alert('Por favor, selecciona una respuesta para continuar.');
                    return; 
                }
            }

            currentStep++;
            updateStepDisplay();
            
            if (currentStep === totalSteps - 1) {
                calculateSummary();
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateStepDisplay();
        }
    });

   
    quizSteps.forEach(step => {
        step.querySelectorAll('.answer__input').forEach(input => {
            input.addEventListener('change', () => {
                setTimeout(() => {
                    
                    if (currentStep < totalSteps - 1) {
                        currentStep++;
                        updateStepDisplay();
                      
                        if (currentStep === totalSteps - 1) {
                            calculateSummary();
                        }
                    } else {
                       
                        calculateSummary();
                    }
                }, 300); 
            });
        });
    });


    
    function calculateSummary() {
        const answers = {};
       
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

        if (answers.neurociencia === 'yes') scores.neurociencia++;
        if (answers.proposito_vida === 'yes') scores.proposito_vida++;
        if (answers.inteligencia_emocional === 'yes') scores.inteligencia_emocional++;
        if (answers.coaching_equipos === 'yes') scores.coaching_equipos++;
        if (answers.neurolinguistica === 'yes') scores.neurolinguistica++;
        if (answers.laboral_ventas === 'yes') scores.laboral_ventas++;
        if (answers.mindfulness === 'yes') scores.mindfulness++;
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
                topAreas = [area.name]; 
            } else if (area.score === maxScore && maxScore > 0) { 
                topAreas.push(area.name);
            }
        });

        if (maxScore === 0) {
         
            suggestedArea = 'Parece que no identificaste áreas de mejora específicas en este momento. ¡Excelente! O quizás no se respondieron todas las preguntas.';
        } else if (topAreas.length > 1) {
            suggestedArea = 'Tus respuestas sugieren que podrías beneficiarte de las siguientes áreas: <strong>' + topAreas.join(' y ') + '</strong>.';
        } else {
            suggestedArea = `Tu área de coaching principal sugerida es: <strong>${topAreas[0]}</strong>.`;
        }

        summaryDiv.innerHTML = `<p>${suggestedArea}</p>`;
    }

   
    updateStepDisplay();
});



document.addEventListener('DOMContentLoaded', function() {
    
    const submenuParentLinks = document.querySelectorAll('.has-submenu > a');

    submenuParentLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const parentLi = this.closest('li.has-submenu'); 

           
            if (parentLi && parentLi.querySelector('.submenu')) {
                event.preventDefault(); 

                document.querySelectorAll('.has-submenu.open').forEach(openLi => {
                    if (openLi !== parentLi) { 
                        openLi.classList.remove('open');
                    }
                });

                
                parentLi.classList.toggle('open');
            }
           
        });
    });

 
});

 