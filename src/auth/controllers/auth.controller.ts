import { JwtAuthGuard } from "./../guards/jwt.guard";
import { LoginDto } from "./../dtos/login.dto";
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { Request } from "express";
import { GetUser } from "../decorators/get-user.decorator";
import { User } from "src/users/entities/users.entity";


@Controller("/auth")
export class AuthController {

  constructor(private authService: AuthService) {
  }


  @Post("/login")
  @HttpCode(200)
  login(
    @Body()
      loginDto: LoginDto
  ) {
    return this.authService.login(loginDto);
  }

  @Get("/profile")
  @UseGuards(JwtAuthGuard)
  profile(
    // @Req() res: Request
    @GetUser() user: User
  ) {
    user.password = undefined;
    return user;
  }

  @Get("/logout")
  @UseGuards(JwtAuthGuard)
  logout(
    @GetUser() user: User
  ) {
    return this.authService.logout(user);
  }

  @Post("/refresh")
  @HttpCode(200)
  refresh(
    @Body("refreshToken") refreshToken: string
  ) {
    return this.authService.refresh(refreshToken);
  }
}