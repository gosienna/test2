//function to get the iris segmentation and get edge
function predict(){


      function compute(source,output,edge,img_background){
            //clear the marker
            let x = tf.browser.fromPixels(img_background).asType('float32');
            //run the model
            scal=tf.scalar(1/255,'float32');
            x=tf.mul(x,scal);
            x=tf.expandDims(x,0);
            //function to draw the segmentation result
            async function draw(y){
                     y=tf.squeeze(y,0);
                     await tf.browser.toPixels(y,document.getElementById(output));
                     get_edge(output,edge);
                     find(edge);

            }

            async function calculate(x,draw){
                  y=await model.predict(x);
                  draw(y,get_edge);
            };

            calculate(x,draw);
      }
      var message=document.getElementById("status2");
      message.style.visibility="visible";
      //clear up canvas before drawing

      compute("left_eye","output_L","edge_L",img_left_background);

}
