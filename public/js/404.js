$(document).ready(function() {
    fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => 
        document.getElementById('IP').innerHTML = data.ip
        )
    .catch(error => console.error('Error:', error));
});