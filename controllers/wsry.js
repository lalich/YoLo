document.addEventListener('DOMContentLoaded', function () {
    const tickerSet = ['AAPL', 'BRK', 'GOOGL', 'AMZN', 'META', 'INTC', 'CLOV', 'KOSS', 'GME', 'BB', 'CVX', 'XOM', 'JD', 'NIO', 'BABA', 'MSFT', 'TSLA', 'NVDA', 'HD', 'PG', 'KO', 'COST', 'MSTR', 'MCD', 'NFLX', 'GM', 'AMD', 'TMUS', 'NKE', 'DIS', 'RTX', 'BA', 'CAT', 'UNP', 'TM', 'TSM', 'SPY', 'QQQ', 'PLTR'];

    const wheel = document.getElementById('wheel');
    const spinButton = document.getElementById('spinButton');
    const tickerResult = document.getElementById('tickerResult');
    const tickerDisplay = document.getElementById('ticker');
    const selectedTickerInput = document.getElementById('selectedTicker');  // Hidden input for form
    const form = document.getElementById('wsRouletteForm');
    const numSegments = tickerSet.length;
    const segmentAngle = 360 / numSegments;

    // Dynamically create segments with logos
    tickerSet.forEach((ticker, index) => {
        const segment = document.createElement('div');
        segment.classList.add('segment');
        segment.style.transform = `rotate(${index * segmentAngle}deg)`;
        segment.style.backgroundColor = `hsl(${index * segmentAngle}, 100%, 50%)`;

        const logo = document.createElement('div');
        logo.classList.add('wheel-logo');
        logo.style.backgroundImage = `url('/ticklogos/${ticker}.png')`;

        segment.appendChild(logo);
        wheel.appendChild(segment);
    });

    // Spin functionality and form submission
    spinButton.addEventListener('click', function() {
        spinButton.disabled = true; // Disable button while spinning
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
        }, 4000);
    });
});
