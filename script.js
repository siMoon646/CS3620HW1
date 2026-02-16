document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    let prevMouseX,
        prevMouseY,
        snapshot,
        isDrawing = false,
        selectedTool = "pen",
        brushWidth = document.querySelector("#size-slider").value;
    let fillShapes = document.querySelector("#fill-shapes").checked;

    function initializeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        setCanvasBackground();
    }

    function setCanvasBackground() {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawPen(e) {
        console.log(e.offsetX, e.offsetY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }

    function drawPoly(e, prevX, prevY, sides) {
        // finding the angle difference between each vertex of the polygon:
        const angleDifference = (2 * Math.PI) / sides;

        // allows the user to drag the cursor to customize the size of the polygon.
        let centerX = (e.offsetX + prevX) / 2,
            centerY = (e.offsetY + prevY) / 2,
            radius = Math.sqrt(Math.pow(centerX - e.offsetX, 2) + Math.pow(centerY - e.offsetY, 2));
        
        // begin drawing the figure.
        ctx.beginPath();

        // establishes the first vertex of the polygon, the first vertex being to the right, at angle 0.
        ctx.moveTo(centerX + radius * Math.cos(0), centerY + radius * Math.sin(0));

        // loop for the number of sides there are:
        for (let i = 1; i <= sides; i++) {
            ctx.lineTo(
                centerX + radius * Math.cos(i * angleDifference),
                centerY + radius * Math.sin(i * angleDifference),
            );
        }

        ctx.closePath();
        ctx.stroke();

        if (fillShapes) {
            // console.log("filling");
            ctx.fillStyle = document.querySelector("#color-picker").value;
            ctx.fill();
        } else {
            return;
        }
    }

    function drawRectangle(e) {
        // console.log("drawing rectangle");
        drawPoly(e, prevMouseX, prevMouseY, 4);
    }

    function drawCircle(e) {
        // console.log("drawing circle");
        drawPoly(e, prevMouseX, prevMouseY, 360);
    }

    function drawTriangle(e) {
        // console.log("drawing triangle");
        drawPoly(e, prevMouseX, prevMouseY, 3);
    }

    function drawPentagon(e) {
        //console.log("drawing pentagon");
        drawPoly(e, prevMouseX, prevMouseY, 5);
    }

    function drawHexagon(e) {
        //console.log("drawing hexagon");
        drawPoly(e, prevMouseX, prevMouseY, 6);
    }

    function drawOctagon(e) {
        //console.log("drawing octagon");
        drawPoly(e, prevMouseX, prevMouseY, 8);
    }

    function startDraw(e) {
        // console.log("drawing started");
        isDrawing = true;
        prevMouseX = e.offsetX;
        prevMouseY = e.offsetY;
        ctx.beginPath();
        ctx.lineWidth = brushWidth/3;
        ctx.strokeStyle = document.querySelector("#color-picker").value;
        ctx.fillStyle = ctx.strokeStyle;
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    function draw(e) {
        if (!isDrawing) return;
        ctx.putImageData(snapshot, 0, 0); // Restore the previous state
        console.log(selectedTool);
        switch (selectedTool) {
            case "pen":
                drawPen(e);
                break;
            case "rectangle":
                drawRectangle(e);
                break;
            case "circle":
                drawCircle(e);
                break;
            case "triangle":
                drawTriangle(e);
                break;
            case "pentagon":
                drawPentagon(e);
                break;
            case "hexagon":
                drawHexagon(e);
                break;
            case "octagon":
                drawOctagon(e);
                break;
        }
    }

    function handleToolSelection(e) {
        const activeTool = document.querySelector(".options .active");
        if (activeTool) activeTool.classList.remove("active");
        e.currentTarget.classList.add("active");
        selectedTool = e.currentTarget.id;
    }

    function handleSliderChange() {
        brushWidth = document.querySelector("#size-slider").value;
    }

    function handleColorChange() {
        const colorPicker = document.querySelector("#color-picker");
        colorPicker.style.background = colorPicker.value;
    }

    function handleClearCanvas() {
        // console.log("clearing");
        ctx.clearRect(0,0,canvas.width,canvas.height);
        setCanvasBackground();
    }

    function handleFillShapesChange() {
        fillShapes = document.querySelector("#fill-shapes").checked;
    }

    document
        .querySelectorAll(".tool")
        .forEach((btn) => btn.addEventListener("click", handleToolSelection));
    document
        .querySelector("#size-slider")
        .addEventListener("change", handleSliderChange);
    document
        .querySelector("#color-picker")
        .addEventListener("change", handleColorChange);
    document
        .querySelector(".clear-canvas")
        .addEventListener("click", handleClearCanvas);
    document
        .querySelector("#fill-shapes")
        .addEventListener("change", handleFillShapesChange);
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", () => (isDrawing = false));

    initializeCanvas();
});
