import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let prisma: {
    categoria: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const categoriaMock = {
    id: 'categoria-1',
    nome: 'Bebidas',
    ativo: true,
    empresaId: 'empresa-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      categoria: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CategoriaService>(CategoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new categoria', async () => {
      const createDto = {
        nome: 'Bebidas',
        empresaId: 'empresa-1',
        ativo: true,
      };
      prisma.categoria.create.mockResolvedValue(categoriaMock);

      const result = await service.create(createDto);

      expect(prisma.categoria.create).toHaveBeenCalledWith({ data: createDto });
      expect(result).toEqual(categoriaMock);
    });
  });

  describe('findAll', () => {
    it('should return all categorias for a given empresa', async () => {
      prisma.categoria.findMany.mockResolvedValue([categoriaMock]);

      const result = await service.findAll('empresa-1');

      expect(prisma.categoria.findMany).toHaveBeenCalledWith({
        where: { empresaId: 'empresa-1' },
      });
      expect(result).toEqual([categoriaMock]);
    });

    it('should filter by empresaId', async () => {
      prisma.categoria.findMany.mockResolvedValue([]);

      await service.findAll('empresa-2');

      expect(prisma.categoria.findMany).toHaveBeenCalledWith({
        where: { empresaId: 'empresa-2' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a categoria when it exists and belongs to the empresa', async () => {
      prisma.categoria.findUnique.mockResolvedValue(categoriaMock);

      const result = await service.findOne('categoria-1', 'empresa-1');

      expect(prisma.categoria.findUnique).toHaveBeenCalledWith({
        where: { id: 'categoria-1' },
      });
      expect(result).toEqual(categoriaMock);
    });

    it('should throw NotFoundException when categoria does not exist', async () => {
      prisma.categoria.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne('categoria-not-found', 'empresa-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when categoria belongs to another empresa', async () => {
      prisma.categoria.findUnique.mockResolvedValue(categoriaMock);

      await expect(
        service.findOne('categoria-1', 'empresa-2'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a categoria', async () => {
      const updateDto = { nome: 'Bebidas Quentes' };
      const updated = { ...categoriaMock, ...updateDto };

      prisma.categoria.findUnique.mockResolvedValue(categoriaMock);
      prisma.categoria.update.mockResolvedValue(updated);

      const result = await service.update('categoria-1', 'empresa-1', updateDto);

      expect(prisma.categoria.update).toHaveBeenCalledWith({
        where: { id: 'categoria-1' },
        data: updateDto,
      });
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException when categoria does not exist', async () => {
      prisma.categoria.findUnique.mockResolvedValue(null);

      await expect(
        service.update('categoria-not-found', 'empresa-1', { nome: 'Novo Nome' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when trying to update categoria from another empresa', async () => {
      prisma.categoria.findUnique.mockResolvedValue(categoriaMock);

      await expect(
        service.update('categoria-1', 'empresa-2', { nome: 'Novo Nome' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a categoria', async () => {
      prisma.categoria.findUnique.mockResolvedValue(categoriaMock);
      prisma.categoria.delete.mockResolvedValue(categoriaMock);

      const result = await service.remove('categoria-1', 'empresa-1');

      expect(prisma.categoria.delete).toHaveBeenCalledWith({
        where: { id: 'categoria-1' },
      });
      expect(result).toEqual(categoriaMock);
    });

    it('should throw NotFoundException when categoria does not exist', async () => {
      prisma.categoria.findUnique.mockResolvedValue(null);

      await expect(
        service.remove('categoria-not-found', 'empresa-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when trying to delete categoria from another empresa', async () => {
      prisma.categoria.findUnique.mockResolvedValue(categoriaMock);

      await expect(
        service.remove('categoria-1', 'empresa-2'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
