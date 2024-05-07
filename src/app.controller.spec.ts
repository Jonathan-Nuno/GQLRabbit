import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EdgesService } from './edges/edges.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Edge } from './edges/entities/edge.entity';
import { Repository } from 'typeorm';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';

describe('EdgesService', () => {
  let service: EdgesService;
  let mockRepository: jest.Mocked<Repository<Edge>>;
  let mockRabbitMQService: jest.Mocked<RabbitMQService>;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((edgeData) => ({
        ...edgeData,
        id: 'generated-id',
      })),
      save: jest.fn().mockImplementation((edge) => edge),
      delete: jest.fn().mockImplementation((id) => ({
        affected: id === '1' ? 1 : 0,
        raw: {},
      })),
      preload: jest.fn().mockImplementation((edge) => ({ ...edge, id: '1' })),
    } as any;

    mockRabbitMQService = {
      publishMessage: jest.fn(),
      subscribeToQueue: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EdgesService,
        {
          provide: getRepositoryToken(Edge),
          useValue: mockRepository,
        },
        {
          provide: RabbitMQService,
          useValue: mockRabbitMQService,
        },
      ],
    }).compile();

    service = module.get<EdgesService>(EdgesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all edges', async () => {
    mockRepository.find.mockResolvedValue([]);
    const result = await service.findAll();
    expect(result).toEqual([]);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('should find one edge by ID', async () => {
    const edge = {
      id: '1',
      node1Alias: 'Node1',
      node2Alias: 'Node2',
      capacity: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      edgePeers: `[Node1]-[Node2]`,
    };
    mockRepository.findOne.mockResolvedValue(edge);
    const result = await service.findOne('1');
    expect(result).toEqual(edge);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should create a new edge', async () => {
    const newData = {
      node1Alias: 'NewNode1',
      node2Alias: 'NewNode2',
      capacity: 500,
    };
    const expectedResult = { ...newData, id: 'generated-id' };
    const result = await service.create(newData);
    expect(result).toEqual(expectedResult);
    expect(mockRepository.create).toHaveBeenCalledWith(newData);
    expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
  });

  it('should handle errors when edge not found for findOne', async () => {
    const invalidId = 'non-existent-id';
    await expect(service.findOne(invalidId)).rejects.toThrow(
      new NotFoundException(`Edge with ID ${invalidId} not found`),
    );
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: invalidId },
    });
  });
});
