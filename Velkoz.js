<!DOCTYPE html>
<html>
<head>
<script>
function Point (x, y) {
        this.x = x;
        this.y = y;
}

Point.prototype.scalarProduct = function(b){
        return thix.x * b.x + this.y * b.y;
}

Point.prototype.sum = function(b){
        return new Point(this.x + b.x, this.y + b.y);
}

Point.prototype.div = function(n){
        if(n == 0){
                throw "Division by zero.";
        }

        return this.mult(1/n);
}

Point.prototype.mult = function(n){
        return new Point(this.x * n, this.y * n);
}

function Vector(a, b) {
        this.a = a;
        this.b = b;
}

Point.prototype.getNorme = function(n){
        return Math.pow(Math.pow(Math.abs(this.x), n) + Math.pow(Math.abs(this.y), n) ,1/n);
}

Point.prototype.getOrientation = function(){
        var pt = new Point(this.x, this.y);
        norme = this.getNorme(2);
        if(norme > 0){
                return this.div(norme);
        }

        return this;
}

Point.prototype.rotate = function(centre, angle){
        return new Point((this.x - centre.x) * Math.cos(angle) - (this.y - centre.y) * Math.sin(angle) + centre.x, (this.x - centre.x) * Math.sin(angle) + (this.y - centre.y) * Math.cos(angle) + centre.y);
}

Point.prototype.display = function(canvasId, style, lineWidth){

        var o1 = new Point(this.x - 0.3, this.y);
        var o2 = new Point(this.x + 0.3, this.y);

        var o3 = new Point(this.x, this.y - 0.3);
        var o4 = new Point(this.x, this.y + 0.3);

    var v1 = new Vector(o1, o2);
    var v2 = new Vector(o3, o4);

        return (v1.display(canvasId, style, lineWidth, true) && v2.display(canvasId, style, lineWidth, true));
}

Point.prototype.getPerpendicular = function(){
        return new Point(-this.y, this.x);
}

Point.prototype.toVector = function(){
        var O = new Point(0, 0);
        return new Vector(O, this);
}

Vector.prototype.toPoint = function(){
        return new Point(this.a.x - this.b.x, this.a.y - this.b.y);
}

Vector.prototype.sum = function(v2){
        return new Vector(this.a, this.b.sum(v2.toPoint()));
}

Vector.prototype.translate = function(v2, ratio){
        if(typeof ratio == "undefined"){
                ratio = 1;
        }

        var A = v2.toPoint();

        return new Vector(this.a.sum(A.mult(ratio)), this.b.sum(A.mult(ratio)));
}

Vector.prototype.scalarProduct = function(b){
        return this.toPoint().scalarProduct(b.toPoint());
}

Vector.prototype.getNorme = function(n){
        return this.toPoint().getNorme(n);
}

Vector.prototype.getOrientation = function(){
        return this.toPoint().getOrientation().toVector();
}

Vector.prototype.getPerpendicular = function(){
        return this.toPoint().getPerpendicular().toVector();
}

Vector.prototype.rotate = function(centre, angle){
        return new Vector (this.a.rotate(centre, angle), this.b.rotate(centre, angle));
}

Vector.prototype.getStartingLine = function(){
        var p = this.getOrientation().getPerpendicular().toPoint().mult(1/2).toVector();
        return p.translate(p, 1/2).translate(this.a.toVector(), -1);
}

Vector.prototype.getArrow = function(){
        var p = this.getOrientation().toPoint().mult(1/4).toVector().translate(this.b.toVector(), -1);
        p = p.translate(p, 1);
        var p1 = p.rotate(this.b, Math.PI/4);
        var p2 = p.rotate(this.b, -Math.PI/4);
        return [p1, p2];
}

Vector.prototype.display = function(canvasId, style, lineWidth, asLine){

          var ctx = getCanvasCtx(canvasId);

    ctx.lineWidth = lineWidth;

        var w = canvas.getAttribute("width");
        var h = canvas.getAttribute("height");

    ctx.strokeStyle = style;

          ctx.beginPath();
          ctx.moveTo(w/2 + (this.a.x * w/20), h/2 + (this.a.y * h/20));
          ctx.lineTo(w/2 + (this.b.x * w/20), h/2 + (this.b.y * h/20));
    ctx.stroke();

        if(!asLine){
                this.getStartingLine().display(canvasId, style, lineWidth, true);

                this.getArrow().forEach(function(v){
                        v.display(canvasId, style, lineWidth, true);
                });
        }

        return true;
}

function getCanvasCtx(id){
        var canvas = document.getElementById(id);
        return canvas.getContext("2d");
}

function disp(n, ratio, dir, normi, canvasId, style, lineWidth){
        var o = new Point(0, 0);
        var a = new Point(1, 1);

    o.display(canvasId, "blue", 2, true);

    dir = dir.getOrientation();

    if(ratio != 1){
            var r = Math.pow(ratio, 2);
            var m = normi * (1 - Math.pow(r, (n+4)/2))/(1 - r);
    }
    else{
            var m = normi * (n + 2) / 2
    }

        dir.mult(m).toVector().display(canvasId, "blue", 2, false);

        var vs = [dir.mult(normi).toVector()];//, pi.mult(-1).toVector()];
        return disp_core(vs, n, ratio, canvasId, style, n, lineWidth);
}

function disp_core(Vects, n, ratio, canvasId, style, N, lineWidth){
        if(n < 0){
                return true;
        }

        Vects.forEach(        function(v){
                                                v.display(canvasId, style, n*lineWidth/N, false);
                                                var B = v.b.mult(-1).toVector();
                                                var p = v.toPoint().getPerpendicular().mult(ratio);
                                                var p1 = p.toVector().translate(B, 1);
                                                var p2 = p.mult(-1).toVector().translate(B, 1);
                                                var vs = [p1, p2];
                                                return disp_core(vs, (n-1), ratio, canvasId, style, N, lineWidth);
                                        });
}

function test(){
        var O = new Point(0, 0);
    var P = new Point(4, 1);
    var Q = new Point(5, 3);
    var V = new Vector(P, Q);

    O.display('canvas', 'black', 1);
    return V.display('canvas', 'black', 1, false);
}

var cursorX;
var cursorY;
document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}
setInterval(checkCursor, 1);
function checkCursor(){

    var ctx = getCanvasCtx('canvas');
        var w = canvas.getAttribute("width");
        var h = canvas.getAttribute("height");
    ctx.clearRect(0, 0, w, h);

        //var D = new Point(cursorX-347, cursorY-347);
        var d = new Date();
        var a = d.getTime();
        var D = new Point(Math.cos(a/2000), Math.sin(a/1011));
    	disp(8, 1, D, D.getNorme(2), 'canvas', 'black', 4);
}

</script>
</head>
<body onload="//var D = new Point(1, 1); disp(5, 0.90, D, 4, 'canvas', 'black', 4);">

<canvas id="canvas" width="670" height="670" style="border-width:2px;border-style: solid;"></canvas>
<br>
<button type="button" onclick="disp(10, 1, new Point(1, 1), 1, 'canvas', 'black', 4)">Dessine</button>

</body>
</html>
