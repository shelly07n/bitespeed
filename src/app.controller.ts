import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestBody } from './dto/contact.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('identify')
  async identifyCustomer(@Body() RequestBody: RequestBody) {
    return await this.appService.identifyCustomer(RequestBody)
  }

}





