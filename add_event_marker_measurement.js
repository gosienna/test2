function add_event_marker_measurement(target){

    if(target=="left_eye"){
      count_L=0;
      temp_r_L=0.0;
      c_L.removeEventListener('mousemove',draw_circle_L);
      c_L.removeEventListener('click',capture_circle_L);
      c_L.addEventListener('mousemove',draw_circle_L);
      c_L.addEventListener('click',capture_circle_L);
    }else if(target=="marker"){
      count_M=0;
      c_M.removeEventListener('click', capture_M);
      c_M.addEventListener('click', capture_M);
    }


}
function capture_M(event){

  x = event.layerX;
  y = event.layerY;
  //console.log(count);
  if(count_M==0){
    count_M=count_M+1;
    ctx_M.putImageData(img_marker_background,0,0)
    ctx_M.beginPath();
    ctx_M.moveTo(x, y-20);
    ctx_M.lineTo(x, y+20);
    ctx_M.strokeStyle = "#77f022";
    ctx_M.stroke();
    margin_L=x;

  }else if(count_M==1){
    count_M=0;

    ctx_M.beginPath();
    ctx_M.moveTo(x, y-20);
    ctx_M.lineTo(x, y+20);
    ctx_M.strokeStyle = "#77f022";
    ctx_M.stroke();
    margin_R=x;
    pixel_to_mm=Math.abs(10/(margin_R-margin_L));

    //Trigger point: reveal  the button for image processing
    var button_measure=document.getElementById("button_measure");
    button_measure.style.visibility="visible"
  }

}
//count_L==0 : mark first circle point
//       ==1 : mark second circle point
//       ==2 : draw circle on move, capture radius on click



function capture_circle_L(event){

  if(count_L==0){
    x1=event.layerX;
    y1=event.layerY;
    //draw first mark over iris edge
    ctx_L.beginPath();
    ctx_L.arc(x1,y1, 2, 0, 2 * Math.PI);
    ctx_L.fillStyle =  "#77f022";
    ctx_L.fill();

    count_L=count_L+1;

  }else if(count_L==1){
    x2=event.layerX;
    y2=event.layerY;
    //draw first mark over iris edge
    ctx_L.beginPath();
    ctx_L.arc(x2,y2, 2, 0, 2 * Math.PI);
    ctx_L.fillStyle =  "#77f022";
    ctx_L.fill();

    xm=(x1+x2)/2;
    ym=(y1+y2)/2;
    count_L=count_L+1;
    //console.log(x_p_L,y_p_L,count_L)
  }else if(count_L==2){
    count_L=count_L+1;
  }else if(count_L==3){
    mannual_MRD_L=yc-event.layerY;
    count_L=0
  }

}


function draw_circle_L(event){

  if(count_L==2){
  ctx_L.putImageData(img_left_background,0,0)

  yc=event.layerY;
  xc=-(yc-ym)*(y2-y1)/(x2-x1)+xm

  mannual_r_L=Math.pow(Math.pow((x1-xc),2)+Math.pow((y1-yc),2),0.5);
  //draw circumfrence
  ctx_L.beginPath();
  ctx_L.arc( xc,yc,mannual_r_L, 0, 2 * Math.PI);
  ctx_L.strokeStyle = "#77f022";
  ctx_L.stroke();

  //draw circle heart
  ctx_L.beginPath();
  ctx_L.arc(xc,yc, 4, 0, 2 * Math.PI);
  ctx_L.fillStyle =  "#77f022";
  ctx_L.fill();
}else if(count_L==3){
  //redraw circumfrence and circle heart
  //backgrounad
  ctx_L.putImageData(img_left_background,0,0)
  //circumfrence
  ctx_L.beginPath();

  ctx_L.arc(xc,yc,mannual_r_L, 0, 2 * Math.PI);
  ctx_L.strokeStyle = "#77f022";
  ctx_L.stroke();
  //heart
  ctx_L.beginPath();
  ctx_L.arc(xc,yc, 4, 0, 2 * Math.PI);
  ctx_L.fillStyle =  "#77f022";
  ctx_L.fill();

  //draw MRD line
  ctx_L.beginPath();
  ctx_L.moveTo(xc, yc);
  ctx_L.lineTo(xc, event.layerY);
  ctx_L.strokeStyle = "#77f022";
  ctx_L.stroke();
  }
}
//function to reset all measurement value
function reset_iris(){
  ctx_L.putImageData(img_left_background,0,0)
  count_L=0;

  var button_measure=document.getElementById("button_measure");
  button_measure.style.visibility="hidden"
}

function reset_marker(){
  ctx_M.putImageData(img_marker_background,0,0)
  count_M=0;

  var button_measure=document.getElementById("button_measure");
  button_measure.style.visibility="hidden"
}
