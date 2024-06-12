function displayAttendance() {
    const username = document.getElementById('username').value;

    // Make an AJAX request to your server to fetch the student attendance data
    // You can use fetch() or XMLHttpRequest here

    // Example using fetch:
    fetch(`/getAttendance?username=${username}`)
        .then(response => response.json())
        .then(data => {
            const attendanceResult = document.getElementById('attendance-result');
            attendanceResult.innerHTML = ''; // Clear previous results

            if (data.length === 0) {
                attendanceResult.textContent = 'No attendance data found for this student.';
            } else {
                const table = document.createElement('table');
                table.classList.add('attendance-table');

                // Create table header
                const headerRow = document.createElement('tr');
                const dateHeader = document.createElement('th');
                dateHeader.textContent = 'Date';
                const statusHeader = document.createElement('th');
                statusHeader.textContent = 'Status';

                headerRow.appendChild(dateHeader);
                headerRow.appendChild(statusHeader);
                table.appendChild(headerRow);

                // Create table rows for attendance data
                data.forEach(attendance => {
                    const row = document.createElement('tr');
                    const dateCell = document.createElement('td');
                    dateCell.textContent = attendance.date;
                    const statusCell = document.createElement('td');
                    statusCell.textContent = attendance.status;

                    row.appendChild(dateCell);
                    row.appendChild(statusCell);
                    table.appendChild(row);
                });

                attendanceResult.appendChild(table);
            }
        })
        .catch(error => {
            console.error('Error fetching attendance data:', error);
        });
}
