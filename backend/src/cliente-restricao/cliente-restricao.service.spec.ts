import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ClienteRestricaoService } from './cliente-restricao.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ClienteRestricaoService', () => {
  let service: ClienteRestricaoService;
  let prisma: {
    cliente: { findUnique: jest.Mock };
    restricaoAlimentar: { findUnique: jest.Mock };
    clienteRestricao: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      cliente: { findUnique: jest.fn() },
      restricaoAlimentar: { findUnique: jest.fn() },
      clienteRestricao: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        ClienteRestricaoService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ClienteRestricaoService);
  });

  it('deve vincular uma restrição a um cliente válido', async () => {
    prisma.cliente.findUnique.mockResolvedValue({ id: 'cliente-1' });
    prisma.restricaoAlimentar.findUnique.mockResolvedValue({ id: 'restricao-1' });
    prisma.clienteRestricao.findUnique.mockResolvedValue(null);
    prisma.clienteRestricao.create.mockResolvedValue({ id: 'cr-1' });

    await expect(service.vincularRestricao('cliente-1', 'restricao-1')).resolves.toEqual({ id: 'cr-1' });
    expect(prisma.clienteRestricao.create).toHaveBeenCalledWith({
      data: { clienteId: 'cliente-1', restricaoId: 'restricao-1' },
    });
  });

  it('deve rejeitar cliente inexistente', async () => {
    prisma.cliente.findUnique.mockResolvedValue(null);

    await expect(service.vincularRestricao('cliente-1', 'restricao-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('deve listar restrições do cliente em ordem decrescente', async () => {
    prisma.clienteRestricao.findMany.mockResolvedValue([{ id: 'cr-1' }]);

    await expect(service.findAllByCliente('cliente-1')).resolves.toEqual([{ id: 'cr-1' }]);
    expect(prisma.clienteRestricao.findMany).toHaveBeenCalledWith({
      where: { clienteId: 'cliente-1' },
      include: { restricao: true },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('deve remover vinculo quando estiver presente', async () => {
    prisma.clienteRestricao.findUnique.mockResolvedValue({ id: 'cr-1' });
    prisma.clienteRestricao.delete.mockResolvedValue({ id: 'cr-1' });

    await expect(service.desvincularRestricao('cliente-1', 'restricao-1')).resolves.toEqual({ id: 'cr-1' });
    expect(prisma.clienteRestricao.delete).toHaveBeenCalledWith({
      where: { clienteId_restricaoId: { clienteId: 'cliente-1', restricaoId: 'restricao-1' } },
    });
  });

  it('deve lançar NotFoundException quando o vínculo não existe', async () => {
    prisma.clienteRestricao.findUnique.mockResolvedValue(null);

    await expect(service.desvincularRestricao('cliente-1', 'restricao-1')).rejects.toThrow(NotFoundException);
  });
});
