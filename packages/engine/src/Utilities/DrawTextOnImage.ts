let text_title ="Overlay text";
let imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);
let canvas : HTMLCanvasElement = document.getElementById('imageCanvas');
let ctx = canvas.getContext('2d');
let img = new Image();
img.crossOrigin="anonymous";

function DrawOverlay(img) {
    ctx.drawImage(img,0,0);
    ctx.fillStyle = 'rgba(30, 144, 255, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function DrawText() {
    ctx.fillStyle = "white";
    ctx.textBaseline = 'middle';
    ctx.font = "50px 'Montserrat'";
    ctx.fillText(text_title, 50, 50);
}

function DynamicText(img) {
  document.getElementById('name').addEventListener('keyup', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    DrawOverlay(img);
    DrawText(); 
    text_title = this.value;
    ctx.fillText(text_title, 50, 50);
  });
}

function handleImage(e) {
    let reader = new FileReader();
    let img = "";
    let src = "";
    reader.onload = function(event) {
        img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
        src = event.target.result;
        canvas.classList.add("show");
        DrawOverlay(img);
        DrawText(); 
        DynamicText(img);   
    }

    reader.readAsDataURL(e.target.files[0]); 
 
}

function convertToImage() {
	window.open(canvas.toDataURL('png'));
}