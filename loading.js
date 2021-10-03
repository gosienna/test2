
//load model
async function load_model(){
       model = await tf.loadLayersModel('../model/model.json');
       msg();

     }
