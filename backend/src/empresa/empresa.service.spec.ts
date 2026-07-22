import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EmpresaService', () => {
  let service: EmpresaService;
  let prisma: {
    empresa: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const empresaMock = {
    id: 'empresa-1',
    nomeFantasia: 'Restaurante Teste',
    cnpj: '12345678000199',
    telefone: '11999999999',
    email: 'contato@teste.com',
    ativo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      empresa: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmpresaService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<EmpresaService>(EmpresaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('cria uma empresa via prisma', async () => {
      prisma.empresa.create.mockResolvedValue(empresaMock);

      const dto = {
        nomeFantasia: empresaMock.nomeFantasia,
        cnpj: empresaMock.cnpj,
        telefone: empresaMock.telefone,
        email: empresaMock.email,
      };

      const result = await service.create(dto);

      expect(prisma.empresa.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(empresaMock);
    });
  });

  describe('findAll', () => {
    it('retorna todas as empresas', async () => {
      prisma.empresa.findMany.mockResolvedValue([empresaMock]);

      const result = await service.findAll();

      expect(result).toEqual([empresaMock]);
    });
  });

  describe('findOne', () => {
    it('retorna a empresa quando existe', async () => {
      prisma.empresa.findUnique.mockResolvedValue(empresaMock);

      const result = await service.findOne(empresaMock.id);

      expect(prisma.empresa.findUnique).toHaveBeenCalledWith({
        where: { id: empresaMock.id },
      });
      expect(result).toEqual(empresaMock);
    });

    it('lança NotFoundException quando não existe', async () => {
      prisma.empresa.findUnique.mockResolvedValue(null);

      await expect(service.findOne('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('atualiza a empresa quando existe', async () => {
      prisma.empresa.findUnique.mockResolvedValue(empresaMock);
      const atualizado = { ...empresaMock, nomeFantasia: 'Novo Nome' };
      prisma.empresa.update.mockResolvedValue(atualizado);

      const result = await service.update(empresaMock.id, {
        nomeFantasia: 'Novo Nome',
      });

      expect(prisma.empresa.update).toHaveBeenCalledWith({
        where: { id: empresaMock.id },
        data: { nomeFantasia: 'Novo Nome' },
      });
      expect(result).toEqual(atualizado);
    });

    it('lança NotFoundException ao atualizar empresa inexistente', async () => {
      prisma.empresa.findUnique.mockResolvedValue(null);

      await expect(
        service.update('id-inexistente', { nomeFantasia: 'X' }),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.empresa.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('remove a empresa quando existe', async () => {
      prisma.empresa.findUnique.mockResolvedValue(empresaMock);
      prisma.empresa.delete.mockResolvedValue(empresaMock);

      const result = await service.remove(empresaMock.id);

      expect(prisma.empresa.delete).toHaveBeenCalledWith({
        where: { id: empresaMock.id },
      });
      expect(result).toEqual(empresaMock);
    });

    it('lança NotFoundException ao remover empresa inexistente', async () => {
      prisma.empresa.findUnique.mockResolvedValue(null);

      await expect(service.remove('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.empresa.delete).not.toHaveBeenCalled();
    });
  });
});
