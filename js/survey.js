<<<<<<< HEAD
setupConfig();

document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('surveyForm');
    var noneRestriction = document.getElementById('noneRestriction');

    if (form) {
        form.addEventListener('submit', addSurvey);
    }

    if (noneRestriction) {
        noneRestriction.addEventListener('change', function () {
            if (!this.checked) {
                return;
            }

            document.querySelectorAll('input[name="restrictions"]').forEach(function (checkbox) {
                if (checkbox !== noneRestriction) {
                    checkbox.checked = false;
                }
            });
        });
    }

    document.querySelectorAll('input[name="restrictions"]').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            if (this.checked && this !== noneRestriction && noneRestriction) {
                noneRestriction.checked = false;
            }
        });
    });
});

function addSurvey(event) {
    event.preventDefault();

    var messageElement = document.getElementById('surveyMessage');
    var resultWrapper = document.getElementById('surveyResult');
    var resultText = document.getElementById('surveyResultText');
    var signupButton = document.getElementById('signupButton');
    var formWrapper = document.getElementById('surveyFormWrapper');

    if (messageElement) {
        messageElement.textContent = '';
    }

    if (formWrapper) {
        formWrapper.style.display = 'none';
    }

    if (resultWrapper) {
        resultWrapper.style.display = 'block';
    }
    if (resultText) {
        resultText.textContent = 'Would you like to sign up?';
    }

    if (signupButton) {
        signupButton.style.display = 'inline-block';
    }
}
=======
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
>>>>>>> 60be9936a1cf09e6ab6337468e0fbd61ee74d138
