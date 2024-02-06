// 
// SPECIFY REFRESH TIME HERE :))
// 
const updateTime = 35;

document.getElementById('fileIn').addEventListener('change', function() {
    const file = this.files[0];
    const audioPlayer = document.getElementById('aPlayer');
    const audioContext = new AudioContext();
    const reader = new FileReader();

    reader.onload = (e) => {
        audioContext.decodeAudioData(e.target.result, function (buffer) {
            const audioBufferSource = audioContext.createBufferSource();
            audioBufferSource.buffer = buffer;
            audioBufferSource.connect(audioContext.destination);
            audioPlayer.src = URL.createObjectURL(file);
            audioPlayer.play();
            getAudioData(audioContext, audioPlayer);
        });
    };
    reader.readAsArrayBuffer(file);
});

const getAudioData = (audioContext, audioPlayer) => {
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    const dataArray = new Uint8Array(6 * 6);
    const source = audioContext.createMediaElementSource(audioPlayer);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const updateData = () => {
        analyser.getByteTimeDomainData(dataArray); 
        let result = []
        for (let i = 0; i < 6; i++) {
            const startIndex = i * 6;
            const endIndex = (i + 1) * 6;
            const rowSum = dataArray.slice(startIndex, endIndex).reduce((acc, val) => acc + val, 0);
            const rowAverage = Math.round((rowSum / 6), 0);
            result.push(rowAverage)
        }
        audioArray = result.slice()
        
        result.forEach((strength, index) => {
            switch (true) {
                case strength >= 228:
                    LightBox(index + 1, 6);
                    break;
                case strength >= 208:
                    LightBox(index + 1, 5);
                    break;
                case strength >= 188:
                    LightBox(index + 1, 4);
                    break;
                case strength >= 168:
                    LightBox(index + 1, 3);
                    break;
                case strength >= 148:
                    LightBox(index + 1, 2);
                    break;
                case strength > 127:
                    LightBox(index + 1, 1);
                    break;
                default:
                    // Do nothing
                    break;
            }
        });

        document.getElementById("data-span").innerText = String(result)
        setTimeout(updateData, updateTime);
    };
    updateData();
}

const LightBox = (row, amount) => {
    const boxes = document.querySelectorAll('.box');
    const boxesArray = Array.from(boxes); 
    const startIndex = (row - 1) * 6; 
    const endIndex = startIndex + 6; 
    const rowBoxes = boxesArray.slice(startIndex, endIndex);

        
    for (let i = 0; i < 6; i++) {
        if (i < rowBoxes.length) {
            rowBoxes[i].classList.remove('active');
        }
    }

    for (let i = 0; i < amount; i++) {
        if (i < rowBoxes.length) {
            rowBoxes[i].classList.add('active');
        }
    }
};
