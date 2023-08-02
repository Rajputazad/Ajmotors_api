const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY;
const db = require("../database/models/login")
const dbcar = require("../database/models/CarDetails")
const upload = require("../middleware/Cars")
const imagekit = require("../middleware/imagekit")
const fs = require("fs")
const multer = require("multer");
const multe = require("multer")();
const auth = require("../middleware/auth")
module.exports = function (router) {

  router.post('/register',multe.any(), async (req, res) => {
    try {
      const mobile = req.body.mobile;
      const password = req.body.password;
      const existingUser = await db.findOne({ mobile });
      const pass = req.body.pass
      if (pass != 999849) {
        res.status(500).json({ success: false, message: 'User not valid' });

      } else {

        if (existingUser) {
          return res.status(409).json({ success: false, message: 'Email already exists' });
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);

          const creatusere = await db.create({
            mobile: mobile,
            password: hashedPassword,
            name: req.body.name,
            role_id: 1,
            verify: true,

          });
          const token = jwt.sign({ userid: creatusere._id }, SECRET_KEY, {
            expiresIn: "744h"
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
  router.post('/login',multe.any(), async (req, res) => {
    try {
      const mobile = req.body.mobile
      const password = req.body.password

      const user = await db.findOne({ mobile });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userid: user._id, role_id: user.role_id }, SECRET_KEY, {
        expiresIn: "2h"
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

// const dataPerPage = 2;
// let currentPage = 1;
  router.get('/cars/:page', async (req, res) => {
    try {
      const dataPerPage=10
    const skip = (req.params.page - 1) *10
      const cardatas = await dbcar.find().skip(skip).limit(dataPerPage).lean().exec();
      const reversedata = cardatas.reverse();
      //  currentPage++;
      res.status(200).json({ success: true, data: reversedata });
    } catch (error) {
      console.log(error);
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
      res.status(200).json({ success: true, message: "successfully Deleted!" });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  })

  router.put('/car/:_id', async (req, res) => {
    try {

      let update = await dbcar.findByIdAndUpdate(req.params._id, { $set: req.body })
      res.status(200).json({ success: true, message: "successfully updated!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  })






  router.post('/upload', async (req, res) => {
    try {
      upload(req, res, function (err) {
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
        console.log(files);

        Promise.all(
          files.map((file) => {
            return new Promise((resolve, reject) => {
              const fileStream = fs.createReadStream(file.path);

              imagekit.upload(
                {
                  file: fileStream,
                  fileName: file.originalname,
                  folder: "/Uday_Motors",
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
        ).then(async function (results) {

            const data = await dbcar(req.body)
            data.imagedetails = results
            await data.save()
            console.log(results);
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


  router.get("/search/:search", async (req, res) => {
		try {
			let search=req.params.search
			let users = await dbcar.find(
				{
					"$or": [{ "carname": { $regex: search,$options:"i" } },
					{ "numberplate": { $regex:  search,$options:"i" } },
					{ "price": { $regex:  search,$options:"i" } }
					]
				}
				,);
        const reversedata = users.reverse();
			res.json({ success: true, data: reversedata });


		} catch (error) {
			res.json({ success: false, message: "something went wrong" });
			console.log(error);
		}
	});



  return router
}