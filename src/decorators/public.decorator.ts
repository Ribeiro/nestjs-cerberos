import 'reflect-metadata';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to mark a method or class as public, meaning it does not require authentication.
 * This is typically used for routes that should be accessible without a valid JWT token.
 *
 * @returns {MethodDecorator & ClassDecorator} The decorator function.
 */
export function Public(): MethodDecorator & ClassDecorator {
  return (target: any, propertyKey?: string | symbol) => {
    if (propertyKey) {
      Reflect.defineMetadata(IS_PUBLIC_KEY, true, target, propertyKey);
    } else {
      Reflect.defineMetadata(IS_PUBLIC_KEY, true, target);
    }
  };
}
