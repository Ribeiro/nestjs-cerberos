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

### 1. Import and use the `AuthGuard`

```ts
import { AuthGuard } from 'nestjs-cerberos';
```

### 2. Register it in your controller

```ts
@UseGuards(AuthGuard)
@Controller('example')
export class ExampleController {
  @Get()
  getData() {
    return { message: 'Protected data' };
  }
}
```

## 🧪 Running Tests

```bash
npm test
```

## 🔐 License

This project is licensed under the MIT License.
