window.onload = () => {
    const audio = document.querySelector('audio');
    if(audio.paused) audio.play();
}