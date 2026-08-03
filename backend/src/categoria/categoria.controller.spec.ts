import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';

describe('CategoriaController', () => {
  let controller: CategoriaController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  const categoriaMock = {
    id: 'categoria-1',
    nome: 'Bebidas',
    ativo: true,
    empresaId: 'empresa-1',
  };

  // empresaId vem do token (req.user), nao mais de argumento direto -- mesmo
  // padrao usado pelos outros controllers protegidos por JwtAuthGuard.
  const reqMock = (empresaId: string) => ({ user: { empresaId } }) as any;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaController],
      providers: [{ provide: CategoriaService, useValue: service }],
    }).compile();

    controller = module.get<CategoriaController>(CategoriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should delegate to the service', async () => {
      service.create.mockResolvedValue(categoriaMock);

      const dto = {
        nome: categoriaMock.nome,
        empresaId: categoriaMock.empresaId,
        ativo: categoriaMock.ativo,
      };
      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(categoriaMock);
    });
  });

  describe('findAll', () => {
    it('should delegate to the service with empresaId', async () => {
      service.findAll.mockResolvedValue([categoriaMock]);

      const result = await controller.findAll(reqMock('empresa-1'));

      expect(service.findAll).toHaveBeenCalledWith('empresa-1');
      expect(result).toEqual([categoriaMock]);
    });

    it('should filter by empresaId', async () => {
      service.findAll.mockResolvedValue([]);

      await controller.findAll(reqMock('empresa-2'));

      expect(service.findAll).toHaveBeenCalledWith('empresa-2');
    });
  });

  describe('findOne', () => {
    it('should delegate to the service with id and empresaId', async () => {
      service.findOne.mockResolvedValue(categoriaMock);

      const result = await controller.findOne('categoria-1', reqMock('empresa-1'));

      expect(service.findOne).toHaveBeenCalledWith('categoria-1', 'empresa-1');
      expect(result).toEqual(categoriaMock);
    });

    it('should throw NotFoundException when categoria not found', async () => {
      service.findOne.mockRejectedValue(new NotFoundException());

      await expect(
        controller.findOne('categoria-not-found', reqMock('empresa-1')),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when categoria belongs to another empresa', async () => {
      service.findOne.mockRejectedValue(new NotFoundException());

      await expect(
        controller.findOne('categoria-1', reqMock('empresa-2')),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should delegate to the service', async () => {
      const updated = { ...categoriaMock, nome: 'Bebidas Quentes' };
      service.update.mockResolvedValue(updated);

      const updateDto = { nome: 'Bebidas Quentes' };
      const result = await controller.update('categoria-1', reqMock('empresa-1'), updateDto);

      expect(service.update).toHaveBeenCalledWith('categoria-1', 'empresa-1', updateDto);
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException when categoria not found', async () => {
      service.update.mockRejectedValue(new NotFoundException());

      await expect(
        controller.update('categoria-not-found', reqMock('empresa-1'), { nome: 'Novo Nome' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delegate to the service', async () => {
      service.remove.mockResolvedValue(categoriaMock);

      const result = await controller.remove('categoria-1', reqMock('empresa-1'));

      expect(service.remove).toHaveBeenCalledWith('categoria-1', 'empresa-1');
      expect(result).toEqual(categoriaMock);
    });

    it('should throw NotFoundException when categoria not found', async () => {
      service.remove.mockRejectedValue(new NotFoundException());

      await expect(
        controller.remove('categoria-not-found', reqMock('empresa-1')),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
