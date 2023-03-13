const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY;
const db = require("../database/models/login")
const dbcar = require("../database/models/CarDetails")
const upload = require("../middleware/Cars")
const imagekit = require("../middleware/imagekit")
const fs =require("fs")
const multer = require("multer");
const auth = require("../middleware/auth")
module.exports = function (router) {

    router.post('/register', async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const existingUser = await db.findOne({ email });
            const pass =req.body.pass
if(pass!=497224){
  res.status(500).json({ success: false, message: 'User not valid' });

}else{

            if (existingUser) {
                return res.status(409).json({ success: false, message: 'Email already exists' });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);

                const creatusere = await db.create({
                    email: email,
                    password: hashedPassword,
                    name: req.body.name,
                    role_id: 1,
                    verify: false,
                    
                });
                const token = jwt.sign({ userid: creatusere._id }, SECRET_KEY, {
                    expiresIn: "24h"
                })
                creatusere.token[0] = token
                await creatusere.save();
                res.status(200).json({ token: token, success: true, message: 'User registered successfully' });

            }
}
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    });
    router.post('/login', async (req, res) => {
        try {
            const email = req.body.email
            const password = req.body.password

            const user = await db.findOne({ email });
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userid: user._id, role_id: user.role_id }, SECRET_KEY, {
                expiresIn: "24h"
            });
           


            user.token[0] = token
            await user.save();
            res.status(200).json({ token: token, success: true, message: 'User Login successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });

        }
    });

    router.get('/home', auth, async (req, res) => {
        try {
            const userid = req.decoded.userid;
            const userdatas = await db.findById(userid).select("-password -token");;
            res.status(200).json({ success: true, data: userdatas });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    })


    router.get('/cars', async (req, res) => {
        try {
           
            const cardatas = await dbcar.find()
            res.status(200).json({ success: true, data: cardatas });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    })


    router.get('/car/:_id', async (req, res) => {
        try {
           
            const cardatas = await dbcar.findById(req.params._id)
            res.status(200).json({ success: true, data: cardatas });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    })

    router.delete('/car/:_id', async (req, res) => {
        try {
           
            const cardatas = await dbcar.findByIdAndDelete(req.params._id)
            res.status(200).json({ success: true, message:"successfully Deleted!" });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    })

    router.put('/car/:_id', async (req, res) => {
        try {
           
          let update = await dbcar.findByIdAndUpdate(req.params._id,{$set:req.body})
              res.status(200).json({ success: true, message:"successfully updated!" });
        } catch (error) {
          console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    })


  



    router.post('/upload', async (req, res) => {
        try {
            upload(req, res,   function (err) {
                if (err instanceof multer.MulterError) {
                  return res.status(400).json({
                    message: "There was an error uploading the files",
                  });
                } else if (err) {
                  return res.status(400).json({
                    message: err.message,
                  });
                }
            
                const files = req.files;
            
                Promise.all(
                  files.map((file) => {
                    return new Promise((resolve, reject) => {
                      const fileStream = fs.createReadStream(file.path);
            
                      imagekit.upload(
                        {
                          file: fileStream,
                          fileName: file.originalname,
                          folder: "/Anali_Motors",
                        },
                        function (error, result) {
                          if (error) {
                            reject(error);
                          } else {
                            resolve(result);
                          }
                        }
                      );
                    });
                  })
                )
                  .then(async function (results )  {

const data = await dbcar(req.body)
data.imagedetails=results
await data.save()
                    return res.status(200).json({
                      message: "Data uploaded successfully",
                      results: results,
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                    return res.status(400).json({
                      message: "There was an error uploading the files",
                    });
                  });
              });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    })


    return router
}