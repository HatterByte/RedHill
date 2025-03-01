import User from "../models/User.js";
import Complaints from "../models/Complaints.js";
import pnrData from "../models/PnrData.js";
import trainData from "../models/Train.js";
import employeeData from "../models/Employee.js";
import trainstatus from "../models/Trainstatus.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import axios from "axios";

export const createComplaint = async (req, res) => {
  const categoryMap = {
    medicalassistance: "Medical Assistance",
    security: "Security",
    eveteasingmisbehaviourwithladypassengersrape:
      "Eve-teasing/ /Misbehaviour with lady passengers/Rape",
    theftofpassengersbelongingssnatching:
      "Theft of Passengers Belongings/Snatching",
    unauthorizedpersoninladiesdisabledcoachslrrreservecouch:
      "Unauthorized person in Ladies/Disabled Coach/SLR/Reserve Coach",
    harassmentextortionbysecuritypersonnelrailwaypersonnel:
      "Harassment/Extortion by Security Personnel/Railway personnel",
    nuisancebyhawkersbeggareunuch: "Nuisance by Hawkers/Beggar/Eunuch",
    luggageleftbehindunclaimedsuspectedarticles:
      "Luggage Left Behind/Unclaimed/Suspected Articles",
    passengermissingnotrespondingcall: "Passenger Missing/Not responding call",
    smokingdrinkingalcoholnarcotics: "Smoking/Drinking Alcohol/Narcotics",
    dacoityrobberymurderriots: "Dacoity/Robbery/Murder/Riots",
    quarrellinghooliganism: "Quarrelling/Hooliganism",
    passengerfallendown: "Passenger fallen down",
    nuisancebypassenger: "Nuisance by passenger",
    misbehaviour: "Misbehaviour",
    others: "Others",
    divyangjanfacilities: "Divyangjan Facilities",
    divyangjancoachunavailability: "Divyangjan coach unavailability",
    divyangjantoiletwashbasin: "Divyangjan toilet /washbasin",
    braillesignageincoach: "Braille signage in coach",
    facilitiesforwomenwithspecialneeds:
      "Facilities for Women with Special needs",
    babyfood: "Baby Food",
    electricalequipment: "Electrical Equipment",
    airconditioner: "Air Conditioner",
    fans: "Fans",
    lights: "Lights",
    chargingpoints: "Charging Points",
    coachcleanliness: "Coach-Cleanliness",
    toilet: "Toilet",
    washbasin: "Washbasin",
    cockroachrodents: "Cockroach / Rodents",
    coachinterior: "Coach Interior",
    coachexterior: "Coach Exterior",
    punctuality: "Punctuality",
    ntesapp: "NTES APP",
    laterunning: "Late Running",
    wateravailability: "Water Availability",
    packagesdrinkingwaterrailneer: "Packages Drinking Water / Rail Neer",
    coachmaintenance: "Coach - Maintenance",
    windowseatbroken: "Window/Seat Broken",
    windowdoorlockingproblem: "Window/Door locking problem",
    tapleakingtapnotworking: "Tap leaking/Tap not working",
    brokenmissingtoiletfittings: "Broken/Missing Toilet Fittings",
    jerksabnormalsound: "Jerks/Abnormal Sound",
    cateringvendingservices: "Catering & Vending Services",
    overcharging: "Overcharging",
    servicequalityhygiene: "Service Quality & Hygiene",
    foodqualityquantity: "Food Quality & Quantity",
    ecatering: "E-Catering",
    foodwaternotavailable: "Food & Water Not Available",
    staffbehaviour: "Staff Behaviour",
    corruptionbribery: "Corruption/ Bribery",
    bedroll: "Bed Roll",
    dirtytorn: "Dirty / Torn",
    nonavailability: "Non Availability",
    miscellaneous: "Miscellaneous",
  };

  const severityScores = {
    "Coach Maintenance": 2,
    "Catering & Vending Services": 2,
    "Staff Behaviour": 2,
    "Corruption/ Bribery": 2,
    "Bed Roll": 2,
    Miscellaneous: 1,
    "Medical Assistance": 3,
    Security: 3,
    "Divyangjan Facilities": 2,
    "Facilities for Women with Special needs": 2,
    "Electrical Equipment": 2,
    "Coach Cleanliness": 2,
    Punctuality: 1,
    "Water Availability": 2,
  };

  function generateTicketId(baseId) {
    // Generate a random 4-digit number
    const randomPart = Math.floor(Math.random() * 9000) + 1000;

    // Combine base ID with random number
    const uniqueTicketId = parseInt(`${baseId}${randomPart}`);

    return uniqueTicketId;
  }

  let ticketid = generateTicketId(1234567321);

  const PNR = req.body.pnrNo;
  const PNRLink = req.body.pnrLink;
  const Phone = req.body.mobileNo;
  const complaintMedia = req.body.files;
  const complaintDesc = req.body.grievanceDescription;
  const loggedIn = req.loggedIn;

  console.log(req.body);
  let user;

  function generateRandomPassword(length = 15) {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  function generatelinks(files) {
    let op = {
      video: [],
      image: [],
      audio: [],
    };

    for (const file of files) {
      if (file.toLowerCase().indexOf("image") !== -1) {
        op["image"].push(file);
      } else if (file.toLowerCase().indexOf("video") !== -1) {
        if (
          file.toLowerCase().includes("mp3") ||
          file.toLowerCase().includes("wav")
        ) {
          op["audio"].push(file);
        } else {
          op["video"].push(file);
        }
      }
    }
    return op;
  }

  function sanitizeString(input) {
    let tex = input.toLowerCase().replaceAll(/[\s\-\_\$\&]/g, "");
    return tex.replaceAll("/", "");
  }

  if (!PNR && PNRLink) {
    // resp =await axios.post("http://192.168.84.111:8007/process_complaint/",{"text":"look for my PNR in the given image pls","image_links":[PNRLink]})
    PNR = "123";
  }
  if (!PNR) {
    return res.status(422).json({ message: "2PNR NOT FOUND" });
  }

  if (loggedIn) {
    user = await User.findOne({ _id: req.user._id });
    if (!user) {
      res
        .status(500)
        .json({ message: "logged in user Not Found. Internal Servor Error" });
    }
  } else {
    user = await User.findOne({ phone: Phone });
  }
  if (!user) {
    const hashPassword = await bcryptjs.hash(generateRandomPassword(), 10);
    user = await User.create({
      phone: Phone,
      password: hashPassword,
      name: "DATA FROM PNR",
      complaintTickets: [],
      email: "test@gmail.com",
    });
  }

  let category = "security";
  let subCategory =
    "Unauthorized person in Ladies/Disabled 03/1 Comp Coach/SLR/Reserve Coach";
  let severity = 0;

  let linkObj = generatelinks(complaintMedia);
  let complaint_data = {
    text: `${complaintDesc}`,
    image_urls: linkObj["image"],
    video_urls: linkObj["video"],
    audio_urls: linkObj["audio"],
  };
  let resp = "";
  try {
    // resp = await axios.post(
    //   "http://172.16.9.161:9017/classify_complaint/",
    //   complaint_data
    // );
    resp = await axios.post(
      "http://localhost:5000/test/classify-complaint",
      complaint_data
    );
    console.log(resp.data);
    category = resp.data.category;
    subCategory = resp.data.subcategory;
    severity = severityScore(category);
    // console.log(category);
  } catch (err) {
    console.log(err);
  }

  // const dataFromPnr = await pnrData.findOne({ pnrNumber: PNR });
  const dataFromPnr = {
    pnrNumber: "1234567890",
    passangers: [
      {
        name: "Rahul Sharma",
        gender: "Male",
        age: 28
      }
    ],
    trainCode: "12345",
    trainName: "Rajdhani Express",
    trainDepartureDate: new Date("2025-03-01T10:00:00Z")
  };
  if (!dataFromPnr) {
    return res.status(422).json({ message: "3PNR NOT FOUND" });
  }
  //    console.log(dataFromPnr)
  let newComplaint = new Complaints({
    complaintId: ticketid,
    phone: Phone,
    user_Id: user._id,
    name: dataFromPnr.passangers[0].name,
    gender: dataFromPnr.passangers[0].gender,
    age: dataFromPnr.passangers[0].age,
    pnr: PNR,
    trainCode: dataFromPnr.trainCode,
    trainName: dataFromPnr.trainName,
    trainDepartureDate: dataFromPnr.trainDepartureDate,
    media: complaintMedia,
    description: complaintDesc,
    category: category,
    subCategory: subCategory,
    employeeWorking: "",
    resolved: 0,
    severity: severity,
  });

  await newComplaint.save();
  let currentId = ticketid;
  ticketid = ticketid + 1;
  user.complaintTickets.push(currentId);
  await user.save();
  resp = await trainstatus.findOne({ train_code: dataFromPnr.trainCode });
  if (!resp) {
    resp = await trainstatus.find();
    return res.status(500).json(resp);
  }
  let station = resp.stations[Math.floor(Math.random() * resp.stations.length)];

  category = sanitizeString(category);
  subCategory = sanitizeString(subCategory);

  if (category != "") {
    // console.log("done1")
    let dataFromTrain = await trainData.findOne({
      $and: [
        { trainCode: dataFromPnr.trainCode },
        { trainDepartureDate: dataFromPnr.trainDepartureDate },
        { station: station },
      ],
    });
    // console.log(dataFromPnr)
    // console.log(dataFromTrain)
    // return res.status(200)
    console.log(dataFromTrain.category[category][subCategory]);
    console.log(subCategory);
    let employeeId = dataFromTrain.category[category][subCategory];
    console.log(employeeId);
    await Complaints.findOneAndUpdate(
      { complaintId: currentId },
      {
        $set: {
          category: category,
          subCategory: subCategory,
          employeeWorking: employeeId,
          severity: severity,
        },
      }
    );
    // console.log("done3")
    const emp = await employeeData.findOne({ employeeId: employeeId });
    console.log(emp);
    emp.complaints.push(currentId);
    emp.save();
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      //only manipulate by server not by client/user
      secure: false,
      httpOnly: true,
    };
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    if (loggedIn) {
      return res
        .status(200)
        .json({
          message: "Complaint Registered Succesfully",
          complaintId: currentId,
          category: categoryMap[category],
          subCategory: categoryMap[subCategory],
        });
    }
    return res
      .cookie("acessToken", token, options)
      .status(200)
      .json({
        message: "Complaint Registered Succesfully",
        complaintId: currentId,
        category: category,
        subCategory: subCategory,
      });
  } else {
    if (loggedIn) {
      return res
        .status(500)
        .json({ message: "Complaint Registered Succesfully" });
    }
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      //only manipulate by server not by client/user
      secure: false,
      httpOnly: true,
    };
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    return res
      .cookie("accessToken", token, options)
      .status(500)
      .json({
        message: "Could not Register complaint,Complaint is saved but ",
      });
  }
};


