import { HttpService } from "@nestjs/axios";
import { Header, Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AxiosResponse } from "axios";
import admin from "firebase-admin";
import { map, Observable } from "rxjs";
import { API_URL } from "../../shared/urls";
const express = require("express");
const nodemailer = require("nodemailer");
import { Repository } from "typeorm";
import { users } from "../user.entity";
import { token } from "src/shared/token";
import { creden } from "src/shared/creden";

const fastcsv = require("fast-csv");
var fs = require("fs");
const pool = require('./pgdb');
const hbs = require('nodemailer-handlebars');
Injectable();
export class AuthService {
  constructor(
    @InjectRepository(users) private tasksRepo: Repository<users>,
    private httpService: HttpService
  ) {}
  findAll() {
    return this.tasksRepo.find();
  }
  findmail(user_email: any,firstname:any,lastname:any,designation:any,mobile_number:any,company:any) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: creden.user,
        pass: creden.pass,
      },
    });   
transporter.use('compile',hbs({
  viewEngine: {
      extname: '.handlebars',
      layoutsDir: './views/',
      defaultLayout : 'index',
  },
  viewPath: './views/'
}))
    let mailOptions = {
      from: '"No reply"<officefdp87@gmail.com>',
      to: user_email,
      subject: "Registration Confirmation : UAE Food Platform",
      //text: 'Wooohooo it works!!',
      template:'index',
      context: {
        name: firstname,
        company: company,
        email: user_email,
        Phone: mobile_number
    },
    //   attachments: [{
    //     filename: 'flower.jpg',
    //     path:__filename+"/flower.jpg",
    //     cid: 'flower' //same cid value as in the html img src
    // }]
     // context: output
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      return(info.messageId);  
    });
  }
  findOne(uid: string) {
    return this.tasksRepo.findOne(uid);
  }
  gettoken(user_details): Observable<AxiosResponse<[]>> {
    console.log(user_details)
    return this.httpService
    .post("https://fdp-strapi-backend.herokuapp.com/auth/local", user_details)
    .pipe(map((response) => response.data));
  }
  finduserquery(paths,query): Observable<AxiosResponse<[]>> {
    return this.httpService.get(API_URL + paths+'?'+ query,{
         headers: {
           Authorization: `Bearer ${token}`,
         }
        }
      )
.pipe(map((response) => response.data));
  }
  finduser(paths): Observable<AxiosResponse<[]>> {
     return this.httpService.get(API_URL + paths,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      )
.pipe(map((response) => response.data));
  }
  finduserid(paths,uid): Observable<AxiosResponse<[]>> {
    return this.httpService
      .get(API_URL + paths + "/"+uid,{
        headers: {
          Authorization: `Bearer ${token}`,
       }}
       )
      .pipe(map((response) => response.data));
  }
  delete(paths: string, uid: string): Observable<AxiosResponse<[]>> {
    console.log(API_URL + paths + "/" + uid);
    return this.httpService
      .delete(API_URL + paths + "/" + uid,{
        headers: {
          Authorization: `Bearer ${token}`,
        }})
      .pipe(map((response) => response.data));
  }
  adduser(paths: string, data): Observable<AxiosResponse<[]>> {
    return this.httpService
      .post(API_URL + paths,{
        headers: {
          Authorization: `Bearer ${token}`,
        }},data)
      .pipe(map((response) => response.data));
  }
  updateuser(paths: string, uid: string, data): Observable<AxiosResponse<[]>> {
    console.log(data);
    return this.httpService
      .put(API_URL + paths + "/" + uid,{
        headers: {
          Authorization: `Bearer ${token}`,
        }},data)
      .pipe(map((response) => response.data));
  }
  create(userss: any, uid: any) {
    const newTask = new users();
    newTask.company_id = userss.company_id;
    newTask.firstname = userss.firstname;
    newTask.lastname = userss.lastname;
    newTask.sex = userss.sex;
    newTask.date_of_birth = userss.date_of_birth;
    newTask.mobile_number = userss.mobile_number;
    newTask.designation = userss.designation;
    newTask.job_description = userss.job_description;
    newTask.portfolio = userss.portfolio;
    newTask.city = userss.city;
    newTask.country = userss.country;
    newTask.official_number = userss.official_number;
    newTask.primary_email = userss.primary_email;
    newTask.password = userss.password;
    newTask.secondary_email = userss.secondary_email;
    newTask.current_comapnay_experience = userss.current_comapnay_experience;
    newTask.previous_company = userss.previous_company;
    newTask.company = userss.company;
    newTask.linkdin = userss.linkdin;
    newTask.twitter = userss.twitter;
    newTask.instagram = userss.instagram;
    newTask.role = userss.role;
    newTask.user_id = uid;
    return this.tasksRepo.save(newTask);
  }
  async parse(users: any) {
    const stream = fs.createReadStream(users);
    let csvData = [];
    let csvStream = fastcsv
      .parse({ column: Header })
      .on("data", function (data) {
        csvData.push(data);
      })
      .on("end", function () {
        csvData.shift();
        const query =
          "INSERT INTO users() VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)";
        pool.connect((err, client, done) => {
          if (err) throw err;
          try {
            csvData.forEach(async (row) => {
              if (row[22] == "delete") {
                const email_id = row[12];
                const user_id = await admin.auth().getUserByEmail(email_id);
                const uid1 = user_id.uid;
                deletePlan(uid1);
              } else if (row[22] == "update") {
                const email = row[12];
                const user_id = await admin.auth().getUserByEmail(email);
                const uid1 = user_id.uid;
                const company_id = row[0];
                const firstname = row[1];
                const lastname = row[2];
                const sex = row[3];
                const date_of_birth = row[4];
                const mobile_number = row[5];
                const designation = row[6];
                const job_description = row[7];
                const portfolio = row[8];
                const city = row[9];
                const country = row[10];
                const official_number = row[11];
                const primary_email = row[12];
                const password = row[13];
                const secondary_email = row[14];
                const current_comapnay_experience = row[15];
                const previous_company = row[16];
                const company = row[17];
                const linkdin = row[18];
                const twitter = row[19];
                const instagram = row[20];
                const role = row[21];
                const action = row[22];
                updatePlan(
                  company_id,
                  firstname,
                  lastname,
                  sex,
                  date_of_birth,
                  mobile_number,
                  designation,
                  job_description,
                  portfolio,
                  city,
                  country,
                  official_number,
                  primary_email,
                  password,
                  secondary_email,
                  current_comapnay_experience,
                  previous_company,
                  company,
                  linkdin,
                  twitter,
                  instagram,
                  role,
                  action,
                  uid1
                );
              } else if (row[22] == "insert") {
                try {
                  const role = row[21];
                  const user = await admin
                    .auth()
                    .createUser({ password: row[13], email: row[12] });
                  await admin.auth().setCustomUserClaims(user.uid, { role });
                  const email = row[12];
                  row.push(user.uid);
                } catch (error) {
                  throw new UnauthorizedException(error.message);
                }
                client.query(query, row, (err, res) => {
                  if (err) {
                    console.log(err.stack);
                  } else {
                    console.log("inserted");
                  }
                });
              }
            });
          } finally {
            done();
          }
        });
      });
    stream.pipe(csvStream);
  }
}
function deletePlan(uid1: string) {
  pool.query("DELETE FROM users WHERE uid = $1", [uid1], (error, results) => {
    if (error) {
      throw error;
    }
    console.log("deleted");
  });
}
function updatePlan(
  company_id: string,
  firstname: String,
  lastname: String,
  sex: String,
  date_of_birth: Date,
  mobile_number: BigInteger,
  designation: String,
  job_description: String,
  portfolio: String,
  city: String,
  country: String,
  official_number: BigInteger,
  primary_email: String,
  password: String,
  secondary_email: String,
  current_comapnay_experience: String,
  previous_company: String,
  company: String,
  linkdin: String,
  twitter: String,
  instagram: String,
  role: String,
  action: String,
  uid1: String
) {
  pool.query(
    "UPDATE users SET designation = $1, role = $2 WHERE uid = $3",
    [designation, role, uid1],
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log("updated");
    }
  );
}
