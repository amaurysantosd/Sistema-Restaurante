import { Test, TestingModule } from '@nestjs/testing';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';

describe('EmpresaController', () => {
  let controller: EmpresaController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  const empresaMock = {
    id: 'empresa-1',
    nomeFantasia: 'Restaurante Teste',
    cnpj: '12345678000199',
    telefone: '11999999999',
    email: 'contato@teste.com',
    ativo: true,
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpresaController],
      providers: [{ provide: EmpresaService, useValue: service }],
    }).compile();

    controller = module.get<EmpresaController>(EmpresaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create delega para o service', async () => {
    service.create.mockResolvedValue(empresaMock);

    const dto = {
      nomeFantasia: empresaMock.nomeFantasia,
      cnpj: empresaMock.cnpj,
      telefone: empresaMock.telefone,
      email: empresaMock.email,
    };
    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(empresaMock);
  });

  it('findAll delega para o service', async () => {
    service.findAll.mockResolvedValue([empresaMock]);

    const result = await controller.findAll();

    expect(result).toEqual([empresaMock]);
  });

  it('findOne delega para o service', async () => {
    service.findOne.mockResolvedValue(empresaMock);

    const result = await controller.findOne(empresaMock.id);

    expect(service.findOne).toHaveBeenCalledWith(empresaMock.id);
    expect(result).toEqual(empresaMock);
  });

  it('update delega para o service', async () => {
    const atualizado = { ...empresaMock, nomeFantasia: 'Novo Nome' };
    service.update.mockResolvedValue(atualizado);

    const result = await controller.update(empresaMock.id, {
      nomeFantasia: 'Novo Nome',
    });

    expect(service.update).toHaveBeenCalledWith(empresaMock.id, {
      nomeFantasia: 'Novo Nome',
    });
    expect(result).toEqual(atualizado);
  });

  it('remove delega para o service', async () => {
    service.remove.mockResolvedValue(empresaMock);

    const result = await controller.remove(empresaMock.id);

    expect(service.remove).toHaveBeenCalledWith(empresaMock.id);
    expect(result).toEqual(empresaMock);
  });
});
