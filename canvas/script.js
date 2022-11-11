
var canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
// ctx.imageSmoothingQuality = 'high';
canvas.width = 100;
canvas.height = 20;
console.log(window)
window.api.getData((event, { data, color }) => {
    
    window.api.sendGraph( drawGraph(data, color) );
  });   

function drawGraph(data, color) {
    // console.log(data);
    canvas.width = data.PerCore?.length * 5 || 50;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = color;
    for (let i in data.PerCore) {
      ctx.fillRect(i*5, canvas.height, 4, -(+data.PerCore[i].utilization ?? 0)/2)
    }
    
    return canvas.toDataURL('image/png', 1);
  }