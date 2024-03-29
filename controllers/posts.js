const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Checkin = require("../models/Checkin");
const Intake = require("../models/Intake");
const Contact = require("../models/Contact");
const { create } = require("connect-mongo");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    console.log("Current User:", req.user);
    try {
      const posts = await Post.find({ user: req.user.id });
      const intake = await Intake.find({ user: req.user.id});
      console.log('This is intake:', intake, intake.length);
      let name;

      if (req.user.fullName === 'unknown'){
        name = req.user.userName;
      } else {
        name = req.user.fullName;
      }

      if (intake.length < 1){
        console.log('WOo', req.user.userName, typeof req.user.userName)

        res.render("profileTwo.ejs", { posts: posts, user: req.user, name: name, todaysDate: 'Please complete Initial Intake', countdownDate: 'Incomplete',  countdownStart: 'Incomplete', intake: 'incomplete'});
      } else {
        console.log('Yay')
        const todaysDate = new Date().toString().slice(0,15);
        const countdownStart = new Date(intake[0].startdate);
        const countdownDate = new Date(countdownStart.setDate(countdownStart.getDate() + 10)).toString().slice(0,15);
        console.log(intake[0].startdate, countdownStart, countdownDate)
        res.render("profileTwo.ejs", { posts: posts, user: req.user, name: name, intake: intake, countdownDate: countdownDate,  countdownStart: intake[0].startdate, todaysDate: todaysDate});
      }
    } catch (err) {
      console.log(err);
    }
  },
  // Controller to get healthcare worker profile
  getProfileNurse: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      const assignedPatients = await User.find({ assignedNurseId: req.user.id});
      const todaysDate = new Date().toString().slice(0,15);
      console.log('Assigned patients,', assignedPatients);

        let name;

        if (req.user.fullName === 'unknown'){
          name = req.user.userName;
        } else {
          name = req.user.fullName;
        }

      res.render("profileNurse.ejs", { posts: posts, user: req.user, name: name, todaysDate: todaysDate, patientList: assignedPatients});
      
    } catch (err) {
      console.log(err);
    }
  },
  getInitial: async (req, res) => {
    try {
      res.render("initial.ejs", {user: req.user});
    }catch (err) {
      console.log(err);
    }
  },
  getCheckin: async (req,res) => {
    try{
      res.render("checkin.ejs", {user: req.user});
      console.log(req.user)
    }catch (err) {
      console.log(err);
    }
  },
  getContacttracing: async (req,res) => {
    try {
      res.render("contacttracing.ejs", {user: req.user});
    }catch (err) {
      console.log(err);
    }
  },
  getResourcePage: async (req,res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      const intake = await Intake.find({ user: req.user.id});
      console.log(intake, intake.length)
      let startDate, name, countdownDate;
      if (intake.length === 0){
        startDate = null;
        name = null;
        countdownDate = null;
      } else {
        name = intake[0].fullname;
        startDate = intake[0].startdate;
        const countdownStart = new Date(startDate);
        countdownDate = new Date(countdownStart.setDate(countdownStart.getDate() + 10)).toString().slice(0,15);
      }

      const todaysDate = new Date().toString().slice(0,15);
       
      res.render("resourcePage.ejs", { posts: posts, user: req.user, name: name, intake: intake, countdownDate: countdownDate,  countdownStart: startDate, todaysDate: todaysDate});
    } catch (err) {
      console.log(err);
    }
  },
  getPastCheckins: async (req,res) => {
    try {
      const checkinsList = await Checkin.find({user: req.user.id});
      console.log(req.user.id, checkinsList)
      res.render("pastCheckins.ejs", { checkinsList: checkinsList});
    } catch (err) {
      console.log(err);
    }
  },
  getPatientList: async (req, res) => {
    try {
      const patients = await User.find({healthcareWorker: false});
      
      console.log('This is patients: ', patients)
      console.log('This is patients status: ', (patients[0].isolationStatus === 'true'))
    
      res.render("patientList.ejs", { patients: patients, nurseName: req.user.userName, nurseId: req.user.id});
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "desc" }).lean();;
      res.render("post.ejs", { post: post, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  createInitial: async (req,res) => {
    try {
      const start = new Date(req.body.startdate);
      const end = new Date(start.setDate(start.getDate() + 10));

      await Intake.create({
        fullName: req.body.fullname,
        dob: req.body.dob,
        phone: req.body.phone,
        prefcont: req.body.prefcont,
        startdate: req.body.startdate,
        enddate: end,
        cough: req.body.cough,
        soreThroat: req.body.sore,
        sob: req.body.sob,
        fever: req.body.fever,
        loss: req.body.loss,
        user: req.user.id,
      });

      const isolationStatus = new Date() < end;

      await User.updateOne({email: req.user.email},
        {$set: {
          intakeCompleted: true, isolationStatus: isolationStatus,
          fullName: req.body.fullname}}
        );

      console.log("Initial Intake Completed", req.user.id, req.user);
      res.redirect("/contacttracing");
    }catch (err) {
      console.log(err);
    }
  },
  createContact: async (req,res) => {
    try {
      await Contact.create({
        acquisitionCase: req.body.acquisitionCase,
        acquisition1: req.body.acquisition1,
        acquisition2: req.body.acquisition2,
        contact1: req.body.contact1,
        contact1Tel: req.body.contact1Tel,
        contact2: req.body.contact2,
        contact2Tel: req.body.contact2Tel,
        contact3: req.body.contact3,
        contact3Tel: req.body.contact3Tel,
        contact4: req.body.contact4,
        contact4Tel: req.body.contact4,
        user: req.user.id,
      });
      console.log("Contact Tracing Investigation started!")
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  createCheckin: async (req,res) => {
    //submit checkin form to mongodb
    try {
      console.log(req.body)
      await Checkin.create({
        fullName: req.body.fullname,
        cough: req.body.cough,
        soreThroat: req.body.sore,
        sob: req.body.sob,
        fever: req.body.fever,
        loss: req.body.loss,
        user: req.user.id,
      });
      console.log("Daily Check-in completed");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
  selfAssign: async (req,res) => {
    try {
      console.log('Self assigned!');
      console.log(req.params)
      await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: { 
            assignedNurse: req.params.nurse,
            assignedNurseId: req.params.nurseId},
        }
      );
      console.log("Nurse Changed");
      res.redirect(`/patientList`);
    } catch (err) {
      console.log(err); 
    }
  }
};
