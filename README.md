# 🛡️ nestjs-cerberos

A reusable NestJS authentication guard library with JWT support and structured logging.

## 🚀 Features

- 🔐 JWT-based authentication guard
- ⚙️ Configurable via `@nestjs/config`
- 🧪 Well-tested with Jest
- 🧾 Custom exception messages
- 📓 Integrated logging via injectable `LoggerService`

## 📦 Installation

```bash
npm install nestjs-cerberos
# or
yarn add nestjs-cerberos
```

## 🛠️ Usage

### Register JWT module and logger:

```ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from 'nestjs-cerberos';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    {
      provide: 'LoggerService',
      useClass: SeuLoggerCustomizado, // ou console se preferir
    },
    AuthGuard,
  ],
  exports: [AuthGuard],
})
export class AuthModule {}
```

### Protect routes using AuthGuard:

```ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'nestjs-cerberos';

@Controller('secure')
@UseGuards(AuthGuard)
export class SecureController {
  @Get()
  getSecureData() {
    return { data: 'access granted' };
  }
}
```

### Release routes using @Public():

```ts
import { Controller, Get } from '@nestjs/common';
import { Public } from 'nestjs-cerberos';

@Controller('status')
export class StatusController {
  @Public()
  @Get()
  healthCheck() {
    return { status: 'ok' };
  }
}
```

## 🧪 Running Tests

```bash
npm test
```

### Project Structure

```bash
nestjs-cerberos/
├── decorators/
│   └── public.decorator.ts
├── dto/
│   └── unauthorized-response.dto.ts
├── guards/
│   └── auth.guard.ts
├── test/
│   └── auth.guard.spec.ts
├── .gitignore
├── jest.config.js
├── package.json
├── README.md
├── tsconfig.json
```

### Features
✔️ Support for JWT
✔️ Injection of custom LoggerService
✔️ @Public() decorator to bypass authentication
✔️ Payload typing via JwtPayload
✔️ Tests with 100% coverage


## 🔐 License

This project is licensed under the MIT License.
