import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class RedirectController {
  @Get()
  @Redirect('/api', 302)
  root() {
    return;
  }
}
