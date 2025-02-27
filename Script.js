body {
    font-family: Arial, sans-serif;
    background-color: #1a1a1a;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.editor {
    display: flex;
    background: #333;
    padding: 10px;
    border-radius: 10px;
}

.sidebar {
    width: 200px;
    background: #222;
    padding: 10px;
    border-radius: 5px;
}

.workspace {
    flex-grow: 1;
    text-align: center;
}

canvas {
    background: black;
    border: 1px solid white;
}

.controls {
    display: flex;
    flex-direction: column;
    padding: 10px;
}

button {
    background: #444;
    color: white;
    border: none;
    padding: 10px;
    margin-top: 10px;
    cursor: pointer;
}
