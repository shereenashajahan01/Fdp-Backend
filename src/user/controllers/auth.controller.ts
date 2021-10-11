import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
} from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { users } from "../user.entity";
import * as admin from "firebase-admin";
import { FileInterceptor } from "@nestjs/platform-express";
import { creden } from "src/shared/creden";
import { AxiosResponse } from "axios";
import { query } from "express";
import { Observable, map } from "rxjs";
import { API_URL } from "src/shared/urls";
import { HttpService } from "@nestjs/axios";
@Controller("/api/fdp")
export class AuthController {

  constructor(private AuthService: AuthService, private httpService: HttpService) {}
  @Get("users")
  findAll() {
    return this.AuthService.findAll();
  }
  @Post("register")
  public async findmail(@Body() user: users): Promise<any> {
    const { primary_email, firstname, lastname, designation, mobile_number } =
      user;
    return this.AuthService.findmail(
      user.primary_email,
      user.firstname,
      user.lastname,
      user.designation,
      user.mobile_number,
      user.company
    );
  }
  @Get("gettoken")
  public  token(@Req() req, @Res() res) {
  const user_details ={
     identifier:"officefdp87@gmail.com",
   password: "Fdpproject123",
  }
  return this.AuthService.gettoken(user_details);
    }
  @Get(":id/getdetails")
  async getPlans(@Req() req) {
    const url = req.url;
    const path = url.split("/");
    
    const pathss = path[4];
    const pathsss = pathss.split("?");
    const newurl = pathsss[1];
    const paths = path[3];
   
    if (newurl) {
      return this.AuthService.finduserquery(paths, newurl);
    } else {
      return this.AuthService.finduser(paths);
    }
  }
  @Get(":id/:id/getid")
  getPlansid(@Req() req) {
    const url = req.url;
    const path = url.split("/");
    const paths = path[3];
    const uid = path[4];
    return this.AuthService.finduserid(paths, uid);
  }
  @Delete(":id/:id/delete")
  async delete(@Req() req) {
    const url = req.url;
    const path = url.split("/");
    const uid = path[4];
    const paths = path[3];
    return this.AuthService.delete(paths, uid);
  }
  @Get(":id")
  findOne(@Param("id") uid: string) {
    return this.AuthService.findOne(uid);
  }
  @Post(":id/createtable")
  public async user(@Req() req): Promise<any> {
    const url = req.url;
    const path = url.split("/");
    const paths = path[3];
    const data = req.body;
    return this.AuthService.adduser(paths, data);
  }
  @Put(":id/:id/updatetable")
  public async update(@Req() req): Promise<any> {
    const url = req.url;
    const path = url.split("/");
    const paths = path[3];
    const uid = path[4];
    const data = req.body;
    return this.AuthService.updateuser(paths, uid, data);
  }
  @Post("createuser")
  public async create(@Body() user: users): Promise<any> {
    const { primary_email, password, role } = user;
    console.log(primary_email)
    try {
      const userss = await admin
        .auth()
        .createUser({email: primary_email, password });
      await admin.auth().setCustomUserClaims(userss.uid, { role });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
    const uuid = await admin.auth().getUserByEmail(primary_email);
    return this.AuthService.create(user, uuid.uid);
  }
  @Post("csv")
  @UseInterceptors(
    FileInterceptor("csv", {
      dest: "./file",
    })
  )
  public async uploadFile(@UploadedFile() file) {
    return await this.AuthService.parse(file.path);
  }
}
