function getUsernameFromURL() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('username');
}

document.addEventListener('DOMContentLoaded', () => {
    populateDropdown();
    displaySubjectDetails();

    // fetch('/scores')
    //     .then(response => response.json())
    //     .then(data => {
          
    //         document.getElementById('assignment-score').textContent = data.assignmentScore;
    //         document.getElementById('mid-exam-score').textContent = data.midExamScore;
    //     })
    //     .catch(error => {
    //         console.error('Error fetching scores:', error);
    //     });
    const username = getUsernameFromURL();
    
    if (username) {
        document.getElementById('username').innerHTML = username;
    }
        const dropdown = document.getElementById('subjectDropdown');
        dropdown.addEventListener('change', displaySubjectDetails);
});
const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const username = urlParams.get('username');
    
    if (username) {
      document.getElementById('username').textContent = username;
    }

    async function fetchStudentScores(subjectCode) {
        const username = getUsernameFromURL();
        console.log('Username in fetchStudentScores:', username);
    
        if (!username) {
            console.error('Username is missing.');
            return;
        }
    
        try {
            const response = await fetch(`/scores/${username}?subjectCode=${subjectCode}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch scores. Status: ${response.status}`);
            }
    
            const data = await response.json();
    
            // Update the placeholders with the fetched scores
            document.getElementById('assignment-score').textContent = data.assignments;
            document.getElementById('mid-exam-score').textContent = data.midExam;
        } catch (error) {
            console.error('Error fetching scores:', error);
        }
    }
    
    

    async function populateDropdown() {
        const dropdown = document.getElementById('subjectDropdown');
    
        try {
          
            const response = await fetch('/subjects');
            if (!response.ok) {
                throw new Error(`Failed to fetch subjects. Status: ${response.status}`);
            }
    
            const subjects = await response.json();
    
            subjects.forEach((subject) => {
                const option = document.createElement('option');
                option.value = subject.subjectCode;
                option.text = `${subject.subjectCode} - ${subject.subjectName}`;
                dropdown.appendChild(option);
            });
            
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    } 
    function displaySubjectDetails() {
        const dropdown = document.getElementById('subjectDropdown');
        const selectedSubjectCode = dropdown.value;
        const subjectDetails = document.getElementById('subjectDetails');
    
        if (selectedSubjectCode) {
            fetchStudentScores(selectedSubjectCode);
            const selectedOption = dropdown.querySelector(`[value="${selectedSubjectCode}"]`);
    
            if (selectedOption) {
                const subjectName = selectedOption.textContent.split(' - ')[1];
                subjectDetails.textContent = `Subject Code: ${selectedSubjectCode}\nSubject Name: ${subjectName}`;
            }
        } else {
            subjectDetails.textContent = '';
        }
    }

populateDropdown();
const dropdown = document.getElementById('subjectDropdown');
dropdown.addEventListener('change', displaySubjectDetails);
    

