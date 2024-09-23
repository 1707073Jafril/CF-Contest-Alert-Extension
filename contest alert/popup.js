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
                document.getElementById(`End${i + 1}`).innerHTML = '';
            }
            
            upcomingContests.forEach(contest => {
                const startTime = new Date(contest.startTimeSeconds * 1000);
                const currentTime = new Date();
                const timeDifference = startTime - currentTime;

                // Display contest information
                const contestIndex = upcomingContests.indexOf(contest);
                document.getElementById(`contest${contestIndex + 1}`).innerHTML = contest.name;
                document.getElementById(`link${contestIndex + 1}`).innerHTML = 
                    `<a href="https://codeforces.com/contest/${contest.id}" target="_blank">Contest Link</a>`;
                document.getElementById(`Start${contestIndex + 1}`).innerHTML = 
                    startTime.toLocaleString();
                document.getElementById(`End${contestIndex + 1}`).innerHTML = "N/A";

                // Set notification 30 minutes before the contest starts
                if (timeDifference > 0 && timeDifference <= 30 * 60 * 1000) {
                    setTimeout(() => {
                        showNotification(contest.name, `The contest "${contest.name}" starts in 30 minutes!`);
                    }, timeDifference - 30 * 60 * 1000);
                }
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
