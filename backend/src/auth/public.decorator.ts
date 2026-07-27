import { SetMetadata } from '@nestjs/common';

// Chave usada internamente para marcar uma rota como publica
export const IS_PUBLIC_KEY = 'isPublic';

// Decorator que marca uma rota (ou controller inteiro) como publica,
// ou seja, que NAO exige token JWT, mesmo estando dentro de um
// controller protegido por @UseGuards(JwtAuthGuard).
// Uso: @Public() em cima do metodo do controller.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);