import { Test, TestingModule } from '@nestjs/testing';
import { StatusReserva } from '@prisma/client';
import { ReservaService } from './reserva.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ReservaService', () => {
  let service: ReservaService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      filial: {
        findUnique: jest.fn(),
      },
      ambiente: {
        findFirst: jest.fn(),
      },
      mesa: {
        findFirst: jest.fn(),
      },
      evento: {
        findMany: jest.fn(),
      },
      cliente: {
        findUnique: jest.fn(),
      },
      reserva: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      empresa: {
        findUniqueOrThrow: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservaService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ReservaService>(ReservaService);
  });

  describe('criar', () => {
    it('deve rejeitar reserva quando já existe outra para a mesma mesa no mesmo horário', async () => {
      const dto = {
        dataHora: '2026-08-15T20:00:00.000Z',
        quantidadePessoas: 2,
        filialId: 'filial-1',
        mesaId: 'mesa-1',
      };

      prisma.filial.findUnique.mockResolvedValue({
        id: 'filial-1',
        empresaId: 'empresa-1',
        reservaPercentualSinalPadrao: 0,
      });
      prisma.mesa.findFirst.mockResolvedValue({ id: 'mesa-1' });
      prisma.evento.findMany.mockResolvedValue([]);
      prisma.reserva.findMany.mockResolvedValue([
        {
          id: 'reserva-existente',
          dataHora: new Date('2026-08-15T20:00:00.000Z'),
          status: StatusReserva.PENDENTE,
          mesaId: 'mesa-1',
        },
      ]);

      await expect(service['criar'](dto as any, {} as any)).rejects.toThrow(
        'Já existe uma reserva para esta mesa nesse horário',
      );
    });

    it('deve rejeitar reserva quando um evento sazonal bloqueia a filial no período', async () => {
      const dto = {
        dataHora: '2026-12-31T22:00:00.000Z',
        quantidadePessoas: 4,
        filialId: 'filial-1',
      };

      prisma.filial.findUnique.mockResolvedValue({
        id: 'filial-1',
        empresaId: 'empresa-1',
        reservaPercentualSinalPadrao: 0,
      });
      prisma.evento.findMany.mockResolvedValue([
        {
          id: 'evento-bloqueio',
          nome: 'Réveillon',
          tipo: 'SAZONAL',
          filialId: 'filial-1',
          ambienteId: null,
        },
      ]);
      prisma.reserva.findMany.mockResolvedValue([]);

      await expect(service['criar'](dto as any, {} as any)).rejects.toThrow(
        'Não é possível reservar: o evento "Réveillon" bloqueia este horário',
      );
    });
  });
});
