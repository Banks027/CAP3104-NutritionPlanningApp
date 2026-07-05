const surveyForm = document.getElementById('surveyForm');
const surveyFormWrapper = document.getElementById('surveyFormWrapper');
const surveyResult = document.getElementById('surveyResult');
const surveyResultText = document.getElementById('surveyResultText');
const noneRestriction = document.getElementById('noneRestriction');

// If "None" is checked under restrictions, uncheck the other restriction boxes (and vice versa)
const restrictionCheckboxes = document.querySelectorAll('input[name="restrictions"]');
restrictionCheckboxes.forEach(box => {
  box.addEventListener('change', () => {
    if (box === noneRestriction && box.checked) {
      restrictionCheckboxes.forEach(other => {
        if (other !== noneRestriction) other.checked = false;
      });
    } else if (box !== noneRestriction && box.checked) {
      noneRestriction.checked = false;
    }
  });
});

surveyForm.addEventListener('submit', (e) => {
  e.preventDefault();

  surveyResultText.textContent = "Thanks for taking the time to fill out our survey!";

  surveyFormWrapper.style.display = 'none';
  surveyResult.style.display = 'block';
});