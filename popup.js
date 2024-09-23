async function fetchData() {
    try {
        const res = await fetch('https://codeforces.com/api/contest.list');

        // Check if the response is okay (status 200-299)
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await res.json();
        console.log(data);

        if (data.result && data.result.length > 0) {
            const upcomingContests = data.result.filter(contest => contest.phase === 'BEFORE');

            // Clear previous results
            for (let i = 0; i < 5; i++) {
                document.getElementById(`contest${i + 1}`).innerHTML = '';
                document.getElementById(`link${i + 1}`).innerHTML = '';
                document.getElementById(`Start${i + 1}`).innerHTML = '';
                document.getElementById(`Remaining${i + 1}`).innerHTML = ''; // Clear remaining time
            }

            upcomingContests.forEach((contest, index) => {
                const startTime = new Date(contest.startTimeSeconds * 1000);
                
                // Display contest information
                document.getElementById(`contest${index + 1}`).innerHTML = contest.name;
                document.getElementById(`link${index + 1}`).innerHTML = 
                    `<a href="https://codeforces.com/contest/${contest.id}" target="_blank">Contest Link</a>`;
                document.getElementById(`Start${index + 1}`).innerHTML = 
                    startTime.toLocaleString();

                // Update remaining time dynamically
                updateRemainingTime(startTime, index + 1); // Pass the contest start time and index
            });
        } else {
            console.log('No upcoming contests available.');
            document.querySelector('.container').innerHTML = '<p>No upcoming contests found.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.querySelector('.container').innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    }
}

// Function to update remaining time dynamically
function updateRemainingTime(startTime, index) {
    const interval = setInterval(() => {
        const currentTime = new Date();
        const timeDifference = startTime - currentTime;

        if (timeDifference <= 0) {
            clearInterval(interval); // Stop updating if the contest has started
            document.getElementById(`Remaining${index}`).innerHTML = "Contest has started!";
            return;
        }

        // Update the displayed remaining time
        const remainingTime = formatRemainingTime(timeDifference);
        document.getElementById(`Remaining${index}`).innerHTML = remainingTime;
    }, 1000); // Update every second
}

// Function to format remaining time
function formatRemainingTime(ms) {
    const totalSeconds = Math.max(Math.floor(ms / 1000), 0); // Ensure it's non-negative
    const days = Math.floor(totalSeconds / 86400); // 1 day = 86400 seconds
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Function to show notifications
function showNotification(title, message) {
    // Check for notification permission
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: 'images/logo.png', 
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, {
                    body: message,
                    icon: 'images/logo.png',
                });
            }
        });
    }
}

// Call the fetchData function to execute it when the popup loads
fetchData();
