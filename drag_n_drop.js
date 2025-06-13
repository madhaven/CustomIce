// Drag-n-Drop support

let blurState = false;
const body = document.body;
const dropHint = document.getElementById('drop_hint');
const dropInvalid = document.getElementById('drop_invalid');
const textArea = document.getElementById('css_input');
const fileDropArea = document.getElementById('file_drop_area');
const errorDuration = 2000;

function toggleBlur(state) {
    if (state === undefined) state = !blurState;
    if (state === blurState) return;
    blurState = state;
    fileDropArea.classList.toggle('active', blurState);
    dropHint.style.display = blurState ? 'block' : 'none';
}

function handleFileDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
        const file = files[0];
        if (file.type === 'text/css' || file.name.endsWith('.css')) {
            const reader = new FileReader();
            reader.onload = evt => {
                toggleBlur(false);
                // TODO: finalize file management strategy
                // textArea.value = evt.target.result;
            };
            reader.readAsText(file);
        } else {
            var bg = fileDropArea.style.backgroundColor;
            fileDropArea.style.backgroundColor = "var(--error-bg)";
            dropInvalid.style.display = "block";
            dropHint.style.display = "none";
            setTimeout(() => {
                fileDropArea.style.backgroundColor = bg;
                dropInvalid.style.display = "none";
                dropHint.style.display = "block";
                toggleBlur(false);
            }, errorDuration);
        }
    }
}

body.addEventListener('dragover', e => {
    e.preventDefault();
    toggleBlur(true);
});

body.addEventListener('dragleave', () => toggleBlur(false));

body.addEventListener('drop', handleFileDrop);