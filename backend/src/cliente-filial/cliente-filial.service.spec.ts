import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ClienteFilialService } from './cliente-filial.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ClienteFilialService', () => {
  let service: ClienteFilialService;
  let prisma: {
    filial: { findFirst: jest.Mock };
    cliente: { findUnique: jest.Mock };
    clienteFilial: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      upsert: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      filial: { findFirst: jest.fn() },
      cliente: { findUnique: jest.fn() },
      clienteFilial: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        upsert: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [ClienteFilialService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(ClienteFilialService);
  });

  it('deve rejeitar ajuste sem pontos nem cashback', async () => {
    await expect(service.ajustar('empresa-1', 'filial-1', 'cliente-1', {})).rejects.toThrow(
      BadRequestException,
    );
  });

  it('deve rejeitar filial que não pertence à empresa do token', async () => {
    prisma.filial.findFirst.mockResolvedValue(null);

    await expect(
      service.ajustar('empresa-1', 'filial-1', 'cliente-1', { pontos: 10 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve creditar pontos somando ao saldo existente', async () => {
    prisma.filial.findFirst.mockResolvedValue({ id: 'filial-1', empresaId: 'empresa-1' });
    prisma.cliente.findUnique.mockResolvedValue({ id: 'cliente-1' });
    prisma.clienteFilial.findUnique.mockResolvedValue({
      pontosFidelidade: 5,
      saldoCashback: 2,
    });
    prisma.clienteFilial.upsert.mockResolvedValue({ pontosFidelidade: 15, saldoCashback: 2 });

    await expect(
      service.ajustar('empresa-1', 'filial-1', 'cliente-1', { pontos: 10 }),
    ).resolves.toEqual({ pontosFidelidade: 15, saldoCashback: 2 });

    expect(prisma.clienteFilial.upsert).toHaveBeenCalledWith({
      where: { clienteId_filialId: { clienteId: 'cliente-1', filialId: 'filial-1' } },
      update: { pontosFidelidade: 15, saldoCashback: 2 },
      create: {
        clienteId: 'cliente-1',
        filialId: 'filial-1',
        pontosFidelidade: 15,
        saldoCashback: 2,
      },
    });
  });

  it('deve rejeitar débito que deixaria o saldo negativo', async () => {
    prisma.filial.findFirst.mockResolvedValue({ id: 'filial-1', empresaId: 'empresa-1' });
    prisma.cliente.findUnique.mockResolvedValue({ id: 'cliente-1' });
    prisma.clienteFilial.findUnique.mockResolvedValue({ pontosFidelidade: 5, saldoCashback: 2 });

    await expect(
      service.ajustar('empresa-1', 'filial-1', 'cliente-1', { pontos: -10 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve listar vínculos do cliente ordenados por atualização', async () => {
    prisma.clienteFilial.findMany.mockResolvedValue([{ id: 'cf-1' }]);

    await expect(service.findAllByCliente('cliente-1')).resolves.toEqual([{ id: 'cf-1' }]);
    expect(prisma.clienteFilial.findMany).toHaveBeenCalledWith({
      where: { clienteId: 'cliente-1' },
      include: { filial: true },
      orderBy: { updatedAt: 'desc' },
    });
  });
});
