import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { HistoricoVisitaService } from './historico-visita.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HistoricoVisitaService', () => {
  let service: HistoricoVisitaService;
  let prisma: {
    cliente: { findUnique: jest.Mock };
    filial: { findUnique: jest.Mock };
    mesa: { findUnique: jest.Mock };
    clienteFilial: { upsert: jest.Mock };
    historicoVisita: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      cliente: { findUnique: jest.fn() },
      filial: { findUnique: jest.fn() },
      mesa: { findUnique: jest.fn() },
      clienteFilial: { upsert: jest.fn() },
      historicoVisita: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        HistoricoVisitaService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(HistoricoVisitaService);
  });

  it('deve registrar visita com filial e mesa válidas', async () => {
    prisma.cliente.findUnique.mockResolvedValue({ id: 'cliente-1' });
    prisma.filial.findUnique.mockResolvedValue({ id: 'filial-1' });
    prisma.mesa.findUnique.mockResolvedValue({ id: 'mesa-1', ambienteId: 'ambiente-1' });
    prisma.clienteFilial.upsert.mockResolvedValue({ id: 'cf-1' });
    prisma.historicoVisita.create.mockResolvedValue({ id: 'hv-1' });

    await expect(
      service.registrarVisita('cliente-1', 'filial-1', 'mesa-1'),
    ).resolves.toEqual({ id: 'hv-1' });

    expect(prisma.clienteFilial.upsert).toHaveBeenCalledWith({
      where: { clienteId_filialId: { clienteId: 'cliente-1', filialId: 'filial-1' } },
      update: {},
      create: { clienteId: 'cliente-1', filialId: 'filial-1' },
    });

    expect(prisma.historicoVisita.create).toHaveBeenCalledWith({
      data: {
        clienteId: 'cliente-1',
        filialId: 'filial-1',
        mesaId: 'mesa-1',
      },
    });
  });

  it('deve rejeitar cliente inexistente', async () => {
    prisma.cliente.findUnique.mockResolvedValue(null);

    await expect(service.registrarVisita('cliente-1', 'filial-1', undefined)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('deve listar visitas do cliente em ordem decrescente', async () => {
    prisma.historicoVisita.findMany.mockResolvedValue([{ id: 'hv-1' }]);

    await expect(service.findAllByCliente('cliente-1')).resolves.toEqual([{ id: 'hv-1' }]);
    expect(prisma.historicoVisita.findMany).toHaveBeenCalledWith({
      where: { clienteId: 'cliente-1' },
      include: { filial: true, mesa: true },
      orderBy: { dataVisita: 'desc' },
    });
  });

  it('deve remover visita do cliente quando a visita existir', async () => {
    prisma.historicoVisita.findUnique.mockResolvedValue({ id: 'hv-1', clienteId: 'cliente-1' });
    prisma.historicoVisita.delete.mockResolvedValue({ id: 'hv-1' });

    await expect(service.removerVisita('cliente-1', 'hv-1')).resolves.toEqual({ id: 'hv-1' });
    expect(prisma.historicoVisita.delete).toHaveBeenCalledWith({
      where: { id: 'hv-1' },
    });
  });

  it('deve lançar NotFoundException quando a visita não pertence ao cliente', async () => {
    prisma.historicoVisita.findUnique.mockResolvedValue(null);

    await expect(service.removerVisita('cliente-1', 'hv-1')).rejects.toThrow(NotFoundException);
  });
});
