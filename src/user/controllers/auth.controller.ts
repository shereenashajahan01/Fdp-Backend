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
import { user } from "../user.entity";
import * as admin from "firebase-admin";
import { FileInterceptor } from "@nestjs/platform-express";
@Controller("/api/auth")
export class AuthController {
  constructor(private AuthService: AuthService) {}
  @Get("user")
  findAll() {
    return this.AuthService.findAll();
  }
  @Post("mail")
  public async findmail(@Body() user: user): Promise<any> {
    const { primary_email } = user;
    return this.AuthService.findmail(user.primary_email);
  }
  @Get(":id/userdetails")
  getPlans(@Req() req) {
    const url = req.url;
    const path = url.split("/");
    const paths = path[3];
    return this.AuthService.finduser(paths);
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
  @Post(":id/user")
  public async user(@Req() req): Promise<any> {
    const url = req.url;
    const path = url.split("/");
    const paths = path[3];
    const data = req.body;
    return this.AuthService.adduser(paths, data);
  }
  @Put(":id/:id/user")
  public async update(@Req() req): Promise<any> {
    const url = req.url;
    const path = url.split("/");
    const paths = path[3];
    const uid = path[4];
    const data = req.body;
    return this.AuthService.updateuser(paths, uid, data);
  }
  @Post("user")
  public async create(@Body() user: user): Promise<any> {
    const { primary_email, password, role } = user;
    try {
      const userss = await admin
        .auth()
        .createUser({ email: primary_email, password });
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
