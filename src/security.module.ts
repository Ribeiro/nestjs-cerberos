import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class SecurityModule {}
