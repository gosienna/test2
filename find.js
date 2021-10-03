function find(edge){
    // get points' coodinates
    var points=[]
    var canvas = document.getElementById(edge);
    var context = canvas.getContext('2d');
    for(x=0;x<300;x++){
      for(y=0;y<200;y++){
        var v=context.getImageData(x, y, 1, 1).data[1]
        if(v==255){
          p=[x,y]
          points.push(p);
        }
      }
    }
    // screen through all the points to find the left most point and right most point
    var len=points.length;
    var x_list=[];
    var p_left=[]
    var p_right=[]
    for(var i=0;i<len;i++){
       x_list.push(points[i][0]);
    }
    var x_max=Math.max(...x_list)
    var x_min=Math.min(...x_list)
    var max_index=x_list.indexOf(x_max)
    var min_index=x_list.indexOf(x_min)

    p_left.push(points[min_index][0]);
    p_left.push(points[min_index][1]);
    // show the right most point
    p_right.push(points[max_index][0]);
    p_right.push(points[max_index][1]);
    context.fillStyle = "red";
    context.fillRect(p_right[0],p_right[1],3,3)
    //show the left most point
    p_left.push(points[min_index][0]);
    p_left.push(points[min_index][1]);
    context.fillStyle = "red";
    context.fillRect(p_left[0],p_left[1],3,3)

    CIRCLEFIT.resetPoints(); //clear all the points in the CIRCLEFIT
    var points_left=[];
    //screen through all points and get the points that is within 8 pixels right to the left most points
    for(var i=0;i<len;i++){
      if(points[i][0]-p_left[0]<8 && points[i][1]-p_left[1]>0){
        points_left.push(points[i]);
        CIRCLEFIT.addPoint(points[i][0],points[i][1]) //feed the points to the CIRCLEFIT function
      }
    }
    //show the points of left over the canvas
    var len_l=points_left.length;
    for(i=0;i<len_l;i++){
      x=points_left[i][0];
      y=points_left[i][1];
      context.fillRect(x,y,1,1)

    }

    var points_right=[];
    //screen through all points and get the points that is within 8 pixels left to the right most points
    for(var i=0;i<len;i++){
      if(p_right[0]-points[i][0]<8 && points[i][1]-p_left[1]>0){
        points_right.push(points[i]);
        CIRCLEFIT.addPoint(points[i][0],points[i][1]) //feed the points to the CIRCLEFIT function
      }
    }

    //show the points of right over the canvas
    var len_2=points_right.length;
    for(i=0;i<len_2;i++){
      x=points_right[i][0];
      y=points_right[i][1];
      context.fillRect(x,y,1,1)
    }
    //compute the iris circle
    var result=CIRCLEFIT.compute();

    //console.log("Center = {" + result.center.x + "," + result.center.y + "}, Radius = " + result.radius);
    context.strokeStyle = "red";
    context.arc(result.center.x, result.center.y, result.radius, 0, 2 * Math.PI);
    context.stroke();

    //calculate MRD
    var x=Math.trunc(result.center.x);
    var y=Math.trunc(result.center.y);
    var r=Math.trunc(result.radius);

    //draw circle heart
    context.beginPath();
    context.arc(x,y, 4, 0, 2 * Math.PI);
    context.fillStyle =  "red";
    context.fill();

    var top=[]
    for(i<0;i<len;i++){
      if(points[i][0]==x){
        top.push(points[i][0]);
        top.push(points[i][1]);
      }
    }
    if(edge=="edge_L"){
      MRD_L=(y-top[1])*pixel_to_mm
      MRD_L=MRD_L.toFixed(2);
    }else if(edge=="edge_R"){
      MRD_R=(y-top[1])*pixel_to_mm
      MRD_R=MRD_R.toFixed(2);
    }

    var c_final = document.getElementById("final_report");
    var ctx_final = c_final.getContext('2d');
    //clear the canvas before outputing result
    ctx_final.fillStyle =  "black";
    ctx_final.fillRect(0, 200, 600, 200);
    //get imagedata from meausred data
    var c_L=document.getElementById("left_eye");
    var ctx_L=c_L.getContext('2d');
    var img_L=ctx_L.getImageData(0,0,300,200)
    ctx_final.putImageData(img_L,0,0);
    //draw circle heart , auto
    ctx_final.beginPath();
    ctx_final.arc(x,y, 4, 0, 2 * Math.PI);
    ctx_final.fillStyle =  "red";
    ctx_final.fill();
    //draw MRD line
    ctx_final.beginPath();
    ctx_final.moveTo(x, y);
    ctx_final.lineTo(top[0], top[1]);
    ctx_final.strokeStyle = "red";
    ctx_final.stroke();
    //draw measurement result
    ctx_final.font = "18px Arial";
      //file file name
    ctx_final.fillStyle = "white";
    ctx_final.fillText("File ID: "+file_name,50,250)

    ctx_final.fillStyle = "red";
       //Automatic MRD
    ctx_final.fillText("Automatic MRD: "+MRD_L.toString()+" mm",50,270)
    ctx_final.fillStyle = "#77f022";
    mannual_MRD_L=mannual_MRD_L*pixel_to_mm;
    mannual_MRD_L=mannual_MRD_L.toFixed(2);
       //manual MRD
    ctx_final.fillText("Manual MRD: "+mannual_MRD_L.toString()+" mm",50,290)
    iris_diameter=2*mannual_r_L*pixel_to_mm;
    iris_diameter=iris_diameter.toFixed(2);
       //mannual measured diameter of iris
    ctx_final.fillStyle = "white";
    ctx_final.fillText("Mannual Measured Iris Diameter: "+iris_diameter.toString()+" mm",50,310)
    //draw img_marker_background
    var img_marker=ctx_M.getImageData(0,0,c_M.width,c_M.height);
    ctx_final.putImageData(img_marker,300,0);


    msg2();
    var button_measure=document.getElementById("button_save");
    button_measure.style.visibility="visible"


}
