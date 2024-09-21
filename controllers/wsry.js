document.addEventListener('DOMContentLoaded', function () {
    const tickerSet = ['AAPL', 'BRK.B', 'GOOGL', 'AMZN', 'META', 'INTC', 'CLOV', 'KOSS', 'GME', 'BB', 'CVX', 'XOM', 'JD', 'NIO', 'BABA', 'MSFT', 'TSLA', 'NVDA', 'HD', 'PG', 'KO', 'COST', 'MSTR', 'MCD', 'NFLX', 'GM', 'AMD', 'TMUS', 'NKE', 'DIS', 'RTX', 'BA', 'CAT', 'UNP', 'TM', 'TSM', 'SPY', 'QQQ', 'PLTR'];

    const wheel = document.getElementById('spinButton'); // Use the existing 'spinButton' element as the wheel
    const tickerResult = document.getElementById('tickerResult');
    const tickerDisplay = document.getElementById('ticker');
    const selectedTickerInput = document.getElementById('selectedTicker'); // Hidden input for form
    const form = document.getElementById('wsRouletteForm');
    const numSegments = tickerSet.length;
    const segmentAngle = 360 / numSegments;

    // Dynamically create segments with logos
    tickerSet.forEach((ticker, index) => {
        const segment = document.createElement('div');
        segment.classList.add('segment');
        segment.style.transform = `rotate(${index * segmentAngle}deg)`; // Position segment around the wheel
        segment.style.position = 'absolute'; // Position each segment absolutely inside the wheel
        segment.style.width = '50%'; // Segment takes up half the width (fits inside the circle)
        segment.style.height = '50%'; // Adjust height for proper fit in the wheel
        segment.style.clipPath = 'polygon(50% 0%, 100% 100%, 0% 100%)'; // Clip the div to form a pie slice
        segment.style.backgroundColor = `hsl(${index * segmentAngle}, 100%, 50%)`;

        // Create a div for the logo
        const logo = document.createElement('div');
        logo.classList.add('wheel-logo');
        logo.style.width = '100%'; // Full width inside the segment
        logo.style.height = '100%'; // Full height inside the segment
        logo.style.backgroundSize = 'contain'; // Ensure the logo scales well
        logo.style.backgroundRepeat = 'no-repeat'; // No repeating of the logo
        logo.style.backgroundPosition = 'center'; // Center the logo in the segment
        logo.style.backgroundImage = `url('/ticklogos/${ticker}.png')`; // Set the logo background

        segment.appendChild(logo);
        wheel.appendChild(segment); // Add the segment to the wheel
    });

    // Spin functionality and form submission
    wheel.addEventListener('click', function(e) {
        e.preventDefault();  // Prevent form from submitting immediately

        const amountInput = document.getElementById('amount');
        const profitPInput = document.getElementById('profitP');

        // Check if form inputs are valid
        const amountValue = amountInput.value;
        const profitPValue = profitPInput.value;

        if (!amountValue || !profitPValue) {
            alert("Please fill in both the amount and profit percentage before spinning the wheel.");
            return;
        }

        // Add spinning class
        wheel.classList.add('spinning');

        // Remove any previous result
        tickerResult.style.display = 'none';

        // After 4 seconds of spinning, pick a random ticker
        setTimeout(() => {
            wheel.classList.remove('spinning');
            
            const randomTicker = tickerSet[Math.floor(Math.random() * tickerSet.length)];

            // Display the selected ticker
            tickerDisplay.textContent = randomTicker;
            tickerResult.style.display = 'block';

            // Set hidden form value
            selectedTickerInput.value = randomTicker;

            // Submit the form with the selected ticker
            form.submit();
        }, 4000); // Spin for 4 seconds
    });
});
