async function populateDropdown() {
    const dropdown = document.getElementById('subjectCode');

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
    const dropdown = document.getElementById('subjectCode');
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
function loadStudents() {
    const selectedSubjectCode = document.getElementById('subjectCode').value;
    const studentDropdown = document.getElementById('studentName');

    studentDropdown.innerHTML = '<option value="" disabled selected>Select a student</option>';
    
    if (selectedSubjectCode) {
        fetch(`/students?subjectCode=${selectedSubjectCode}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(students => {
                students.forEach(student => {
                    const option = document.createElement('option');
                    option.value = student.studentName;
                    option.text = student.username; 
                    studentDropdown.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching students:', error);
                // Display an error message to the user or disable the dropdown
            });
    }
}


populateDropdown();
const dropdown = document.getElementById('subjectCode');
dropdown.addEventListener('change', displaySubjectDetails);

document.addEventListener('DOMContentLoaded', () => {
    const marksForm = document.getElementById('marks-form');

    marksForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const subjectCode = document.getElementById('subjectCode').value;
        const studentName = document.getElementById('studentName').value;
        const assignments = parseFloat(document.getElementById('assignments').value);
        const midExam = parseFloat(document.getElementById('midExam').value);
        const formData = {
            subjectCode,
            studentName,
            assignments,
            midExam,
        };

        try {
            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Marks submitted successfully');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error submitting marks:', error);
            alert('An error occurred while submitting marks');
        }
    });
});
