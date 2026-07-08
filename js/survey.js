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