export const updateComplaint = async (req, res) => {
  const severityScores = {
    "Coach Maintenance": 2,
    "Catering & Vending Services": 2,
    "Staff Behaviour": 2,
    "Corruption/ Bribery": 2,
    "Bed Roll": 2,
    Miscellaneous: 1,
    "Medical Assistance": 3,
    Security: 3,
    "Divyangjan Facilities": 2,
    "Facilities for Women with Special needs": 2,
    "Electrical Equipment": 2,
    "Coach Cleanliness": 2,
    Punctuality: 1,
    "Water Availability": 2,
  };

  // function sanitizeString(input) {
  //     let tex=input.toLowerCase().replaceAll(/[\s\-\_\$\&]/g, '');
  //     return tex.replaceAll("/","")
  // }

  const { complaintId, categoryFromUser, subCategoryFromUser } = req.body;
  // console.log(req.body);
  if (!req.loggedIn) {
    return res.status(404).json({ message: "Unauthorized" });
  }
  let category = categoryFromUser;
  let subCategory = subCategoryFromUser;

  try {
    let temp = await Complaints.find({ complaintId });
    console.log(temp);
    let working = temp[0].employeeWorking;
    console.log(working);
    let emp = await employeeData.findOne({ employeeId: working });
    emp.complaints = emp.complaints.filter((item) => item !== complaintId);
    const dataFromPnr = await pnrData.findOne({ pnrNumber: temp[0].pnr });
    let resp = await trainstatus.findOne({ train_code: dataFromPnr.trainCode });
    if (!resp) {
      resp = await trainstatus.find();
      return res.status(500).json(resp);
    }
    let station =
      resp.stations[Math.floor(Math.random() * resp.stations.length)];

    let dataFromTrain = await trainData.findOne({
      $and: [
        { trainCode: dataFromPnr.trainCode },
        { trainDepartureDate: dataFromPnr.trainDepartureDate },
        { station: station },
      ],
    });
    // let employeeId=dataFromTrain.category[category][subCategory]
    let severity = severityScores[category];
    await Complaints.findOneAndUpdate(
      { complaintId: complaintId },
      {
        $set: {
          category: category,
          subCategory: subCategory,
          severity: severity,
        },
      }
    );
    // const emp1=await employeeData.findOne({employeeId:employeeId})
    // console.log(emp);
    // emp1.complaints.push(complaintId)
    // emp1.save()
    res.status(200).json({ message: "successfully changed" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "unsuccessfully changed" });
  }
};
