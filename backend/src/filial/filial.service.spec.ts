import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { FilialService } from './filial.service';
import { PrismaService } from '../prisma/prisma.service';

describe('FilialService', () => {
  let service: FilialService;
  let prisma: PrismaService;

  const mockPrismaService = {
    filial: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilialService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FilialService>(FilialService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
  it('deve criar uma filial', async () => {
    const dto = {
      nome: 'Filial Centro',
      cnpj: '12.345.678/0001-90',
      telefone: '86999998888',
      endereco: 'Rua Principal, 100',
      empresaId: 'empresa-uuid-123',
    };

    const filialCriada = { id: 'filial-uuid-456', ...dto, ativo: true };

    mockPrismaService.filial.create.mockResolvedValue(filialCriada);

    const resultado = await service.create(dto);

    expect(mockPrismaService.filial.create).toHaveBeenCalledWith({ data: dto });
    expect(resultado).toEqual(filialCriada);
  });
});
});